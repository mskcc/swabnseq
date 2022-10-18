from flask import Flask, render_template, send_file, request
import json
import sys, os
import re
import requests
from random import shuffle
from flask_cors import CORS

sys.path.insert(0, os.path.abspath("./src/app"))
app = Flask(__name__, template_folder="build", static_folder="build/static")
cors = CORS(app, resources={r"/allresults": {"origins": "*"}, r"/getRecord": {"origins": "*"}, r"/download": {"origins": "*"}})

from swab_n_seq_results import data
from download import data as download

# Serve home path
@app.route('/', defaults={'path': ''})
def serve(path):
    return render_template('index.html')

# Serve about path
@app.route('/about', defaults={'path': ''})
def serveAbout(path):
    return serve('/about')

@app.route('/allresults')
def serve_results():
    # Present the results in a random orer
    results = list(data['results'].values())
    shuffle(results)
    return { 
        'results': list(results),
        'summary': data['summary']
    }

def csv_list(list):
    return str(list).lstrip('[').rstrip(']') + '\n'

@app.route('/download')
def get_download():
    record_id = request.args.get('id')
    download_headers = download['headers']
    download_data = download['data']
    download_summary = download['summary']

    download_file = ''
    download_file += csv_list(download_headers)
    download_file += csv_list(download_summary)

    if record_id and record_id.isdigit() and int(record_id) in download_data:
        key = int(record_id)
        download_file += csv_list( download_data[key])

    return download_file.replace('\'', '')


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
