import { spawn } from 'child_process';
import {streamWrite, streamEnd, onExit} from '@rauschma/stringio';


export function dsSetUrl (hostname: string) : string {
  const child = spawn('ds', ['set', 'server-url', hostname]);

  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  return ""
}

export async function dsLogin (apiKey: string, username: string) {
  const child = spawn('ds', ['login', username], {stdio: ['pipe', process.stdout, process.stderr]});

  if(child.stdin != null) {
    await streamWrite(child.stdin, `${apiKey}\n`)
    if(child.stdout != null) {
        child.stdout.on('data', (data: object) => {
        console.log(data.toString());
      });
    }
  }
  
}
/**
* @Method: Runs a Dotscience command task.
* @Param {string}
* @Return {string}
*/
export async function dsRun (apiKey: string, username: string, hostname: string, project: string, command: string, image: string) {
  // set the url first - if blank, don't set it
  if(hostname != "") {
    dsSetUrl(hostname)
  }
  // login
  await dsLogin(apiKey, username)
  
  // run ds run!
  const child = spawn('ds', ['run', '-v', '-p', project, '-I', image, '--', 'bash', '-c', command]);
  console.log(`started command: ds run -v -p ${project} -I ${image} -- bash -c ${command}`)
  if(child.stdout != null) {
    child.stdout.on('data', (data: object) => {
    console.log(data.toString());
    });
    
  }
  if(child.stderr != null) {
    child.stderr.on('data', (data: object) => {
      console.log("err: " + data.toString());
    });
  }
}
