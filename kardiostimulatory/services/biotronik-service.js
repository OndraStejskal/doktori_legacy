const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");
const xml = require("xml2js");
const logger = require("../helpers/logger");
const { Console } = require("console");
const e = require("express");

const xmlReportPath = "./data/biotronic_reports/"
const jsonReportPath = "./data/biotronic_jsons/"

// nastavení pro Biotronik Fetch API
const baseUrl = "https://api.biotronik-homemonitoring.com/rest/api";
const clientId = "980540699";
const clientSec = "gsIgUnEm";

const sslAgent = new https.Agent({
    key: fs.readFileSync("./certificates/980540699-private.key"),
    cert: fs.readFileSync("./certificates/980540699-cert.pem"),
    rejectUnauthorized: false,
    keepAlive: true
});
const headers = {
    "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSec).toString("base64")
};

// získání seznamu reportů ze serveru Biotroniku
async function getReportList() {
    let response = await fetch(baseUrl + "/exports", {
        method: "GET",
        agent: sslAgent,
        headers: headers
    });

    let data = await response.json();
    logger.info(data.exports.length + " reports were fetched");
    return data.exports;
}

// získání celého reportu ze serveru Biotroniku
async function getReport(id) {
    let response = await fetch(baseUrl + "/exports/" + id, {
        method: "GET",
        agent: sslAgent,
        headers: headers
    });

    let xmlData = await response.text();
    logger.info(`Report ${id} was fetched`);
    return xmlData;
}


// - ukldadani reportu do local/data
async function saveReportsLocally() {

    //Biotronik api call pro seznam reportu
    let reports = await getReportList();

    //Kazdy report se stahne do localData/reports
    for (let i = 0; i < reports.length; i++) {
        let report = reports[i];
        let xmlData = await getReport(report.id);
        fs.writeFile(xmlReportPath + report.id + '.xml', xmlData, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(report.id);
            }
        });
    }
}

// parsování XML stringu do JS objectu
async function parseXmlToObj(xmlString) {
    let xmlParser = new xml.Parser();

    return new Promise((resolve, reject) => {
        xmlParser.parseString(xmlString, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}


//nacte ./localData/reports a pro vsechny zavola parseBiotronik 
async function files_to_json() {
    fs.readdir(xmlReportPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            //console.log(file)
            parseBiotronik(file);
        });
    });
}

/*  
-vezme xml z localData
-projde xml pomoci funkce traverse_xml
-vysledny slovnik vlozi do jsonu a ulozu do .data/jsons
*/
async function parseBiotronik(fname) {
    let xml_string = fs.readFileSync(xmlReportPath + fname, "utf8");

    let jsonObj = await parseXmlToObj(xml_string);
    dict = {}
    dict = traverseXml(jsonObj, "", dict);
    var jsonDict = JSON.stringify(dict);
    fs.writeFile(jsonReportPath + fname.slice(0, -3) + "json", jsonDict, function (err) {
        if (err) {
            console.log(err);
        }
    });

}

// Stromove projiti xml struktury a vytvoreni plocheho slovniku
function traverseXml(jsonObj, name, dict, typeDict) {
    if (jsonObj !== null && typeof jsonObj == "object") {
        if (jsonObj["$"] != null && jsonObj["$"]["name"] != null) {
            name = name.concat(jsonObj["$"]["name"], "_");
        }


        name = checkWordForException(name, jsonObj, dict)


        if (name === "MDC_IDC_SET_ZONE_") {
            name = name.concat(jsonObj["$"]["name"], "_");
        }

        if (jsonObj["_"] != null) {
            let leafValue = jsonObj["_"]
            if (leafValue === "\n") {
                leafValue = leafValue.replace(/[^0-9|.]/g, "");
            }
            if (jsonObj["$"]["type"] != null) {
                if (jsonObj["$"]["type"] === "Numeric") {
                    leafValue = parseFloat(leafValue)
                }
            }

            let ret_name = name.slice(0, -1)
            
            let counter = 1 
            while (ret_name in dict) {
                if(counter == 1){
                    ret_name = ret_name + "-" + counter    
                }
                else{
                    ret_name = ret_name.slice(0, ret_name.lastIndexOf("-") + 1) + counter
                }
                counter+=1
            }

            dict[ret_name] = leafValue
        }
        for (const [key, value] of Object.entries(jsonObj)) {
            traverseXml(value, name, dict)
        }

    }
    return dict
}

