init:
	python3 -m venv venv && \
	source venv/bin/activate && \
	pip install -r requirements.txt

run:
	source venv/bin/activate && \
	uwsgi swab-n-seq.ini;
