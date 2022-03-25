const ClientConfig = require("mindsphere-sdk-node-core").ClientConfig;
const AppCredentials = require("mindsphere-sdk-node-core").AppCredentials;
const TimeSeriesClient = require("timeseries-sdk").TimeSeriesClient;
const AssetsClient = require("assetmanagement-sdk").AssetsClient;
const StructureClient = require("assetmanagement-sdk").StructureClient;
const fs = require("fs");
const eventService = require("./mdsp-event-service");
const myScripts = require("./scripts.js");
const mdspUtils = require("./mdsp-utils");

const config = new ClientConfig();

//const myConfig = JSON.parse(fs.readFileSync("myConfFiles/devPlan.json"))
const myConfig = JSON.parse(fs.readFileSync("myConfFiles/valPlan.json"))

const credentials = new AppCredentials(JSON.parse(fs.readFileSync(myConfig.certificatesPath)));///myConfig.certificatesPath)));
const time_series_client = new TimeSeriesClient(config, credentials);
const assets_client = new AssetsClient(config, credentials);
const structure_client = new StructureClient(config, credentials);

const jsonFilesPath = "./data/biotronic_jsons/"




// poslední TS hodnotu z MDSP
async function getLastTimeSeriesAsync(assetId, aspect, variable) {
    let jsonData = await time_series_client.getTimeseries(
        {
            entity: assetId,
            propertysetname: aspect,
            select: variable
        }
    );
    let rawData = JSON.parse(jsonData)[0];
    return rawData[Object.keys(rawData)[0]];
}

// seznam assetů z MDSP
async function getAssetsAsync() {
    const request_object = {
        size: 200,
    };
    let jsonData = await assets_client.listAssets(request_object);
    let rawData = JSON.parse(jsonData)["_embedded"].assets;
    let data = [];

    for (let i = 0; i < rawData.length; i++) {
        const obj = rawData[i];
        let newObj = {
            id: obj.assetId,
            title: obj.name
        };
        data.push(newObj);
    }
    return data;
}

// seznam proměnných z MDSP
async function getAspVarsAsync(assetId) {
    const request_object = {
        id: assetId,
        size: 100
    };
    let jsonData = await structure_client.listAssetAspects(request_object);
    let rawData = JSON.parse(jsonData)["_embedded"].aspects;

    let data = [];

    for (let i = 0; i < rawData.length; i++) {
        const aspect = rawData[i];

        if (aspect.category === "dynamic") {
            for (let j = 0; j < aspect.variables.length; j++) {
                const variable = aspect.variables[j];
                let newObj = {
                    id: i * 10 + j * 1,
                    title: variable.name,
                    aspect: aspect.name
                };
                data.push(newObj);
            }
        }
    }
    return data;
}

async function findNewPatients() {
    let incomingNames = await myScripts.patientsFromReports()
    let assets = await getAssetsAsync()
    let newNames = []
    for (let i = 0; i < assets.length; i++) {
        if (!incomingNames.includes(assets[i].title)) {
            newNames.push(assets[i].title)
        }
    }
    return newNames
}

async function createEmptyAssets(patientName){
    let asset_resource = null;
    try {
        const request_object = {
            asset: {
                "name": patientName,
                "typeId": myConfig.assetType,
                "parentId": myConfig.assetParentId 
            }
        };

        asset_resource = await assets_client.addAsset(request_object);
        await new Promise(resolve => setTimeout(resolve, 3000));
        //return asset_resource.assetId
    } catch (ex) {
        console.log(ex)
    }


// vytvori novy asset, pokud neexistuje id.
    // Construct the AssetsClient object as shown above
/*
    let asset_resource = null;
    try {
        const request_object = {
            asset: {
                "name": payload.MDC_ATTR_PT_ID,
                "typeId": "vdtczvp.kardio_plain_v2",
                "parentId": "fa97eb15a4a24bf396c81e9c4bde09a3"//"4dab43fec9424041b18418fb336a848b"//
            }
        };

        asset_resource = await assets_client.addAsset(request_object);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return asset_resource.assetId
    } catch (ex) {
        console.log(ex)
    }
    */
}

