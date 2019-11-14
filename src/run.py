import sys, os
sys.path.insert(0, os.path.abspath("./src"))
from app import app

# dev
if __name__ == '__main__':
    app.run(debug=True )


# prod
# if __name__ == '__main__':
# app.run(ssl_context='adhoc', host="0.0.0.0",port='8443' )
