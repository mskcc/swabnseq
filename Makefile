clean:
	rm -rf backend/src/app/build && \
	rm -rf backend/venv && \
	rm -rf frontend/build && \
	rm -rf frontend/node_modules

build-fe:
	cd frontend && \
	npm install && \
	REACT_APP_ENV=$(ENV) npm run build && \
	cd -

move-fe:
	mv frontend/build backend/src/app

move:
	scp -r backend $(HOST):deployments/swabNseq

test_host:
	if [[ "$(HOST)" != "" ]]; then echo "Deploying to $(HOST)"; else printf "\nPlease specify HOST, e.g.\n\t'make HOST=igo.mskcc.org deploy'\n\n" && exit 1; fi

install:
	ssh $(HOST) 'dzdo -S rm -rf /srv/www/swabNseq && mv ~/deployments/swabNseq /srv/www && cd /srv/www/swabNseq && make init && dzdo -S systemctl restart uwsgi'

deploy:
	make HOST=$(HOST) test_host && \
	make clean && \
	make ENV=$(ENV) build-fe && \
	make move-fe && \
	make HOST=$(HOST) move && \
	make HOST=$(HOST) install
