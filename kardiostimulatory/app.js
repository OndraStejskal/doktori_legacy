// moduly
const express = require("express");
const errorHandler = require("./helpers/errorHandler");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const logger = require("./helpers/logger")
const biotronikService = require("./services/biotronik-service");
const mdspService = require("./services/mdsp-service");
// controllery
const indexController = require("./controllers/index");
const apiController = require("./controllers/app-api");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// zařazení controlleru do pipeline
app.use("/", indexController);
app.use("/app-api/", apiController);

// zařazení error handleru
app.use(errorHandler);


console.log(mdspService.getAssetsAsync())
// plánovač, spuštění každou min
cron.schedule("* * * * *", () => {
    logger.info("running a task every minute");

    //fetch data from biotronik database
    //fetch data from other databases



    //send data to mindsphere


});

cron.schedule("* * * * *", () => {
    logger.info("2running a task every minute");

    //fetch data from biotronik database
    //fetch data from other databases

    

    //send data to mindsphere


});

module.exports = app;
