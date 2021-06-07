import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const isProd = process.env.NODE_ENV === "production";

const loggingWinston = new LoggingWinston({
  labels: {
    name: process.env.LOG_SERVICE_NAME || "run.googleapis.com/intouch"
  }
});

const getLogLevel = () => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }

  return process.env.NODE_ENV === "production" ? "error" : "debug";
};

const logger = (headers, module) => {
  const { combine, timestamp, label, printf } = winston.format;
  const transports: winston.transport[] = [new winston.transports.Console({})];
  if (isProd) {
    transports.push(loggingWinston);
  }

  const cid = headers["x-request-id"] ? ` - ${headers["x-request-id"]}: ` : "";
  const format = isProd
    ? combine(
        label({ label: module }),
        timestamp(),
        printf(
          (info) =>
            `${[info.timestamp]} ${info.level} [${info.label}]:${cid} ${
              info.message
            }`
        )
      )
    : combine(
        label({ label: module }),
        winston.format.colorize(),
        timestamp(),
        printf(
          (info) =>
            `${[info.timestamp]} ${info.level} [${info.label}]${cid} ${
              info.message
            }`
        )
      );

  return winston.createLogger({
    handleExceptions: true,
    level: getLogLevel(),
    format,
    transports,
    exceptionHandlers: [new winston.transports.Console({})]
  });
};

export const NextLogger = (req: any, res: any) => {
  const { headers } = req;

  req.logger = (module: string) => logger(headers, module);
};

export default (req: any, res: any, next: any) => {
  const { headers } = req;

  req.logger = (module: string) => logger(headers, module);

  return next();
};
