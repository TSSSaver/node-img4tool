/**
 * node-img4tool
 * Copyright (c) 1Conan
 */
const fs = require('fs')
const execAsync = require('child_process').exec
const shellescape = require('shell-escape')

module.exports = class {
    /**
     * Stuff
     * @param {String} bin 
     * Path to img4tool
     * @param {String} bmPath 
     * Path to buildmanifest files. (Folder should follow this structure)
     * (deviceId)/(iOSVersion)/(BuildNumber)/BuildManifest.plist
     */
    constructor(bin = './img4tool_linux', bmPath = './bm') {
        if(!fs.existsSync(bin)) throw `${bin} doesn't exist!`
        if(!fs.existsSync(bmPath)) throw `${bmPath} doesn't exist!`
        this.bin = bin
        this.bmPath = bmPath
    }


    /**
     * Dump all info regarding the shsh blob
     * @return {Object}
     */
    async dumpAllInfo(filePath, iOSInfo = {}) {
        
        const obj1 = await this.printAll(filePath)
        const obj2 = await this.verify(filePath, iOSInfo)

        if(obj1.success === false ) {
            return obj1
        } 
        else if (obj2.success === false) {
            return obj2
        }

        return {
            success: true,
            data: Object.assign(obj1.data, obj2.data)
        }
    }

    /**
     * Prints all info regarding the blob (Not including verifiction stuff)
     * @return {Object}
     */
    async printAll(filePath) {
        const args = [
            '-a',
            '-s',
            filePath
        ]
        const result = await this.exec(this.bin, args).catch(console.error);

        const stdout = result.stdout
        const stderr = result.stderr

        if(stdout.match(/\[Error\] reading file failed/g) !== null) {
            return {
                success: false,
                error: `Failed to read file. Is it a valid SHSH2 file?`
            }
        }

        const input = stdout.split('\n\n').slice(1).filter(Boolean)
        let obj = {}

        input.forEach((data, i) => {
            let lines = data.split('\n')
            lines = lines.filter(Boolean)
            const tagName = /([\w]{4}): [\w]{4}: ------------------------------/g.exec(lines[0])[1]
            obj[tagName] = {}
           
            lines.slice(1).forEach((line) => {
                const stuff = /^([\w]{4}): [\w]{4}: ([\w]+)$/gm.exec(line)
                obj[tagName][stuff[1]] = stuff[2]
            })
            
        })
        
        return {
            success: true,
            data: {
                tags: obj,
            }
        };
    }

    /**
     * Runs the verification on the shsh blob
     * @param {String} - BuildManifest filepath
     * @return {Object}
     */
    async verify(filePath, iOSInfo) {

        const bm = `${this.bmPath}/${iOSInfo.deviceId}/${iOSInfo.version}/${iOSInfo.buildId}/BuildManifest.plist`

        const args = [
            '-v',
            bm,
            '-s',
            filePath
        ]

        const result =  await this.exec(this.bin, args).catch(console.error);

        const stdout = result.stdout
        const stderr = result.stderr

        if(stdout.match(/\[Error\] main: failed to read buildmanifest from/g) !== null) {
            return {
                success: false,
                error: `Failed to read BuildManifest.plist. Does it exist?`
            }
        }
        if(stdout.match(/\[Error\] reading file failed/g) !== null) {
            return {
                success: false,
                error: `Failed to read file. Is it a valid SHSH2 file?`
            }
        }

        const nonce = /^BNCH: BNCH: ([a-f0-9]+)$/gm.exec(stdout)[1]
        const snon = /^snon: snon: ([a-f0-9]+)$/gm.exec(stdout)[1]
        const srvn = /^srvn: srvn: ([a-f0-9]+)$/gm.exec(stdout)[1]
        const ecid = /^ECID: ECID: ([0-9]+)$/gm.exec(stdout)[1]
        const generator = /\[OK\] verified generator "([0-9a-fx]+)" to be valid for BNCH "[0-9a-f]+"$/gm.exec(stdout)[1]
        const buildNumber = /^BuildNumber : ([0-9A-F]+)$/gm.exec(stdout)[1]
        const buildTrain = /^BuildTrain : ([A-Za-z]+)$/gm.exec(stdout)[1]
        const boardConfig = /^DeviceClass : ([A-Za-z0-9]+)$/gm.exec(stdout)[1]
        const restoreBehavior = /^RestoreBehavior : ([A-Za-z]+)$/gm.exec(stdout)[1]
        const variant = /^Variant : (.+)$/gm.exec(stdout)[1]
        const valid = stdout.match(/\[IMG4TOOL\] file is valid!/g) !== null

        return {
            success: true,
            data: {
                nonce,
                snon,
                srvn,
                ecidDec: ecid,
                ecidHex: (+ecid).toString(16).toUpperCase(),
                generator,
                buildNumber,
                buildTrain,
                boardConfig,
                restoreBehavior,
                variant,
                valid,
            }
        }
    }

    /**
     * Just a wrapper for exec command
     * To simply escaping stuff and promisify stuff
     * @param {String} command 
     * @param {Array} argument
     * @return {Promise}
     */
    async exec(bin, argument) {
        const args = shellescape(argument)
        const command = `${bin} ${args}`
        
        return new Promise((resolve, reject) => {
            execAsync(command, (error, stdout, stderr) => {
                if(error) reject(error)
                resolve({stdout, stderr})
            })
        })
    }
}