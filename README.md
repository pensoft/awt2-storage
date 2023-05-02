# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Installation and run ###

````
npm install
npm run start
````

### Environment ###
Into the root of the project have `.env` file and `.env.prod`. The first one is for dev mode, and it is used when you run following command:
````
npm run start
````
If you want to run in production and to use the `.env.prod` file you have to run the server in this way:
````
npm run start:prod
````

Environment file contain:
````
APP_ENV=dev
HOST=
PORT=
YPERSISTENCE="./db"
````

Where `YPERSISTENCE` is the folder where leveldb will store the data 
