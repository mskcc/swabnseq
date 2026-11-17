"""Photo gallery likes.

GET  /likes          -> {"counts": {photo: n}, "mine": [photo, ...], "signedIn": bool}
POST /likes/<photo>  -> toggles the signed-in user's like on <photo>

A like is tied to the MSK username in the IGO Marketplace login cookie ("jic",
an HS256 JWT signed with JWT_SECRET), so each person can like each photo once.
Likes are stored as {photo: [username, ...]} in a JSON file.
"""
import base64
import fcntl
import hashlib
import hmac
import json
import os
import tempfile
import time

from flask import Blueprint, jsonify, request

bp = Blueprint('likes', __name__)

COOKIE_NAME = 'jic'
APP_DIR = os.path.dirname(os.path.abspath(__file__))           # backend/src/app
BACKEND_DIR = os.path.dirname(os.path.dirname(APP_DIR))         # backend
REPO_DIR = os.path.dirname(BACKEND_DIR)

PROD_DIR = '/srv/www/swabNseq'
IMAGE_EXTS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')


def _gallery_base():
    prod = os.path.join(PROD_DIR, 'gallery')
    if os.path.isdir(prod):
        return prod
    return os.path.join(REPO_DIR, 'frontend', 'public', 'gallery')


def _likes_file():
    if os.environ.get('SWABNSEQ_LIKES_FILE'):
        return os.environ['SWABNSEQ_LIKES_FILE']
    if os.path.isdir(PROD_DIR):
        return os.path.join(PROD_DIR, 'likes.json')
    return os.path.join(BACKEND_DIR, 'likes.json')


def _b64url_decode(part):
    return base64.urlsafe_b64decode(part + '=' * (-len(part) % 4))


def current_username():
    """Username from a valid login cookie, else None."""
    token = request.cookies.get(COOKIE_NAME)
    secret = os.environ.get('JWT_SECRET')
    if not token or not secret:
        return None
    try:
        header_b64, payload_b64, sig_b64 = token.split('.')
        header = json.loads(_b64url_decode(header_b64))
        if header.get('alg') != 'HS256':
            return None
        expected = hmac.new(secret.encode(), ('%s.%s' % (header_b64, payload_b64)).encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(expected, _b64url_decode(sig_b64)):
            return None
        payload = json.loads(_b64url_decode(payload_b64))
        if 'exp' in payload and time.time() >= payload['exp']:
            return None
        username = payload.get('username')
        return username.lower() if isinstance(username, str) and username else None
    except (ValueError, TypeError, KeyError):
        return None


def _valid_photo(photo):
    """True only for an existing image file inside the gallery directory."""
    if not photo.lower().endswith(IMAGE_EXTS):
        return False
    base = os.path.normpath(_gallery_base())
    full = os.path.normpath(os.path.join(base, photo))
    return full.startswith(base + os.sep) and os.path.isfile(full)


class _LikesStore:
    """Read/modify/write the likes JSON under an exclusive file lock (safe across uWSGI workers)."""

    def __enter__(self):
        path = _likes_file()
        self.path = path
        self.lock = open(path + '.lock', 'a')
        fcntl.flock(self.lock, fcntl.LOCK_EX)
        try:
            with open(path) as f:
                self.data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.data = {}
        return self

    def save(self):
        fd, tmp = tempfile.mkstemp(dir=os.path.dirname(self.path), prefix='.likes-')
        with os.fdopen(fd, 'w') as f:
            json.dump(self.data, f)
        os.replace(tmp, self.path)

    def __exit__(self, *exc):
        fcntl.flock(self.lock, fcntl.LOCK_UN)
        self.lock.close()


@bp.route('/likes', methods=['GET'])
def get_likes():
    user = current_username()
    with _LikesStore() as store:
        counts = {photo: len(users) for photo, users in store.data.items() if users}
        mine = [photo for photo, users in store.data.items() if user and user in users]
    return jsonify({'counts': counts, 'mine': mine, 'signedIn': user is not None})


@bp.route('/likes/<path:photo>', methods=['POST'])
def toggle_like(photo):
    user = current_username()
    if not user:
        return jsonify({'error': 'Sign in to like photos'}), 401
    if not _valid_photo(photo):
        return jsonify({'error': 'Unknown photo'}), 404
    with _LikesStore() as store:
        users = store.data.setdefault(photo, [])
        if user in users:
            users.remove(user)
            liked = False
        else:
            users.append(user)
            liked = True
        store.save()
        count = len(users)
    return jsonify({'photo': photo, 'count': count, 'liked': liked})
