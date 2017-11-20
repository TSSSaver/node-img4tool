# node-img4tool

Just a wrapper for img4tool. Only guaranteed to work on Linux!

Sorry for the crappy Readme



---
Example code

```js
const node-img4tool = require('node-img4tool')

const binPath = './img4tool_linux'
const bmPath = './bm'

const img4tool = new node-img4tool(binPath, bmPath)

const shsh2File = './ECID_*.shsh2'
const iOSInfo = {
    deviceId: 'iPhone8,1',
    version: '11.0.2',
    buildId: '15A421'
}
imgtool.dumpAllInfo(shsh2File, iOSInfo).then(data => {
    console.log(data) //Object
})
imgtool.verify(shsh2File, iOSInfo).then(data => {
    console.log(data) //Object
})
imgtool.printAll(shsh2File).then(data => {
    console.log(data) //Object
})
```

# 

# verify
Same as `./img4tool -v (BuildManifest.plist) -s (shsh2 file)`
Output: 
```json
{ 
    "success": true,
    "data": { 
        "nonce": "[String]",
        "snon": "[String]",
        "srvn": "[String]",
        "ecidDec": "[String]",
        "ecidHex": "[String]",
        "generator": "[String]",
        "buildNumber": "15A421",
        "buildTrain": "Tigris",
        "deviceClass": "n71map",
        "restoreBehavior": "Erase",
        "variant": "Customer Erase Install (IPSW)",
        "valid": true 
    } 
}
```

# printAll
Same as `./img4tool -a -s (shsh2 file`)
Output: 
```json
{ 
    "sucess": true,
    "data": { 
        "tags": { 
            "aopf": "[Object]",
            "bat0": "[Object]",
            "bat1": "[Object]",
            "batF": "[Object]",
            "chg0": "[Object]",
            "chg1": "[Object]",
            "dtre": "[Object]",
            "ftap": "[Object]",
            "ftsp": "[Object]",
            "glyP": "[Object]",
            "ibec": "[Object]",
            "ibot": "[Object]",
            "ibss": "[Object]",
            "illb": "[Object]",
            "krnl": "[Object]",
            "logo": "[Object]",
            "rdsk": "[Object]",
            "rdtr": "[Object]",
            "recm": "[Object]",
            "rfta": "[Object]",
            "rfts": "[Object]",
            "rkrn": "[Object]",
            "rlgo": "[Object]",
            "rosi": "[Object]",
            "rsep": "[Object]",
            "sepi": "[Object]" 
        } 
    } 
}
```
# dumpAllInfo
Just the 2 other functions combined into 1