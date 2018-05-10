# Build Environments for Hollowverse

[![Build Status](https://travis-ci.org/hollowverse/build-env.svg?branch=master)](https://travis-ci.org/hollowverse/build-env)

This repository contains the Dockerfiles to build the environment images used to build and deploy Hollowverse services.

The images contain all the tools needed for deployment. They do not contain the actual source code to be built. The source code should be mounted into the container at build time.

## Images

### `Dockerfile`

This Docker image expects that the source code is mounted at `/repo` inside the container.

It is expected that the mounted source code directory has a `package.json` file at the root with a script named `"deploy"` which performs the deployment tasks.

The image can be pulled using `docker pull hollowverse/build-env`.

Any required environment variables should be defined in the project settings on Travis and passed to the environment container via the run command in `.travis.yml`. Refer to [`.travis.yml`](https://github.com/hollowverse/hollowverse/blob/master/.travis.yml) in [hollowverse/hollowverse](https://github.com/hollowverse/hollowverse/) for examples on how to do that.

### `Dockerfile-lambda`

Similar to the regular `Dockerfile`, except that it runs Node.js 6 instead in order to emulate the AWS Lambda environment. It also expects that you have a script in your `package.json` named `"deploy"` which performs the deployment tasks.

The image can be pulled using `docker pull hollowverse/build-env:lambda`.

Because version 6 of Node.js is quite outdated and lacks many of the features of JavaScript we have come to expect, you may want to use babel to transpile the deployment script file before executing it. This way, you can safely use modern JS syntax and features to write the deployment script, provided that your repository provides the required Babel packages and configuration settings. This image does not install any Babel packages for you.

For an example of a repository that uses this image, check out [`track-performance`](https://github.com/hollowverse/track-performance)

## Architecture

This repository plays an important role in the deployment architecture of Hollowverse. You can read more about it in our [architecture documentation](https://github.com/hollowverse/architecture#readme)
