const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");
const xml = require("xml2js");
const logger = require("../helpers/logger");
const mdspService = require("./mdsp-service");
const { Console, timeStamp } = require("console");
const e = require("express");
const myConfig = JSON.parse(fs.readFileSync("myConfFiles/valPlan.json"))
//const myConfig = JSON.parse(fs.readFileSync("myConfFiles/valPlan.json"))


async function postEvents(payload, date, id, bearer) {
    
    identifiersForCorrelation = {
        "MDC0IDC0STAT0EPISODE0V2" : "MDC0IDC0STAT0EPISODE0VENDOR0TYPE",
        "MDC0IDC0EPISODE0V2" : "MDC0IDC0EPISODE0ID",
        "BIO0REQUEST0HM0NOTIFICATION0V2" : "BIO0REQUEST0HM0NOTIFICATION0ID",
        "BIO0IDC0STAT0EPISODE0V2" : "BIO0IDC0STAT0EPISODE0VENDOR0TYPE",
        "MDC0IDC0LEAD0V2" : "MDC0IDC0LEAD0MODEL"

    }
    dtms = {
        "MDC0IDC0STAT0EPISODE0V2" : "MDC0IDC0STAT0EPISODE0RECENT0COUNT0DTM0END",
        "MDC0IDC0EPISODE0V2" : "MDC0IDC0EPISODE0DTM",
        "BIO0REQUEST0HM0NOTIFICATION0V2" : "BIO0REQUEST0HM0NOTIFICATION0UPDATE0DTM",
        "BIO0IDC0STAT0EPISODE0V2" : "BIO0IDC0STAT0EPISODE0RECENT0COUNT0DTM0END",
        "MDC0IDC0LEAD0V2" : date
    }
    
    for (const element of payload) {
        const eventType = Object.keys(element)
        const eventPayload = element[eventType]

        let dateTime = ""
        if(eventType === "MDC0IDC0LEAD0V2"){
            dateTime = date
            continue //Musim dodelat eventa
        }
        else{
            dateTime = eventPayload[dtms[eventType]]
        }
        if( typeof dateTime === 'undefined'){
            dateTime = "20180101T000000"
        }
        const timestamp = (dateTime.substring(0,4) + "-" + dateTime.substring(4,6) + "-" + dateTime.substring(6,8) + "T" + dateTime.substring(9,11) + ":" + dateTime.substring(11,13) + ":" + dateTime.substring(13,15) + "+00:00");  
        
        eventPayload["typeId"] = myConfig["events"]["eventIds"][eventType]
        
        eventPayload["timestamp"] = timestamp
        if(eventType == "MDC0IDC0EPISODE0V2" || eventType ==  "BIO0REQUEST0HM0NOTIFICATION0V2"){
            eventPayload["correlationId"] = eventPayload[identifiersForCorrelation[eventType]]
        }
        else{
            eventPayload["correlationId"] = eventPayload[identifiersForCorrelation[eventType]] + dateTime
            }
        eventPayload["entityId"] = id
        eventPayload["Resolved"] = false
        
        const mdspEventUrl = "https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events";
        
        let response = await fetch(mdspEventUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearer}`
            },
            body: JSON.stringify(eventPayload)
        });
        console.log(eventPayload)
        console.log(response)
      //  console.log(eventPayload["correlationId"])
        //console.log(eventType)*/
        /*if(eventType == "BIO0IDC0STAT0EPISODE0V2"){
            console.log(JSON.stringify(eventPayload))
        }*/
        
    }

}
module.exports = {
    postEvents
};