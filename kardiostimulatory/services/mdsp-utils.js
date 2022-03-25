const fetch = require("node-fetch");
const fs = require("fs");
const myConfig = JSON.parse(fs.readFileSync("myConfFiles/valPlan.json"))
//const myConfig = JSON.parse(fs.readFileSync("myConfFiles/valPlan.json"))

async function getBearer() {
    let jsonCreds = JSON.parse(fs.readFileSync(myConfig["certificatesPath"]));
    const bearerUrl = "https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token";
    let id = jsonCreds.keyStoreClientId//"vdtczop-comosintegration-1.0.5-89394053";
    let secret = jsonCreds.keyStoreClientSecret //"E7ezNTk64h7vYHZAVPPzo6JURucjCb9EndZ1b85W3uI";
    //let code = btoa(id + ":" + secret);
    let code = Buffer.from(id + ":" + secret, 'binary').toString('base64')

    let body = {
        "grant_type": jsonCreds.grant_type,
        "appName":	jsonCreds.appName,
        "appVersion": jsonCreds.appVersion,
        "hostTenant": jsonCreds.hostTenant,
        "userTenant": jsonCreds.userTenant
    } 
    let response = await fetch(bearerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-SPACE-AUTH-KEY': `Bearer ${code}`
        },
        body: JSON.stringify(body)
    });

    let data = await response.json();
    console.log(data.access_token)
    
    return data.access_token;
}

module.exports = {
    getBearer
};