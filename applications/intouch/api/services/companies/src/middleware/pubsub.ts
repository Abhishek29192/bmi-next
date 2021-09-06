import { NextFunction, Request, Response } from "express";
import { PubSub } from "@google-cloud/pubsub";

const pubSub = new PubSub({
  projectId: process.env.GCP_PROJECT
});

export default (req: Request, res: Response, next: NextFunction) => {
  req.pubSub = pubSub;
  return next();
};
