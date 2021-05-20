declare module Express {
  export interface Request {
    docebo: any;
    user: import("./../user");
    logger: import("@bmi/logger");
  }
}
