from flask import Flask, render_template, send_file, request
import json
import sys, os
import re
import requests
import importlib.util
from random import shuffle
from flask_cors import CORS

sys.path.insert(0, os.path.abspath("./src/app"))
app = Flask(__name__, template_folder="build", static_folder="build/static")
cors = CORS(app, resources={
    r"/allresults": {"origins": "*"}, 
    r"/getRecord": {"origins": "*"}, 
    r"/download": {"origins": "*"},
    r"/gallery/*": {"origins": "*"}
})

# Import data files
from swab_n_seq_results import data
from download import data as download

# Serve home path
@app.route('/', defaults={'path': ''})
def serve(path):
    try:
        return render_template('index.html')
    except Exception:
        return {
            'message': 'Swab \'n Seq API is running',
            'status': 'ok',
            'endpoints': {
                'allresults': '/allresults',
                'getRecord': '/getRecord?id=<record_id>',
                'download': '/download?id=<record_id>'
            },
            'frontend': 'In development mode, access the frontend at http://localhost:3000'
        }, 200, {'Content-Type': 'application/json'}

# Serve about path
@app.route('/about', defaults={'path': ''})
def serveAbout(path):
    return serve('/about')

@app.route('/allresults')
def serve_results():
    results = list(data['results'].values())
    shuffle(results)
    return {
        'graphs': list(results),
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

@app.route('/gallery/<path:filename>')
def serve_gallery(filename):
    try:
        # Production: serve from external directory
        gallery_base = '/srv/www/swabNseq/gallery'
        
        # Development: fallback to frontend/public/gallery
        if not os.path.exists(gallery_base):
            gallery_base = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(app.root_path))), 
                'frontend', 'public', 'gallery'
            )
        
        full_path = os.path.normpath(os.path.join(gallery_base, filename))
        
        # Security check: prevent path traversal
        if not full_path.startswith(os.path.normpath(gallery_base)):
            return {'error': 'Invalid path'}, 403
        
        if not os.path.exists(full_path):
            return {'error': f'File not found: {filename}'}, 404
            
        return send_file(full_path)
    except Exception as e:
        return {'error': str(e)}, 500



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