async function createAssetPayload(fname) {
    let rawJson = fs.readFileSync(jsonFilesPath + fname);
    let objJson = await JSON.parse(rawJson);
    let obj = {}
    let eventsObj = {}

    let date = objJson["BIO_REQUEST_DATE"]
    let timeOfReport = (date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8) + "T" + "12:00:00+00:00");
    obj["_time"] = timeOfReport

    let refer = fs.readFileSync("./data/variablesUnion.json");
    refer = await JSON.parse(refer);

    ommited = ["NOTIFICATION", "EPISODE", "MDC_IDC_LEAD", "REPORT"]

    for (const [key, value] of Object.entries(objJson)) {

        if (ommited.some(substring => key.includes(substring))) {
            
            if (key.includes("REPORT")) {
                //TODO REPORT SAVING
                continue
            }
            const count = parseInt(key.slice(key.lastIndexOf("-") + 1))
            //const count = (key.match(/0/g) || []).length;
        
            let varKey = key
            if(key.includes("-")) varKey = varKey.slice(0, key.lastIndexOf("-"))
            varKey = varKey.replace(/_/g, "0")
            if (key.includes("MDC_IDC_STAT_EPISODE")) {
                if (eventsObj["MDC0IDC0STAT0EPISODE0V20" + count] == null) {
                    eventsObj["MDC0IDC0STAT0EPISODE0V20" + count] = {}
                }
                eventsObj["MDC0IDC0STAT0EPISODE0V20" + count][varKey] = value
            }
            else if (key.includes("MDC_IDC_EPISODE")) {
                if (eventsObj["MDC0IDC0EPISODE0V20" + count] == null) {
                    eventsObj["MDC0IDC0EPISODE0V20" + count] = {}
                }
                eventsObj["MDC0IDC0EPISODE0V20" + count][varKey] = value
            }
            else if (key.includes("BIO_REQUEST")) {
                if (eventsObj["BIO0REQUEST0HM0NOTIFICATION0V2" + count] == null) {
                    eventsObj["BIO0REQUEST0HM0NOTIFICATION0V2" + count] = {}
                }
                eventsObj["BIO0REQUEST0HM0NOTIFICATION0V2" + count][varKey] = value
            }
            else if (key.includes("BIO_IDC_STAT_EPISODE")) {
                if (eventsObj["BIO0IDC0STAT0EPISODE0V2" + count] == null) {
                    eventsObj["BIO0IDC0STAT0EPISODE0V2" + count] = {}
                }
                eventsObj["BIO0IDC0STAT0EPISODE0V2" + count][varKey] = value
            }
            else if (key.includes("LEAD")) {
                if (eventsObj["MDC0IDC0LEAD0V2" + count] == null) {
                    eventsObj["MDC0IDC0LEAD0V2" + count] = {}
                }
                eventsObj["MDC0IDC0LEAD0V2" + count][varKey] = value
            }
            //console.log(eventsObj)
            continue
        }

        if (value.length > 128) {
            obj[key] = "too long string"
        }
        else {
            if (refer[key] = "string") {
                obj[key] = "" + value
            }
            else {
                obj[key] = value
            }
        }
    }
    //console.log(obj)
    //fs.writeFileSync("./data/payload.json", JSON.stringify([obj]));
    let events = []
    for (const [key, value] of Object.entries(eventsObj)) {
        let newKey = key.split("V2")[0]
        newKey = newKey.concat("V2");
        let obj = {}
        obj[newKey] = value
        events.push(obj)
    }
    //console.log(JSON.stringify(events))
    //fs.writeFileSync("./data/episodes.json", JSON.stringify(events));
    return {
        ts: obj,
        events: events
    }

}
// posle payload do existujiciho assetu
async function sendToAsset(payload, entityID, bearer) {
    let timeseries_data = [
        payload.ts
    ];

    try {

        const request_object = {
            entity: entityID,
            propertysetname: myConfig.tsAspectName,
            timeseries: timeseries_data
        };

        await time_series_client.putTimeseries(request_object);
    } catch (ex) {
        console.log(ex)
    }
    let eventsData = payload.events
    console.log("A")
    console.log(eventsData)
    console.log("B")
    
    eventService.postEvents(eventsData, timeseries_data[0]["BIO_REQUEST_DATE"], entityID, bearer)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function sendReportsToMindsphere() {
    let bearer = await mdspUtils.getBearer()
    let assets = await getAssetsAsync()

    let files = fs.readdirSync(jsonFilesPath)

    for(const file of files){
        await sleep(1000)
        saveReport(file, bearer, assets)
    }
}


// rozhodne se podle jmena assetu jestli vytvori, nebo jen prida

async function saveReport(fname, bearer, assets) {

    let payloadTuple = await createAssetPayload(fname)
    let newPatientName = payloadTuple.ts.MDC_ATTR_PT_ID
    //// !!!! TEST PAK VYMAZAT !!!!!!!!!!!!
    if(myConfig.limitedPatients){
        if(!(["Spulak5911151675", "Hovorka430225112"].includes(newPatientName))){
            return
        }
    }
    for (let i = 0; i < assets.length; i++) {
        if (newPatientName === assets[i].title) {
            sendToAsset(payloadTuple, assets[i].id, bearer)
            console.log("poslano")
            return

        }
    }

    //TODO kdyz neexistuje pacos
    /*console.log("Not existing asset")
    let assetID = await createAsset(payload)
    sendToAsset(payload, assetID, bearer)
    */
    
    return
}

module.exports = {
    getLastTimeSeriesAsync,
    getAssetsAsync,
    getAspVarsAsync,
    saveReport,
    sendReportsToMindsphere,
    sendToAsset,
    createAssetPayload,
    createEmptyAssets
};