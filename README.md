Build Environment for Hollowverse
==========================================
[![Build Status](https://travis-ci.org/hollowverse/build-env.svg?branch=master)](https://travis-ci.org/hollowverse/build-env)

This repository contains the environment used to build and deploy Hollowverse, packaged as a Docker image.

The image contains all the tools needed to deploy the application. It does not contain the actual source code for the app to be built. The source code should be mounted into the container at runtime.

## `Dockerfile`
This Docker image expects that the source code is mounted at `/repo` inside the container.

It is expected that the mounted source code directory contains a `deploy.js` file that performs the deployment tasks specific to each project.

Any required environment variables should be defined in the project settings on Travis and passed to the environment container via the run command in `.travis.yml`. Refer to [`.travis.yml`](https://github.com/hollowverse/hollowverse/blob/master/.travis.yml) in [hollowverse/hollowverse](https://github.com/hollowverse/hollowverse/) for examples on how to do that.
