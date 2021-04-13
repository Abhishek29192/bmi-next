declare module Express {
  export interface Request {
    pubSub: any;
    user: {
      id: string;
      role: RolesKey;
    };
  }
}
