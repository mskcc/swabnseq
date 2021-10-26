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

## Loading Data
Currently, no "DB" is used. Two files are written,
* [`swab_n_seq_results.py`](https://github.com/mskcc/swabnseq/blob/master/backend/src/app/swab_n_seq_results.py) - Contains visualized data in the following format,
```
data = {
   "results":{
      "user_id":[
         {
            "count":698.0,
            "org":{                 # fullest taxonomic identification from Kingdom -> Species ("" if couldn't specify)
               "":"",
               "k":"Bacteria"
            }
         },
         ...
      ],
      ...
   },
   "summary":{
      "c":[                         # Taxonomic (e.g. "c" - Phylum, "f" - "Family")
         {
            "count":44.0,
            "org":{
               "c":"Elusimicrobia"
            }
         },
      
```

* [`download.py`](https://github.com/mskcc/swabnseq/blob/master/backend/src/app/download.py) - Contains downloadable data, and comes in a dense-matrix format like below
```
data = {
   "headers":[
      "index",
      "k__Archaea;p__Crenarchaeota;c__Thaumarchaeota;o__Nitrososphaerales;f__Nitrososphaeraceae;g__Candidatus Nitrososphaera;s__SCA1145",
      ...
   "data":{
      "user_id": [
        user_id,
        (int),
        ...
      ]
  }
}
  * `headers` are the identified taxonomies in semicolon-separated groups
  * `data` are the counts for a given user_id
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
