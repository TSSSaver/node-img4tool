import { exec as execAsync } from 'child_process';
import { existsSync } from 'fs';
import shellEscape from 'shell-escape';

export default class {
  constructor(options: IOptions) {
    if (!existsSync(options.bin)) throw new Error(`${options.bin} doesn't exist!`);
    if (!existsSync(options.bmPath)) throw new Error(`${options.bmPath} doesn't exist`);
  }
}
function exec(bin: string, argument: string[]): Promise<{stdout: string, stderr: string}> {
  const args = shellEscape(argument);
  const command: string = `${bin} ${args}`;
  return new Promise((resolve, reject) => {
    execAsync(command, (err, stdout, stderr) => {
      if (err) reject(err);
      resolve({ stdout, stderr });
    });
  });
}

interface IOptions {
  bin: string;
  bmPath: string;
}
