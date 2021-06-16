declare module Express {
  export interface Request {
    pubSub: any;
    user: import("./../user");
    logger: (modue: string) => import("winston").Logger;
  }
}
