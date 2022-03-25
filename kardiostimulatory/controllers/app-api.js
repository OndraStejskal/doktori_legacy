const express = require("express");
const router = express.Router();
const dataService = require("../services/data-service");
const biotronikService = require("../services/biotronik-service");
const logger = require("../helpers/logger");
const asyncHandler = require("express-async-handler");

// GET: /app-api/events
// všechny eventy
router.get("/events", asyncHandler(async(req, res, next) => {
    let events = dataService.getAllEvents();
    res.json(events)
}));

// GET: /app-api/patients
// všichni pacienti
router.get("/patients", asyncHandler(async(req, res, next) => {
    let patients = dataService.getAllPatients();
    res.json(patients)
}));

// GET: /app-api/event/1
// jeden event
router.get("/event/:id", asyncHandler(async(req, res, next) => {
    let event = dataService.getEvent(req.params.id);
    res.json(event)
}));

// GET: /app-api/patients/1
// detail pacienta
router.get("/patientDetail/:id", asyncHandler(async(req, res, next) => {
    let patientDetail = dataService.getPatient(req.params.id);
    res.json(patientDetail)
}));

// GET: /app-api/test
router.get("/test", asyncHandler(async(req, res, next) => {   
    logger.info("api/test");
    await biotronikService.saveReports();
    res.send("OK");
}));

// GET: /app-api/logs
router.get("/logs", asyncHandler(async(req, res, next) => {    
    const fs = require("fs");
    let data = fs.readFileSync("./logs/log.log");
    res.json({logs: data});
}));


module.exports = router;