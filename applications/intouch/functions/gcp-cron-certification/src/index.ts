import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import DoceboClient from "./DoceboClient";
import { insertCertification } from "./PostgreSqlClient";

export const updateCertificates = async (
  req: Request<any, any>,
  res: Response
) => {
  try {
    const doceboClient = new DoceboClient();
    const certifications = await doceboClient.getCertificationsReport();
    if (certifications.length) {
      const response = await insertCertification(certifications);

      if (response) {
        logger.info({ message: response });
      } else {
        logger.error({ message: `failed to insert certificates into DB` });
      }
    }
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};
