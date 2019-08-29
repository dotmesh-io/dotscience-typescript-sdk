import { spawn } from 'child_process';

/**
* @Method: Runs a Dotscience command task.
* @Param {string}
* @Return {string}
*/
export function dsRun (str: any) : string {
  const child = spawn('ls');

  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  return ""
}
