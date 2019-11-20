from flask import Flask, render_template, send_file, request
import json
import sys, os
import re
import requests
from random import shuffle
from flask_cors import CORS

sys.path.insert(0, os.path.abspath("./src/app"))

from swab_n_seq_results import data

app = Flask(__name__, template_folder="build", static_folder="build/static")
cors = CORS(app, resources={r"/allresults": {"origins": "*"}, r"/getRecord": {"origins": "*"}})

# Serve home path
@app.route('/', defaults={'path': ''})
def serve(path):
    return render_template('index.html')

@app.route('/allresults')
def serve_results():
    # Present the results in a random orer
    results = list(data['results'].values())
    shuffle(results)
    return { 
        'results': list(results),
        'summary': data['summary']
    }

@app.route('/getRecord')
def get_record():
    record_id = request.args.get('id')
    results = data['results']

    if record_id not in results:
        return { 'error': 'Could not find record with id: %s' % record_id }

    f = open("./access_record.txt", "a")
    f.write("%s\n" % record_id)
    f.close()

    return {
        'record': results[record_id]
    }

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
