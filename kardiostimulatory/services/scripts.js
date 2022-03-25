const e = require("express");
const fs = require("fs");

async function get_all_values(varName, url){
    const files = await fs.promises.readdir(url);
    //console.log(files.length)
    // Loop them all with the new for...of
    let values = []
    for (const file of files) {
        let rawJson = await fs.readFileSync(url + "/" + file);
        let objJson = await JSON.parse(rawJson);
        if (!(objJson[varName] in values)) {
            values.push([objJson[varName], objJson["MDC_IDC_DEV_TYPE"]])
        }

    }
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = values.length; i < l; i++) {
        var stringified = JSON.stringify(values[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(values[i]);
        itemsFound[stringified] = true;
    }
    console.log(uniques)
}

//vytvori zpravu payload pro postmana na vytvoreni plain aspect typu requestDict
function create_aspectType() {
    let rawJson = fs.readFileSync("./data/variablesUnion.json");
    let objJson = JSON.parse(rawJson);
    varArray = []

    ommited = ["NOTIFICATION", "EPISODE", "MDC_IDC_LEAD", "REPORT"]

    for (const [key, value] of Object.entries(objJson)) {

        if (ommited.some(substring => key.includes(substring))) {
            continue
        }

        obj = {}

        if (value === 'number') {
            obj = {
                "name": key,
                "dataType": "DOUBLE"
            }
        }
        else {
            obj = {
                "name": key,
                "length": 1024,
                "dataType": "STRING"
            }
        }
        varArray.push(obj);
    }


    let dict = {
        "name": "plainBiotronik",
        "category": "dynamic",
        "scope": "private",
        "description": "All variables obtained from biotronik XML structure",
        "variables": varArray
    }
    fs.writeFileSync("./data/requestDict.json", JSON.stringify(dict));
}


//vrati list id pacientu ze vsech reportu od biotroniku
async function patientsFromReports() {
    const fs = require('fs');
    const path = require('path');

    const moveFrom = "./data/biotronic_jsons";

    // Make an async function that gets executed immediately

    // Get the files as an array
    const files = await fs.promises.readdir(moveFrom);
    //console.log(files.length)
    // Loop them all with the new for...of
    arr = {}
    let arr2 = []
    count = 0
    for (const file of files) {
        let rawJson = await fs.readFileSync(moveFrom + "/" + file);
        let objJson = await JSON.parse(rawJson);
        if (!(objJson["MDC_ATTR_PT_ID"] in arr)) {
            arr[objJson["MDC_ATTR_PT_ID"]] = 1
            count += 1
            //if(objJson["MDC_ATTR_PT_ID"] == "'5755070112 Holečková'")
            arr2.push(objJson["MDC_ATTR_PT_ID"])
        }
        else {
            arr[objJson["MDC_ATTR_PT_ID"]] = arr[objJson["MDC_ATTR_PT_ID"]] + 1
            count += 1
        }
    } // End for...of
    return (arr2)
    //console.log(count)
}

module.exports = {
    create_aspectType, patientsFromReports, get_all_values
};