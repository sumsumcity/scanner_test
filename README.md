# BestBag

## Run
- `cp .env.example .env`
- `docker-compose build app`
- `docker-compose up -d`


## useful information
- card for testing: `4242 4242 4242 42424 42424`
- for the other values: just press `42` as long as possible:)
- Admin password: `waJelVtJVG`
- Admin email: `admin@cnsp.uzh.ch`
- Admin login: `/a0MNAc`
- in default the application is exposed on [127.0.0.1:3000](http://127.0.0.1:3000)


## For local development
- just rename MONGODB_HOST into local to use the mongoDB from docker but use custom node runtime
- allow docker to expose mongoDB on port 27017
- also change port of the app, since there could be conflict on 3000
