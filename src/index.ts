import { exec as execAsync } from 'child_process';
import { existsSync } from 'fs';
import shellEscape from 'shell-escape';

export default class {
  private bin: string;
  private bmPath: string;
  constructor(options: IOptions) {
    if (!existsSync(options.bin)) throw new Error(`${options.bin} doesn't exist!`);
    if (!existsSync(options.bmPath)) throw new Error(`${options.bmPath} doesn't exist`);
    this.bin = options.bin;
    this.bmPath = options.bmPath;
  }

  public async dumpAllInfo(filePath: string, iOSInfo: IiOSInfo): Promise<IAllInfo> {
    const printAllData: ITags = await this.printAll(filePath).catch((e) => {
      throw e;
    });
    const verifyData: IVerify = await this.verify(filePath, iOSInfo).catch((e) => {
      throw e;
    });

    return { ...verifyData, ...{ tags: printAllData } };
  }

  public async printAll(filePath: string): Promise<ITags> {

    const args = [
      '-a',
      '-s',
      filePath,
    ];

    const result = await exec(this.bin, args)
      .catch((e) => {
        throw e;
      });

    if (result.stdout.match(/\[Error\] reading file failed/g) !== null) {
      throw new Error(`File either doesn't exist or is not an SHSH2 file.`);
    }

    const input = result.stdout.split('\n\n').slice(1).filter(Boolean);
    const obj: ITags = {};

    input.forEach((data, i) => {
      let lines = data.split('\n');
      lines = lines.filter(Boolean);
      const tagName = /([\w]{4}): [\w]{4}: ------------------------------/g.exec(lines[0]);
      if (tagName === null) return;
      obj[tagName[1]] = {};

      lines.slice(1).forEach((line) => {
        const stuff = /^([\w]{4}): [\w]{4}: ([\w]+)$/gm.exec(line);
        if (stuff === null) return;
        obj[tagName[1]][stuff[1]] = stuff[2];

      });

    });

    return obj;
  }

  public async verify(filePath: string, iOSInfo: IiOSInfo): Promise<IVerify> {
    const bm: string = `${this.bmPath}/${iOSInfo.deviceId}/${iOSInfo.version}/${iOSInfo.buildId}`;

    const args: string[] = [
      '-v',
      `${bm}/BuildManifest.plist`,
      '-s',
      filePath,
    ];

    const result = await exec(this.bin, args)
      .catch((e) => {
        throw e;
      });

    const stdout = result.stdout;

    if (stdout.match(/\[Error\] main: failed to read buildmanifest from/g) !== null) {
      throw new Error(`Build Manifest doesn't exist.`);
    }
    if (stdout.match(/\[Error\] reading file failed/g) !== null) {
      throw new Error(`File either doesn't exist or is not an SHSH2 file.`);
    }

    const nonce = getMatch(/^BNCH: BNCH: ([a-f0-9]+)$/gm, stdout);
    const snon = getMatch(/^snon: snon: ([a-f0-9]+)$/gm, stdout);
    const srvn = getMatch(/^srvn: srvn: ([a-f0-9]+)$/gm, stdout);
    const ecid = getMatch(/^ECID: ECID: ([0-9]+)$/gm, stdout);
    const generator = getMatch(/\[OK\] verified generator "([0-9a-fx]+)"/gm, stdout);
    const buildNumber = getMatch(/^BuildNumber : ([0-9A-F]+)$/gm, stdout);
    const buildTrain = getMatch(/^BuildTrain : ([A-Za-z]+)$/gm, stdout);
    const boardConfig = getMatch(/^DeviceClass : ([A-Za-z0-9]+)$/gm, stdout);
    const restoreBehavior = getMatch(/^RestoreBehavior : ([A-Za-z]+)$/gm, stdout);
    const variant = getMatch(/^Variant : (.+)$/gm, stdout);
    const valid = stdout.match(/\[IMG4TOOL\] file is valid!/g) !== null;

    return {
      nonce,
      snon,
      srvn,
      generator,
      buildNumber,
      buildTrain,
      boardConfig,
      restoreBehavior,
      variant,
      valid,
      ecidDec: ecid,
      ecidHex: (+ecid).toString(16).toUpperCase(),
    };
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

function getMatch(regexp: RegExp, string: string): string {
  const result = regexp.exec(string);
  return result !== null ? result[1] : '';
}

interface IAllInfo extends IVerify {
  tags: ITags;
}

interface ITags {
  [key: string]: {
    [key: string]: string;
  };
}

interface IVerify {
  nonce: string;
  snon: string;
  srvn: string;
  generator: string;
  buildNumber: string;
  buildTrain: string;
  boardConfig: string;
  restoreBehavior: string;
  variant: string;
  valid: boolean;
  ecidDec: string;
  ecidHex: string;
}

interface IOptions {
  bin: string;
  bmPath: string;
}

interface IiOSInfo {
  deviceId: string;
  buildId: string;
  version: string;
}
