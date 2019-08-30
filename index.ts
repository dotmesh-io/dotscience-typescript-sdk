import { spawn } from 'child_process';
import {streamWrite, streamEnd, onExit} from '@rauschma/stringio';


export function dsSetUrl (hostname: string) : string {
  const child = spawn('ds', ['set', 'server-url', hostname]);

  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  return ""
}

// TODO where the hell is the writeable type
async function writeToWritable(writable: any, apiKey: string) {
  await streamWrite(writable, `${apiKey}\n`);
}

export function dsLogin (apiKey: string, username: string) : string {
  const child = spawn('ds', ['login', username], {stdio: ['pipe', process.stdout, process.stderr]});

  writeToWriteable(child.stdin, apiKey)
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  return ""
}
/**
* @Method: Runs a Dotscience command task.
* @Param {string}
* @Return {string}
*/
export function dsRun (apiKey: string, username: string, hostname: string, project: string, command: string, image: string) : string {
  // set the url first - if blank, don't set it
  if(hostname != "") {
    dsSetUrl(hostname)
  }
  // login
  dsLogin(apiKey, username)
  // run ds run!
  const child = spawn('ds', ['run', '-p', project, '-I', image, '--', command]);

  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  return ""
}
