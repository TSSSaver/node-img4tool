export default class {
    private bin;
    private bmPath;
    constructor(options: IOptions);
    dumpAllInfo(filePath: string, iOSInfo: IiOSInfo): Promise<IAllInfo>;
    printAll(filePath: string): Promise<ITags>;
    verify(filePath: string, iOSInfo: IiOSInfo): Promise<IVerify>;
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
export {};
