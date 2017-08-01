#! /bin/bash 

cd /hollowverse

openssl aes-256-cbc \
  -K $KEY \
  -iv $IV \
  -in gae-client-secret.json.enc \
  -out gae-client-secret.json \
  -d

cp ./gae-client-secret.json ./letsEncrypt \

gcloud auth activate-service-account $SERVICE_ACCOUNT --key-file gae-client-secret.json \

num_attempts=0;

function deploy() {
  if [[ $BRANCH == 'master' ]]; then
    gcloud app deploy letsEncrypt/app.yaml --project $PROJECT --version master;
  fi

  gcloud app deploy app.yaml dispatch.yaml --version $BRANCH --project $PROJECT --no-promote;
}

while [ $num_attempts -lt 5 ]; do
  num_attempts=$(( $num_attempts + 1 ));
  echo "Deploying... (attempt #$num_attempts)";

  (deploy);

  # $? is the exit code for the last command, 0 indicates success
  if [[ $? == 0 ]]; then echo "Success"; break; fi
done
