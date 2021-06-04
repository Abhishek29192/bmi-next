import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const isProd = process.env.NODE_ENV === "production";

const getLogLevel = () => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }

  return process.env.NODE_ENV === "production" ? "error" : "debug";
};

const logger = (headers, module) => {
  const reqId = headers["x-request-id"] || "";
  const loggingWinston = new LoggingWinston({
    labels: {
      name: process.env.LOG_SERVICE_NAME || "run.googleapis.com/intouch"
    }
  });

  const transports: winston.transport[] = [new winston.transports.Console({})];
  if (isProd) {
    // transports.push(loggingWinston);
  }
  transports.push(loggingWinston);

  let format = isProd
    ? winston.format.combine(
        winston.format.label({ label: module, message: true }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.label({ label: module, message: true }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({
          fillExcept: ["message", "level", "timestamp", "label"]
        }),
        winston.format.printf(
          ({ timestamp, level, message, error, ...metadata }) => {
            let msg = `${[timestamp]} ${level}`;

            if (typeof message !== "string") {
              msg = `${msg} ${JSON.stringify(message)}`;
            } else {
              msg = `${msg} ${message}`;
            }

            if (error?.stack) {
              msg = `${msg} ${error.stack}`;
            }

            if (metadata && Object.keys(metadata).length > 0) {
              msg = `${msg} ${JSON.stringify(metadata)}`;
            }

            return msg;
          }
        )
      );

  return winston.createLogger({
    handleExceptions: true,
    level: getLogLevel(),
    format: format,
    transports,
    defaultMeta: { requestId: reqId },
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
