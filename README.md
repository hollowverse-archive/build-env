Docker environment images for Hollowverse
==========================================
[![Build Status](https://travis-ci.org/hollowverse/hollowverse-docker.svg?branch=master)](https://travis-ci.org/hollowverse/hollowverse-docker)

This repository contains all the environment images used to build and deploy Hollowverse.

An environment image is an image that contains all the tools needed to deploy the application. It does not contain the actual source code for the app to be built. The source code should be mounted into the container at runtime.

The continuous deployment process is [documented in detail on Medium](https://medium.com/hollowverse/automating-deployment-to-google-app-engine-with-docker-and-travis-b8a8edb3ec31).

## `Dockerfile-gae`
This Docker image contains the Google Cloud SDK (`gcloud` command line tool) and expects that the source code is mounted at `/repo` inside the container.

It is expected that the mounted source code directory contains a `deploy.js` file that performs the deployment tasks specific to each project.

Any required environment variables should be defined in the project settings on Travis and passed to the environment container via the run command in `.travis.yaml`. Refer to [`.travis.yaml`](https://github.com/hollowverse/hollowverse/blob/master/.travis.yml) in [hollowverse/hollowverse](https://github.com/hollowverse/hollowverse/) and [`.travis.yaml`](https://github.com/hollowverse/lets-encrypt/blob/master/.travis.yml) in [hollowverse/lets-encrypt](https://github.com/hollowverse/lets-encrypt/) for examples on how to do that.
