Docker environment images for Hollowverse
==========================================
[![Build Status](https://travis-ci.org/hollowverse/hollowverse-docker.svg?branch=master)](https://travis-ci.org/hollowverse/hollowverse-docker)

This repository contains all the environment images used to build and deploy Hollowverse.

An environment image is an image that contains all the tools needed to deploy the application. It does not contain the actual source code for the app to be built. The source code should be mounted into the container at runtime.

The continuous deployment process is [documented in detail on Medium](https://medium.com/hollowverse/automating-deployment-to-google-app-engine-with-docker-and-travis-b8a8edb3ec31).

## `Dockerfile-gae`
This Docker image contains the Google Cloud SDK (`gcloud` command line tool) and expects that the source code is mounted at `/hollowverse` inside the container.

The source code is deployed from inside this environment image to Google App Engine.

The following environment variables are required at runtime:

* `PROJECT`: The project ID in Google Cloud Platform (e.g. `hollowverse-c9cad`).
* `BRANCH`: The App Engine version to deploy (e.g. `beta`, `master`...).
* `SERVICE_ACCOUNT`: The Google Cloud Platform service account used to deploy the image. It looks like an email address and can be obtained or created in the GCP web interface. This account must have permission to deploy.
* `KEY`: The encryption key required to decrypt the service account client secret to authenticate the service account and obtain the required permissions to deploy. The client secret is expected to be stored encrypted as `gae-client-secret.json.enc` at the root of the source code folder.
* `IV`: The initialization vector for the encryption key.


