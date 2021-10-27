import winston from "winston";
import { LoggingWinston as gcpLogger } from "@google-cloud/logging-winston";
import maskDeep from "mask-deep";

const isProd = process.env.NODE_ENV === "production";

const getLogLevel = () => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }

  return process.env.NODE_ENV === "production" ? "error" : "debug";
};

const REDACTED_KEYS = [
  "email",
  "password",
  "doceboUsername",
  "firstName",
  "lastName",
  "name",
  "surname",
  "first_name",
  "last_name",
  "invitee"
];

const loggingWinston = new gcpLogger({
  labels: {
    name: process.env.LOG_SERVICE_NAME || "run.googleapis.com/intouch"
  }
});

let winstonLogger: winston.Logger;

const redact = winston.format((info, opts) => {
  const redacted = maskDeep(info, REDACTED_KEYS);
  return {
    ...info,
    ...redacted
  };
});

const defaultFormat = isProd
  ? winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      redact(),
      winston.format.json()
    )
  : winston.format.combine(
      redact(),
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.metadata({
        fillExcept: ["message", "level", "timestamp", "label"]
      }),
      winston.format.printf(
        ({ timestamp, level, message, error, ...metadata }) => {
          let msg = `${[timestamp]} ${level}`;

          if (typeof message !== "string") {
            const redacted = maskDeep(message, REDACTED_KEYS);
            msg = `${msg} ${JSON.stringify(redacted, null, 4)}`;
          } else {
            msg = `${msg} ${message}`;
          }

          if (error?.stack) {
            msg = `${msg} ${error.stack}`;
          }

          if (metadata && Object.keys(metadata).length > 0) {
            const redacted = maskDeep(metadata.metadata, REDACTED_KEYS);

            msg = `${msg} ${JSON.stringify(
              {
                ...metadata,
                metadata: redacted
              },
              null,
              4
            )}`;
          }

          return msg;
        }
      )
    );

const logger = (headers: { [key: string]: string }, module: string) => {
  if (!winstonLogger) {
    winstonLogger = winston.createLogger({
      handleExceptions: true,
      level: getLogLevel(),
      transports: [
        isProd ? loggingWinston : new winston.transports.Console({})
      ],
      exceptionHandlers: [
        isProd ? loggingWinston : new winston.transports.Console({})
      ]
    });
  }

  const addHeader = winston.format((info) => {
    info.requestId = headers["x-request-id"] || "";
    info.accountId = headers["x-authenticated-user-id"] || "";
    info.module = module;
    return info;
  });

  winstonLogger.format = winston.format.combine(addHeader(), defaultFormat);

  return winstonLogger;
};

export const NextLogger = (req: any, res: any) => {
  const { headers } = req;

  if (!req.logger) req.logger = (module: string) => logger(headers, module);
};

export default (req: any, res: any, next: any) => {
  const { headers } = req;

  if (!req.logger) req.logger = (module: string) => logger(headers, module);

  return next();
};
