//zgrupuj data podle timesereries aspectu
function createGroupsByDate() {
    let plainJson = fs.readFileSync("./data/obj1.json");
    plainJson = JSON.parse(plainJson);
    strings = Object.keys(plainJson)

    groupedDict = {}

    for (let str of strings) {
        //str = "MDC_IDC_MSMT_LEADCHNL_RV_DTM_START"
        parent_str = str
        if (str.substring(str.length - 7) == "DTM_END") {
            parent_str = str.substring(0, str.length - 7)
        }
        else if (str.substring(str.length - 3) == "DTM") {
            parent_str = str.substring(0, str.length - 3)
        }
        else {
            continue;
        }

        contentOfGroup = []
        for (let str2 of strings) {
            if (parent_str == str2.substring(0, parent_str.length) & str !== str2) {
                contentOfGroup.push(str2)
            }
        }
        groupedDict[str] = contentOfGroup
    }

    //kdyz nema DTM
    /* for (let str of strings){
         for(item of groupedArr){
             if(str == Object.keys(item))
         }
     }*/
    fs.writeFileSync("./data/groupedDict.json", JSON.stringify(groupedDict));
}

function createAssetPayload2(fname) {
    let rawJson = fs.readFileSync("./data/jsons/" + fname);
    let objJson = JSON.parse(rawJson);
    obj = {}

    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    timenNow = (year + "-" + month + "-" + date + "T" + "0" + hour + ":00:00");

    obj["_time"] = timenNow

    let refer = fs.readFileSync("./data/obj1.json");
    refer = JSON.parse(refer);
    for (const [key, value] of Object.entries(objJson)) {



        if (value.length > 30) {
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
    console.log(obj)
    fs.writeFileSync("./data/payload.json", JSON.stringify([obj]));
}