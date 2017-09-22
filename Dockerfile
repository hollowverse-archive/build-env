FROM node:alpine

RUN apk update -q && apk add git py2-pip openssl -q

# Install AWS Elastic Beanstalk CLI Tool using pip
RUN pip install awsebcli -q --upgrade

ENV NODE_ENV=development

WORKDIR /repo

# Install dependencies for the mounted project, so that
# the dependencies of the deploy script are satisfied.
CMD yarn && node deploy.js
