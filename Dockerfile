FROM ubuntu:16.04
ENV OPENSSL_VERSION=1.1.0f
ENV LINUX_VERSION=4.11.0-14-generic

# Install prerequisites
RUN apt-get update -qq && apt-get upgrade -y -qq

RUN apt-get install -qq -y curl lsb-release wget build-essential linux-headers-$LINUX_VERSION

# Get OpenSSL 1.1.0f source, compile and install
RUN wget https://www.openssl.org/source/openssl-$OPENSSL_VERSION.tar.gz
RUN tar xfz ./openssl-$OPENSSL_VERSION.tar.gz
WORKDIR /openssl-$OPENSSL_VERSION
RUN ./config -Wl,--enable-new-dtags,-rpath,'$(LIBRPATH)'
RUN make && make install
WORKDIR /

# Add Node.js source
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

# Add yarn source
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update -qq
RUN apt-get install nodejs yarn git python-pip -y -qq

# Install AWS Elastic Beanstalk CLI Tool using pip
RUN pip install awsebcli --upgrade --user

# Export path containing the AWS EB CLI tool
ENV PATH=$PATH:~/.local/bin

RUN mkdir /repo

WORKDIR /repo

# Replace default shell with bash
RUN ln -s -f /bin/bash /bin/sh

# Install dependencies for the mounted project, so that
# the dependencies of the deploy script are satisfied.
CMD yarn && node deploy.js
