import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import DoceboClient from "./DoceboClient";
import GatewayClient from "./GatewayClient";
import { GetDoceboUsers } from "./__tests__/helper";

export const updateCertificates = async (
  req: Request<any, any>,
  res: Response
) => {
  try {
    const doceboClient = new DoceboClient();
    const clientGateway = await GatewayClient.create();
    const certifications = await doceboClient.getCertificationsReport();
    const doceboUser = await clientGateway.getDoceboUsers();
    if (doceboUser.ok) {
      const {
        data: {
          accounts: { nodes }
        }
      }: { data: GetDoceboUsers } = await doceboUser.json();
      const accountDoceboUserIds = nodes.map(({ doceboUserId }) =>
        doceboUserId.toString()
      );
      const certToInsert = certifications.filter(({ userId }) =>
        accountDoceboUserIds.includes(userId)
      );
      if (certToInsert.length) {
        logger.info({
          message: `${certToInsert.length} certificates matches existing users account`
        });
        const response = await clientGateway.insertCertification(certToInsert);

        if (response.ok) {
          const {
            data: { truncateAndInsertCertification: message }
          } = await response.json();

          logger.info({ message });
        } else {
          logger.error({
            message: `fails to truncate and insert certificates into DB, error: ${response.status} ${response.statusText}`
          });
        }
      } else {
        logger.info({ message: `No certificate to be inserted` });
      }
    } else {
      logger.error({
        message: `fails to fetch doceboId from account table`
      });
    }
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};
