# Swab 'n Seq Application
Application to show sequencing results for IGO's open house

## Dev
### Frontend
```
cd frontend && npm install && npm run start
```
### Backend
* NOTE: Make sure the `.env` file has been created, e.g. `$ cp .env.example .env`
```
cd backend && make init && make run
```

## Deploy
```
make HOST=dlviigoweb1  ENV=prod deploy
```

Notes:
* This *DELETES* the existing application on the `HOST` specified. It then copies the packaged application created locally to the new location.
* This creates and copies a `build` directory to the `backend` directory in your home on the `HOST` specified. Make sure your `~/deployments` exists on that `HOST`!
* `make deploy` is a `Makefile` command. If there are issues w/ this step, please review the `deploy` step of the [Makefile](https://github.com/mskcc/swabnseq/blob/master/Makefile)
* Expect to enter your password four times - once to `scp` the packaged application, once to remotely send the install command, and twice to run `dzdo` remotely (`dzdo` allows for root access on our VM's and is needed so you can re-deploy if another user was the last to deploy) 
