import { logger } from "@bmi/logger";

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
    severity,
    message
  };

  try {
    await logger(event);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error", error);
  }

  return res.send(event);
};
