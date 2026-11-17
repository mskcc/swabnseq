"""Photo gallery likes (no sign-in).

GET  /likes          -> {"counts": {photo: n}, "mine": [photo, ...]}
POST /likes/<photo>  -> toggles this browser's like on <photo>

Each browser sends a random voter id (header X-Voter-Id, kept in localStorage),
so one browser = one like per photo. This is an honor system: a new browser or
incognito window gets a new id. A per-IP rate limit stops scripted spamming.
Likes are stored as {photo: [voter_id, ...]} in a JSON file.
"""
import fcntl
import json
import os
import re
import tempfile
import threading
import time
from collections import defaultdict, deque

from flask import Blueprint, jsonify, request

bp = Blueprint('likes', __name__)

APP_DIR = os.path.dirname(os.path.abspath(__file__))           # backend/src/app
BACKEND_DIR = os.path.dirname(os.path.dirname(APP_DIR))         # backend
REPO_DIR = os.path.dirname(BACKEND_DIR)

PROD_DIR = '/srv/www/swabNseq'
IMAGE_EXTS = ('.jpg', '.jpeg', '.png', '.gif', '.webp')
VOTER_ID = re.compile(r'^[A-Za-z0-9-]{16,64}$')

# Like/unlike clicks allowed per RATE_WINDOW seconds (per worker process). Sized for ~1000 visitors:
# per browser stops one person spamming; the per-IP backstop is high because visitors may all
# reach us through one proxy address.
RATE_PER_VOTER, RATE_PER_IP, RATE_WINDOW = 40, 2000, 60
_hits = defaultdict(deque)
_hits_lock = threading.Lock()


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


def _voter_id():
    vid = request.headers.get('X-Voter-Id', '')
    return vid if VOTER_ID.match(vid) else None


def _client_ip():
    # Behind nginx the real client is the first X-Forwarded-For entry.
    forwarded = request.headers.get('X-Forwarded-For', '')
    return forwarded.split(',')[0].strip() or request.remote_addr or 'unknown'


def _rate_limited(key, limit):
    now = time.time()
    with _hits_lock:
        if len(_hits) > 20000:   # drop idle entries so the table can't grow without bound
            for k in [k for k, v in _hits.items() if not v or now - v[-1] > RATE_WINDOW]:
                del _hits[k]
        q = _hits[key]
        while q and now - q[0] > RATE_WINDOW:
            q.popleft()
        if len(q) >= limit:
            return True
        q.append(now)
        return False


def _valid_photo(photo):
    """True only for an existing image file inside the gallery directory."""
    if not photo.lower().endswith(IMAGE_EXTS):
        return False
    base = os.path.normpath(_gallery_base())
    full = os.path.normpath(os.path.join(base, photo))
    return full.startswith(base + os.sep) and os.path.isfile(full)


class _LikesStore:
    """Read/modify/write the likes JSON under a file lock (safe across uWSGI workers).
    Readers share the lock so many visitors can load counts at once; writers get it exclusively."""

    def __init__(self, write=True):
        self.write = write

    def __enter__(self):
        path = _likes_file()
        self.path = path
        self.lock = open(path + '.lock', 'a')
        fcntl.flock(self.lock, fcntl.LOCK_EX if self.write else fcntl.LOCK_SH)
        self.corrupt = False
        try:
            with open(path) as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = {}
        except json.JSONDecodeError:
            # Never overwrite a damaged file (that would wipe every vote); reads show nothing, writes fail.
            self.data, self.corrupt = {}, True
        return self

    def save(self):
        if self.corrupt:
            raise RuntimeError('likes file is unreadable; refusing to overwrite it: %s' % self.path)
        fd, tmp = tempfile.mkstemp(dir=os.path.dirname(self.path), prefix='.likes-')
        with os.fdopen(fd, 'w') as f:
            json.dump(self.data, f)
        os.replace(tmp, self.path)

    def __exit__(self, *exc):
        fcntl.flock(self.lock, fcntl.LOCK_UN)
        self.lock.close()


@bp.route('/likes', methods=['GET'])
def get_likes():
    voter = _voter_id()
    with _LikesStore(write=False) as store:
        counts ={photo: len(voters) for photo, voters in store.data.items() if voters}
        mine = [photo for photo, voters in store.data.items() if voter and voter in voters]
    resp = jsonify({'counts': counts, 'mine': mine})
    resp.headers['Cache-Control'] = 'no-store'   # counts change constantly; never serve a cached copy
    return resp


@bp.route('/likes/<path:photo>', methods=['POST'])
def toggle_like(photo):
    voter = _voter_id()
    if not voter:
        return jsonify({'error': 'Missing voter id'}), 400
    if not _valid_photo(photo):
        return jsonify({'error': 'Unknown photo'}), 404
    if _rate_limited('voter:' + voter, RATE_PER_VOTER) or _rate_limited('ip:' + _client_ip(), RATE_PER_IP):
        return jsonify({'error': 'Too many clicks, try again in a minute'}), 429
    with _LikesStore() as store:
        if store.corrupt:
            return jsonify({'error': 'Likes are temporarily unavailable'}), 503
        voters = store.data.setdefault(photo, [])
        if voter in voters:
            voters.remove(voter)
            liked = False
        else:
            voters.append(voter)
            liked = True
        store.save()
        count = len(voters)
    return jsonify({'photo': photo, 'count': count, 'liked': liked})
