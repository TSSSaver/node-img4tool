import { existsSync } from 'fs';

export default class {
  constructor(options: IOptions) {
    if (!existsSync(options.bin)) throw new Error(`${options.bin} doesn't exist!`);
    if (!existsSync(options.bmPath)) throw new Error(`${options.bmPath} doesn't exist`);
  }
}

interface IOptions {
  bin: string;
  bmPath: string;
}
