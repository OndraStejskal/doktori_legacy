//------------------------------------------ADAMOVI FUNKCE-----------------------------------------------------
/*
// PDF export (email požadavek od Ing. Fingrové)
async function exportPdf() {
    let reports = await getReportList();
    let startDate = new Date("2020-12-20T00:00:00Z");

    for (let i = 0; i < reports.length; i++) {
        let report = reports[i];
        let createDate = new Date(report.created_at);

        if (createDate > startDate) {
            let xmlData = await getReport(report.id);
            fs.writeFileSync("./exports/" + report.id + ".xml", xmlData);
            logger.info("XML report: " + report.id + " was saved");

            let data = await parseXmlToObj(xmlData);
            base64str = data["biotronik-ieee11073-export"].dataset[0].section[1].section[0].section[1].section[0].value[1]["_"];

            fs.writeFile("./exports/" + report.id + ".pdf", base64str, { encoding: "base64" }, function (err) {
                logger.info("PDF report: " + report.id + " was saved");
            });
        }
    }
    logger.info("Done!");
}

// tmp - ukládání 3 reportů do MDSP filů 
async function saveReports() {
    let reports = await getReportList();

    for (let i = 0; i < reports.length; i++) {
        let report = reports[i];

        let xmlData = await getReport(report.id);
        await mdspService.createFile(report.id, xmlData);
    }
}

// tmp - pro každý report zaloguje jednu proměnnou
async function getTestData() {
    console.log("hello2")
    let reports = await getReportList();
    for (let i = 0; i < reports.length; i++) {
        let report = reports[i];
        let reportDetailXml = await getReport(report.id);

        let reportDetailObj = await parseXmlToObj(reportDetailXml);
        logger.info(reportDetailObj["biotronik-ieee11073-export"].dataset[0].section[0].section[0].section[0].value[2]["_"]);
    }
}


module.exports = {
    getTestData, saveReports, saveReportsLocally, getReportList, parseBiotronik, files_to_json, showJSON, createComplDictVariables
};*/