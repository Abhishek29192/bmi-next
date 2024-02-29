import type { Request } from "express";
import type { BatchEvents } from "./types";

export const isMultipleEventsPayload = (
  reqBody: Request["body"]
): reqBody is BatchEvents => {
  return "payloads" in reqBody;
};

export const getUnique = <T>(arr: T[]): T[] => [...new Set(arr)];
