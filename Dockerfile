FROM node:alpine

RUN apk update && apk add git py2-pip openssl

# Install AWS Elastic Beanstalk CLI Tool using pip
RUN pip install awsebcli --upgrade --user

ENV NODE_ENV=development

# Export path containing the AWS EB CLI tool
ENV PATH=$PATH:~/.local/bin

RUN mkdir /repo

WORKDIR /repo

# Install dependencies for the mounted project, so that
# the dependencies of the deploy script are satisfied.
CMD yarn && node deploy.js