function checkWordForException(varName, jsonObj, dict) {
    /*  dict = {
          "MDC_IDC_SET_ZONE_" : 
      }
      */
    if (varName === "MDC_IDC_SET_ZONE_") {
        //console.log(jsonObj.value[1]["_"])
        dict = {
            "BIO-Zone_AMon": "ATAF",
            "BIO-Zone_VF": "VF",
            "BIO-Zone_VT1": "VT1",
            "BIO-Zone_VT2": "VT2",
        }
        varName = varName.concat(dict[jsonObj.value[1]["_"]], "_");
    }

    arr = [
        "BIO_IDC_MSMT_HEART_FAILURE_",
        "BIO_IDC_MSMT_LEADHVCHNL_",
        "BIO_IDC_STAT_HEART_RATE_",
        "BIO_IDC_STAT_BRADY_",
        "BIO_IDC_STAT_AT_",
        "BIO_IDC_STAT_ACTIVITY_",

    ]
    if (arr.includes(varName)) {
        console.log(varName + "1_DTM_START")
        if (dict[varName + "1_DTM_START"] === undefined) {
            varName = varName.concat("1", "_")
        }
        else {
            varName = varName.concat("2", "_")
        }
    }




    return varName
}

//Sebrani vsech nazvu klicu z json reportu a vytvoreni sjednoceni techto klicu pro mindpshere datatype, tento slovnik je v data/variablesUnion.json
function createComplDictVariables() {
    let baseline = fs.readFileSync("./data/test.json");
    let jsonBaseline = JSON.parse(baseline);
    let obj1 = {}
    obj1 = addKeys(obj1, jsonBaseline)

    fs.readdir(jsonReportPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            let rawdata = fs.readFileSync(jsonReportPath + file);
            let jsonObj = JSON.parse(rawdata);
            if (!sameKeys(jsonBaseline, jsonObj)) {
                obj1 = addKeys(obj1, jsonObj)
            }
        });
        console.log(obj1)
        fs.writeFileSync("./data/variablesUnion.json", JSON.stringify(obj1));
    });

}

//pomocna funkce pro createComplDictVariables
function addKeys(obj1, obj2) {
    var array2 = Object.keys(obj2).sort();
    for (key of array2) {
        if (!(key in obj1)) {
            if (typeof (obj2[key] === typeof ("string")) && obj2[key].length > 10000) {
                obj1[key] = 'big_string'
            }
            else {
                obj1[key] = typeof (obj2[key])
            }
        }
    }
    return obj1
}

//pomocna funkce pro createComplDictVariables
function sameKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}



//------------------------------------------ Testovaci FUNKCE-----------------------------------------------

//vezme jeden report z local dat a ulozi ho v jsonu do rawjsonu
async function showJSON(fname) {
    let xml_string = fs.readFileSync(xmlReportPath + fname, "utf8");
    let jsonObj = await parseXmlToObj(xml_string);
    jsonObj
    fs.writeFile("./data/rawjson.json", JSON.stringify(jsonObj), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function printKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();


    for (const valKey of aKeys) {
        if (!bKeys.includes(valKey)) {
            console.log(valKey)
        }
    }
}

function addKeys2(array1, obj2) {
    var array2 = Object.keys(obj2).sort();

    const array3 = array1.concat(array2)
    return array3.filter((item, pos) => array3.indexOf(item) === pos)
}

module.exports = {
   saveReportsLocally, files_to_json 
}