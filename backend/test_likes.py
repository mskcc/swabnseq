"""Self-check for the gallery likes API. Run from backend/:  python test_likes.py"""
import os, sys, tempfile

os.environ['SWABNSEQ_LIKES_FILE'] = os.path.join(tempfile.mkdtemp(), 'likes.json')
sys.path.insert(0, os.path.abspath('./src/app'))
sys.path.insert(0, os.path.abspath('./src'))
from app import app  # noqa: E402
import likes  # noqa: E402

PHOTO = '2026_Costume_Contest/EXPAND.jpg'
A = {'X-Voter-Id': 'aaaaaaaa-1111-2222-3333-444444444444'}
B = {'X-Voter-Id': 'bbbbbbbb-1111-2222-3333-444444444444'}
c = app.test_client()

assert c.get('/likes').get_json() == {'counts': {}, 'mine': []}
assert c.get('/likes').headers['Cache-Control'] == 'no-store'   # a newly opened page never sees stale counts

assert c.post('/likes/' + PHOTO).status_code == 400                                  # no voter id
assert c.post('/likes/' + PHOTO, headers={'X-Voter-Id': 'bad id!'}).status_code == 400  # malformed id
assert c.post('/likes/../../etc/passwd.jpg', headers=A).status_code == 404            # path traversal
assert c.post('/likes/2026_Costume_Contest/nope.jpg', headers=A).status_code == 404   # unknown photo

assert c.post('/likes/' + PHOTO, headers=A).get_json() == {'photo': PHOTO, 'count': 1, 'liked': True}
assert c.post('/likes/' + PHOTO, headers=B).get_json()['count'] == 2                  # second browser
assert c.get('/likes', headers=A).get_json() == {'counts': {PHOTO: 2}, 'mine': [PHOTO]}
assert c.post('/likes/' + PHOTO, headers=A).get_json() == {'photo': PHOTO, 'count': 1, 'liked': False}  # unlike

# Photo names with spaces (sent URL-encoded by the browser).
SPACED = '2026_Costume_Contest/Glickman Lab.jpg'
assert c.post('/likes/2026_Costume_Contest/Glickman%20Lab.jpg', headers=A).get_json() == {'photo': SPACED, 'count': 1, 'liked': True}
assert SPACED in c.get('/likes', headers=A).get_json()['mine']

# Damaged likes file: likes are refused (503) and the file is left untouched for recovery.
path = os.environ['SWABNSEQ_LIKES_FILE']
good = open(path).read()
open(path, 'w').write('{bad')
assert c.post('/likes/' + PHOTO, headers=A).status_code == 503
assert open(path).read() == '{bad'
assert c.get('/likes').get_json() == {'counts': {}, 'mine': []}
open(path, 'w').write(good)

# Per-browser limit: one browser gets 429 past RATE_PER_VOTER clicks; another browser is unaffected.
likes._hits.clear()
codes = [c.post('/likes/' + PHOTO, headers=A).status_code for _ in range(likes.RATE_PER_VOTER + 1)]
assert codes[:-1] == [200] * likes.RATE_PER_VOTER and codes[-1] == 429, codes
assert c.post('/likes/' + PHOTO, headers=B).status_code == 200

# Per-IP backstop: many browsers behind one address are capped at RATE_PER_IP.
likes._hits.clear()
likes.RATE_PER_IP = 3
ids = [{'X-Voter-Id': 'cccccccc-0000-0000-0000-%012d' % i} for i in range(4)]
codes = [c.post('/likes/' + PHOTO, headers=h).status_code for h in ids]
assert codes == [200, 200, 200, 429], codes
print('likes API: all checks passed')
