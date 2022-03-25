const saver = require("./services/biotronik-service");
const scripts = require("./services/scripts");
const mdsp = require("./services/mdsp-service");
const sc = require("./services/scripts")

//const event = require("./services/mdsp-event-service")
//mdsp.saveReport()


//(flow)
saver.saveReportsLocally() // zasavi data lokalne
//saver.files_to_json(); //prevede xml to jsonu
//scripts.get_all_values("MDC_IDC_LEAD_MODEL", "./data/biotronic_jsons2")

//mdsp.sendReportsToMindsphere() // posle data do mindsphere



//---------------------------TEST--------------------------------------------------
//saver.compare_files2();
//scripts.create_aspectType();
//fname = "fa9d4830-b09b-4b43-8e71-88c735da2556.json"
//mdsp.createAssetPayload(fname)
//saver.createComplDictVariables()
//scripts.createGroupsByDate();
//saver.parseBiotronik("0bcb9478-8c5e-476a-ad44-976b449a8fc8.xml")

//saver.parseBiotronik2("0bcb9478-8c5e-476a-ad44-976b449a8fc8.xml")

//scripts.patientsFromReports()
//mdsp.sendReportsToMindsphere()
//mdsp.createAssetPayload("0a9ab931-3341-4b47-a67f-098f485287b4.json")
//event.getReportList()
//const fname = "f81e5635-6bd0-4345-bdfc-7749314711dd.json"
//mdsp.saveReport(fname)
//mdsp.getAssetsAsync().then(ret => console.log(ret))
//saver.parsePodoli()
//mdsp.createEmptyAssets()