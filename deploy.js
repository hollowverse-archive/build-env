#! /bin/node 

// Enable TS type checker for JavaScript
// @ts-check

const shelljs = require('shelljs');

const { KEY, IV, PROJECT, BRANCH, SERVICE_ACCOUNT } = shelljs.env;

/**
 * A helper function that executes shell commands or JavaScript functions.
 * Simulates `set -e` behavior in shell, i.e. exits as soon as any commands fail
 * @param  {(string | Function)[]} commands
 * @return Exit code for the last executed command, a non-zero value indicates failure
 */
function executeCommands(commands) {
  let code = 0;

  for (let i = 0; i < commands.length && code === 0; i++) {
    let command = commands[i];
    if (typeof command === 'function') {
      code = command();
    } else {
      command = command.replace('\n', '').replace(/\s+/g, ' ').trim();
      console.info(command);
      code = shelljs.exec(command).code;
    }
  }

  return code;
}

function deploy() {
  let code = 0;
  const commands = [];

  if (BRANCH === 'master') {
    commands.push(
      `gcloud app deploy letsEncrypt/app.yaml --project ${PROJECT} --version master`
    );
  }
  
  commands.push(`
    gcloud app deploy app.yaml dispatch.yaml \
    --project ${PROJECT} \
    --version ${BRANCH} \
    --no-promote
  `);

  return executeCommands(commands);
}

function tryDeploy(maxNumAttempts = 5) {
  let numAttempts = 0;
  let code = 1;

  while (numAttempts < maxNumAttempts)  {
    numAttempts += 1;
    console.info(`Deploying... (attempt #${numAttempts})`);

    code = deploy();

    if (code === 0) {
      break;
    }
  }
  return code;
}

function main() {
  const code = executeCommands([
    'cd /hollowverse',
    `openssl aes-256-cbc \
      -K ${KEY} \
      -iv ${IV} \
      -in gae-client-secret.json.enc \
      -out gae-client-secret.json \
      -d
    `,
    'cp ./gae-client-secret.json ./letsEncrypt',
    `gcloud auth activate-service-account ${SERVICE_ACCOUNT} --key-file gae-client-secret.json`,
    tryDeploy,
  ]);

  if (code === 0) {
    console.info('App deployed successfully');
  } else {
    console.error('Failed to deploy');
  }
  
  // Required to inform CI of build result
  process.exit(code);
}

main();
