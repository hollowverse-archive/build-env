#! /bin/node 

// Enable TS type checker for JavaScript
// @ts-check

const shelljs = require('shelljs');
const fs = require('fs');

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
      try {
        console.info(`${command.name}()`);
      code = command();
      } catch (e) {
        code = 1;
      }
    } else {
      command = command.replace('\n', '').replace(/\s+/g, ' ').trim();
      console.info(command);
      code = shelljs.exec(command).code;
    }
  }

  return code;
}

/**
 * Returns a function that writes a JSON file that contains various
 * information about App Engine configuration, including the branch name.
 *
 * This is working around the fact that App Engine does not provide this information
 * as a environment variables for Docker-based runtimes.
 * The file should be written on CI and deploy with the app so that it can
 * be accessed at runtime.
 * @param {string} path The path where the file should be written
 * @param {string} service The App Engine service name to be included in the env file
 */
const writeEnvFile = (path, service = 'default') => () => {
  const env = {
    project: PROJECT,
    branch: BRANCH,
    service,
  }

  return fs.writeFileSync(path, JSON.stringify(env, undefined, 2));
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
    writeEnvFile('/hollowverse/env.json', 'default'),
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
