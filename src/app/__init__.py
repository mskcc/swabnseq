from flask import Flask, render_template, send_file
import json
import sys, os
import re
sys.path.insert(0, os.path.abspath("./src/app"))

app = Flask(__name__, template_folder="build", static_folder="build/static")

# Serve home path
@app.route('/', defaults={'path': ''})
def serve(path):
    return render_template('index.html')

# All paths not resolved above should serve front-end resources
@app.route('/<path:path>')
def serve_resource(path):
    path_values = re.split('/', path)
    file = path_values[-1]
    ext = re.split('\.', file)[-1]
    rsc_path = ''
    if ext == 'js':
        rsc_path = 'js'
    elif ext == 'css':
        rsc_path = 'css'
    elif ext == 'png':
        rsc_path = 'media'

    full_path_to_file = '%s/%s/%s' % (app.static_folder, rsc_path, file)
    if(os.path.exists(full_path_to_file)):
        return send_file(full_path_to_file)

    build_path = 'build/%s' % file
    if(os.path.exists(build_path)):
        return send_file(build_path)

    return "Resource not found"