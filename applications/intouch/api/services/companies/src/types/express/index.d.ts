declare module Express {
  export interface Request {
    pubSub: any;
    user: import("./../index").Account;
    logger: (modue: string) => import("winston").Logger;
  }
}
