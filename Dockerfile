FROM node:9.2-alpine

RUN apk update -q

RUN apk add -q --no-cache git py2-pip openssl

# Native dependencies required to compile some Node.js packages
RUN apk add -q --no-cache make gcc g++ python openssl-dev

# Install AWS Elastic Beanstalk CLI Tool using pip
RUN pip install awsebcli -q --upgrade

ENV NODE_ENV=development

WORKDIR /repo

# Install dependencies for the mounted project, so that
# the dependencies of the deploy script are satisfied.
CMD yarn && node deploy.js
