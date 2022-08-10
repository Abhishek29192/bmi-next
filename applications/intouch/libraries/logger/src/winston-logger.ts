import winston from "winston";
import { LoggingWinston as gcpLogger } from "@google-cloud/logging-winston";
import maskDeep from "mask-deep";

const isProd = process.env.NODE_ENV === "production";

const loggerContainer: Record<string, winston.Logger> = {};

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

const getLogger = (headers: { [key: string]: string }, _module: string) => {
  if (!loggerContainer[`${_module}`]) {
    loggerContainer[`${_module}`] = winston.createLogger({
      handleExceptions: true,
      level: getLogLevel(),
      transports: [
        isProd ? loggingWinston : new winston.transports.Console({})
      ],
      format: defaultFormat,
      exceptionHandlers: [
        isProd ? loggingWinston : new winston.transports.Console({})
      ]
    });
  }

  return loggerContainer[`${_module}`].child({
    requestId: headers["x-request-id"] || "",
    accountId: headers["x-authenticated-user-id"] || "",
    module: _module
  });
};

export default (req: any, res: any, next: any) => {
  const { headers } = req;

  req.logger = (module: string) => getLogger(headers, module);

  return next();
};

export const NextLogger = (req: any, res: any) => {
  const { headers } = req;

  req.logger = (module: string) => getLogger(headers, module);
};