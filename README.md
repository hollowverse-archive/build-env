# Build Environment for Hollowverse

[![Build Status](https://travis-ci.org/hollowverse/build-env.svg?branch=master)](https://travis-ci.org/hollowverse/build-env)

This repository contains the environment used to build and deploy Hollowverse, packaged as a Docker image.

The image contains all the tools needed to deploy the application. It does not contain the actual source code for the app to be built. The source code should be mounted into the container at runtime.

## `Dockerfile`

This Docker image expects that the source code is mounted at `/repo` inside the container.

It is expected that the mounted source code directory contains a `deploy.js` file that performs the deployment tasks specific to each project.

The image can be pulled using `docker pull hollowverse/build-env`.

Any required environment variables should be defined in the project settings on Travis and passed to the environment container via the run command in `.travis.yml`. Refer to [`.travis.yml`](https://github.com/hollowverse/hollowverse/blob/master/.travis.yml) in [hollowverse/hollowverse](https://github.com/hollowverse/hollowverse/) for examples on how to do that.

## `Dockerfile-lambda`

Similar to the regular `Dockerfile`, except that it runs Node.js 6 instead in order to emulate the AWS Lambda environment.

The image can be pulled using `docker pull hollowverse/build-env:lambda`.

Because version 6 of Node.js is quite outdated and lacks many of the features of JavaScript we have come to expect, we use babel to transpile the `deploy.js` file before executing it. This means that you can safely use modern JS syntax and features to write the deployment script, provided that your repository provides the required Babel configuration settings, either via a `.babelrc` file, or as a `babel` field in `package.json`. The required babel plugins must also be defined in `package.json`.

For an example of a repository that uses this image, check out [`perf-monitor`](https://github.com/hollowverse/perf-monitor)
