import logger from "@bmi-digital/functions-logger";
import fetch from "node-fetch";

const verifyRecaptchaToken = async (
  token: string,
  recaptchaSecret: string,
  minimumScore: number
) => {
  logger.info({ message: "Starting Recaptcha check" });
  let recaptchaResponse;
  try {
    recaptchaResponse = await fetch(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`,
      { method: "POST" }
    );
  } catch (error) {
    logger.error({
      message: `Recaptcha request failed with error ${error}.`
    });
    throw new Error("Recaptcha request failed.");
  }
  if (!recaptchaResponse.ok) {
    logger.error({
      message: `Recaptcha check failed with status ${recaptchaResponse.status} ${recaptchaResponse.statusText}.`
    });
    throw new Error("Recaptcha check failed.");
  }
  const json = await recaptchaResponse.json();
  if (!json.success || json.score < minimumScore) {
    logger.error({
      message: `Recaptcha check failed with error ${JSON.stringify(json)}.`
    });
    throw new Error("Recaptcha check failed.");
  }
  logger.info({ message: "Recaptcha check successful" });
};

export default verifyRecaptchaToken;
