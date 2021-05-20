import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const isProd = process.env.NODE_ENV === "production";

const loggingWinston = new LoggingWinston();

const getLogLevel = () => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }

  return process.env.NODE_ENV === "production" ? "error" : "debug";
};

export default (req: any, res: any, next: any) => {
  const { headers } = req;

  req.logger = (module: string) => {
    const { combine, timestamp, label, printf } = winston.format;
    const transports: winston.transport[] = [
      new winston.transports.Console({})
    ];
    if (isProd) {
      transports.push(loggingWinston);
    }
    return winston.createLogger({
      handleExceptions: true,
      level: getLogLevel(),
      format: combine(
        label({ label: module }),
        winston.format.colorize(),
        timestamp(),
        printf(
          (info) =>
            `${[info.timestamp]} ${info.level} [${info.label}]: ${
              headers["x-request-id"]
            }: ${info.message}`
        )
      ),
      transports,
      exceptionHandlers: [new winston.transports.Console({})]
    });
  };

  return next();
};
