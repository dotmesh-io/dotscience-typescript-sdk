import { spawn } from 'child_process';
import {streamWrite, streamEnd, onExit} from '@rauschma/stringio';

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

function execPromise (command: string, args: Array<string>) : Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args)
    let output: Array<string> = [];
    let err: Array<string> = [];
    child.stdout.on('data', (data) => {
      output.push(data)
    })

    child.stderr.on('data', (data) => {
      err.push(data)
    })

    child.on('close', (code) => {
      if (code !== 0)
        {
          console.error(`Command execution failed with code: ${code}`)
          reject(err)
        }
      else {
        console.log(`Command execution completed with code: ${code}`)
        resolve(output)
      } 
        
    })
  })
}
/**
* @Method: Runs a Dotscience command task.
* @Param {string}
* @Return {string}
*/
export async function dsRun (apiKey: string, username: string, hostname: string, project: string, command: string, image: string) : Promise<Array<string>> {
  // set the url first - if blank, don't set it
  if(hostname != "") {
    let hnameOutput: Array<string> = await execPromise("ds", ['set', 'server-url', hostname])
    console.log(hnameOutput.join("\n"))
  }
  // login
  await dsLogin(apiKey, username)
  
  // run ds run!
  let output: Array<string> = await execPromise("ds", ['run', '-v', '-p', project, '-I', image, '--', 'bash', '-c', command])
  console.log(`finished command: ds run -v -p ${project} -I ${image} -- bash -c ${command}`)
  return output
}
