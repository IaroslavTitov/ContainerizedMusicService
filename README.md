# Summary

This repository contains a Containerized Music Service, a containerized locally runnable and easily deployable service that consists of an API service and a database service, both containerized and orchestrated with Kubernetes. This sample service is seeded with Spotify music data, allowing you to query millions of tracks, artists and albums. I made this project to try out new tech like Prisma ORM and to improve my skills with Kubernetes and Docker.

## Technologies used

-   Docker
-   Kubernetes
-   Node.js
-   express.js
-   Typescript
-   Prisma ORM
-   PostgreSQL
-   KIND (Kubernetes-in-Docker)

## Tech choices explained

### General

Before this project, I was already very familiar with `Node.js` and `TypeScript`, but I wanted to practice and improve my skills building up containerized apps from scratch, so I chose to orchestrate the app with `Kubernetes`. That of course meant that both my API server and Database server had to be Dockerized. I didn't have experience with `PostgreSQL` databases or `Prisma ORM` before this project, but since these are in-demand skills, I figured I should pick them for this project and master them. In order to run my service locally, I chose to use `KIND`. Since developing APIs was not the primary purpose of the project, I chose lightweight API server `express.js`. The API server allows you to query for 3 different types of data - tracks, artists and albums.

### Seeding

For seeding the database with sample data, I downloaded open-source Spotify data CSV file and used a Typescript script to parse it using `csv-parse` library, process the records and insert into the database.

### Performance

To load test my server, I used `oha`, a neat load testing tool that allows you to specify desired QPS (queries per second). To improve performance, I implemented a simple cache to avoid hitting the database if another request recently grabbed the same query.

# How to run

### Prerequisites

-   Install `kind` by following instructions [here](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
-   Install `kubectl` (`sudo snap install kubectl` in ubuntu)
-   Install `yarn` (`npm install yarn`)
-   Install `jq` (`sudo snap install jq`)
-   Install `oha` (`brew install oha`)
-   Optionally install `k9s`, a very useful tool observe and debug your cluster

### Setup

-   Create a `.env` file in the root of the repository and fill it with below values (you can leave them as is or adjust as needed):

```
POSTGRES_USER=iaro # username for logging into the database
POSTGRES_PASSWORD=music-service-password # password for logging into the database
POSTGRES_DB=musicdb # name for the database
POSTGRES_ENDPOINT=127.0.0.1 # endpoint used for seeding
SEED_FILE=tracks.csv # location of the CSV file for seeding
```

-   Run `sh setup.sh`. See the script itself for more details.
-   Wait for the cluster to initialize, you can monitor progress using `k9s`
-   Once both services are running, run `kubectl port-forward service/api-service 8080:8080 -n music-service` to be able to call the api service locally
-   Seed the database as described below to actually see non-empty results.
-   Examples:
-   `http://localhost:8080/search?q=a` will retrieve all tracks with `a` in their name
-   `http://localhost:8080/search?q=b&t=album` will retrieve all albums with `b` in their name

### Seeding the database

-   Run `sh seed.sh`. This will take a while, you can stop the script early if you don't want all the records. The script will leave out dirty data. See the script itself for more details.

### Teardown

-   Run `sh teardown.sh`. This will destroy the local cluster. See the script itself for more details.

### Load testing

-   Run `sh loadtest.sh`. This will run load testing against your cluster. See the script itself for more details.
