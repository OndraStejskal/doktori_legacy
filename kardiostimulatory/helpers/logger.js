const winston = require("winston");
const { format } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ message, timestamp }) => {
    return `[${timestamp}] ${message}`;
  });

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        myFormat
      ),
    transports: [
      new winston.transports.File({ filename: "logs/log.log" }),
      new winston.transports.Console()
    ],
});

module.exports = logger;