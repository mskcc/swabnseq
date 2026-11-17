"""Self-check for the gallery likes API. Run from backend/:  python test_likes.py"""
import base64, hashlib, hmac, json, os, sys, tempfile, time

SECRET = 'test-secret'
os.environ['JWT_SECRET'] = SECRET
os.environ['SWABNSEQ_LIKES_FILE'] = os.path.join(tempfile.mkdtemp(), 'likes.json')
sys.path.insert(0, os.path.abspath('./src/app'))
sys.path.insert(0, os.path.abspath('./src'))
from app import app  # noqa: E402


def b64(d):
    return base64.urlsafe_b64encode(d).rstrip(b'=').decode()


def token(username, secret=SECRET, exp=None):
    payload = {'username': username, 'exp': exp or int(time.time()) + 3600}
    head = b64(json.dumps({'alg': 'HS256', 'typ': 'JWT'}).encode())
    body = b64(json.dumps(payload).encode())
    sig = b64(hmac.new(secret.encode(), ('%s.%s' % (head, body)).encode(), hashlib.sha256).digest())
    return '%s.%s.%s' % (head, body, sig)


PHOTO = '2026_Costume_Contest/EXPAND.jpg'
c = app.test_client()

r = c.get('/likes').get_json()
assert r == {'counts': {}, 'mine': [], 'signedIn': False}, r

assert c.post('/likes/' + PHOTO).status_code == 401                        # not signed in
c.set_cookie('localhost', 'jic', token('jdoe', secret='wrong'))
assert c.post('/likes/' + PHOTO).status_code == 401                        # forged token
c.set_cookie('localhost', 'jic', token('jdoe', exp=int(time.time()) - 10))
assert c.post('/likes/' + PHOTO).status_code == 401                        # expired token

c.set_cookie('localhost', 'jic', token('JDoe'))
assert c.post('/likes/../../etc/passwd.jpg').status_code == 404            # path traversal
assert c.post('/likes/2026_Costume_Contest/nope.jpg').status_code == 404   # unknown photo

assert c.post('/likes/' + PHOTO).get_json() == {'photo': PHOTO, 'count': 1, 'liked': True}
c.set_cookie('localhost', 'jic', token('asmith'))
assert c.post('/likes/' + PHOTO).get_json()['count'] == 2                  # second person
r = c.get('/likes').get_json()
assert r['counts'] == {PHOTO: 2} and r['mine'] == [PHOTO] and r['signedIn'], r
assert c.post('/likes/' + PHOTO).get_json() == {'photo': PHOTO, 'count': 1, 'liked': False}  # unlike

c.set_cookie('localhost', 'jic', token('jdoe'))                             # same user, other case
assert c.post('/likes/' + PHOTO).get_json() == {'photo': PHOTO, 'count': 0, 'liked': False}
print('likes API: all checks passed')
