import { logger } from "@bmi/logger";
import validator from "validator";

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};

export default async (req, res) => {
  if (req.method === "OPTIONS") {
    return;
  }

  const { severity, message } = JSON.parse(req.body);

  const event = {
    severity: validator.escape(severity),
    message: validator.escape(message)
  };

  try {
    await logger(event);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error", error);
  }

  return res.send(event);
};
