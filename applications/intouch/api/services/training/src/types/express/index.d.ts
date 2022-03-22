declare namespace Express {
  export interface Request {
    docebo: any;
    user: import("./../user");
    logger: import("@bmi-digital/logger");
  }
}
