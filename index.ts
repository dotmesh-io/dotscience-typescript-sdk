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

function execPromise (command: string, args: Array<string>) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args)

    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    child.on('close', (code) => {
      if (code !== 0)
        console.error(`Command execution failed with code: ${code}`)
      else
        console.log(`Command execution completed with code: ${code}`)
      resolve()
    })
  })
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
  await execPromise("ds", ['run', '-v', '-p', project, '-I', image, '--', 'bash', '-c', command])
  console.log(`finished command: ds run -v -p ${project} -I ${image} -- bash -c ${command}`)
}
