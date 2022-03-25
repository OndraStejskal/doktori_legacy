const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");
const xml = require("xml2js");
const logger = require("../helpers/logger");
const { Console } = require("console");
const e = require("express");
const readline = require('readline');
const { json } = require("express");

const hlReportPath = "./data/boston_reports/"
//const jsonReportPath = "./data/biotronic_jsons/"
const fname = "csc_20210614142104_175627035_1.hl7"

async function parseBoston(fname) {
    const fileStream = fs.createReadStream(hlReportPath + fname, "utf8");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let jsonObj = {}
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        let lineArr = line.split("|")
        if (lineArr[0] == "PID") {
            jsonObj["MDC_ATTR_PT_ID"] = lineArr[5] + lineArr[7]
            
        }
        if (lineArr[0] == "OBX") {
            let variableType = lineArr[3].split("^")[1]
            let addedIndex = lineArr[4] ? ("-" + lineArr[4]) : lineArr[4]
            jsonObj[variableType + addedIndex] = lineArr[5] 
        }
        
    }
    jsonObj = await toBiotronikFormat(jsonObj)
    var jsonDict = JSON.stringify(jsonObj);
    fs.writeFile("./data/boston_jsons/test.json", jsonDict, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

async function toBiotronikFormat(dict){
    zoneDict = {}
    for (let [key, value] of Object.entries(dict)) {
        if(key.includes("MDC_IDC_SET_ZONE_TYPE-")){

            let whichZone = ""
            if(value.includes("VT2"))
                whichZone = "VT2"
            else if(value.includes("VT1"))
                whichZone = "VT1"
            else if(value.includes("VT"))
                whichZone = "VT"
            else if(value.includes("VF"))
                whichZone = "VF"
            else if(value.includes("AT"))
                whichZone = "ATAF"
            zoneDict[key.slice(key.lastIndexOf("-")+1)] = whichZone
        }
    }
    resultDict = {}
    for (let [key, value] of Object.entries(dict)) {
        let newKey = key
        if(key.includes("ZONE")){
            let index = key.slice(key.lastIndexOf("-")+1)
            newKey = "MDC_IDC_SET_ZONE_" + zoneDict[index] + key.slice(16)
            resultDict[newKey] = value
        }
        else{
            resultDict[newKey] = value
        }
        // odstrani zbytecne -[cislo]
        if(!(newKey.includes("EPISODE") || newKey.includes("MDC_IDC_LEAD")) && newKey.slice(-2,-1) == "-"){
            if(newKey == "MDC_ATTR_PT_ID")
            resultDict[newKey.slice(0,newKey.lastIndexOf("-"))] = value
            delete resultDict[newKey]
        }
        
    }
    
    // ONLY TEMPORARY SOLUTION FOR VALUES DIFFERENT THAN BIOTroNIK- HAVE TO ADD VALUES TO THE PLAIN ASPECT
    let rawdata2 = fs.readFileSync("./data/variablesUnion.json");
    let biotronik = JSON.parse(rawdata2);
    for (let [key, value] of Object.entries(resultDict)) {
        let oldKey = key
        if(key.slice(-2,-1) == "-"){
            key = key.slice(0, -2)
        }
        if(!(key in biotronik)){
            delete resultDict[oldKey]
        }
      }

    //console.log(resultDict) 
    return(resultDict)

}

let rawdata = fs.readFileSync("./data/boston_jsons/test.json");
let boston = JSON.parse(rawdata);

let rawdata2 = fs.readFileSync("./data/variablesUnion.json");
let biotronik = JSON.parse(rawdata2);

/*
ommited = []
for (let [key, value] of Object.entries(boston)) {
    if(key.slice(-2,-1) == "_"){
        key = key.slice(0, -2)
    }
    if(!(key in biotronik))
        {ommited.push(key);}
    
  }

function decideZone(str){

}

parseBoston(fname,ommited)
*/

//console.log(toBiotronikFormat(rawdata))
parseBoston(fname)