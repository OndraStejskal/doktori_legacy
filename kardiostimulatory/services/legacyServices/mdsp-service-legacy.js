const ClientConfig = require("mindsphere-sdk-node-core").ClientConfig;
const AppCredentials = require("mindsphere-sdk-node-core").AppCredentials;
const FileServiceClient = require("iotfileservices-sdk").FileServiceClient;
const fs = require("fs");
const logger = require("../../helpers/logger");

let config = new ClientConfig();
let credentials = new AppCredentials(JSON.parse(fs.readFileSync("certificates/app_credentials.json")));
let file_service_client = new FileServiceClient(config, credentials);

// vytvoří nový soubor v MDPS
async function createFile(fileName, fileContent) {
        const request_object = {
            file: fileContent,
            entityId: "7ae37818074c4c0fb02a89ecac707b0f",
            filepath: `${fileName}.xml`,
            type: "text/xml"
        };

        await file_service_client.putFile(request_object);
        logger.info(`File ${fileName} was created`);
}

module.exports = {
    createFile
};

