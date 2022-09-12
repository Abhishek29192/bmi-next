import { DoubleAcceptance } from "@bmi/intouch-api-types";

export const mockDoubleAcceptance = (): DoubleAcceptance => ({
  acceptance: true,
  acceptanceDate: null,
  expiryDate: "2022-10-12 09:38:09.577",
  guaranteeId: 1,
  id: 1,
  signature: null,
  tempToken: "21d5ec34928e8b66b5dfaf0010a85bc",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  nodeId: "WyJndWFyYW50ZWVzIiwxXQ=="
});
