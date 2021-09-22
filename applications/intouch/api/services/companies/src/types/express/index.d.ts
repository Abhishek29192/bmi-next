declare module Express {
  export interface Request {
    pubSub: any;
    clientGateway: any;
    user: import("./../index").Account;
    trustedConnection: boolean;
    logger: (modue: string) => import("winston").Logger;
  }
}
