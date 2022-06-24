import { writeFileSync, mkdir } from "fs";
import { dirname } from "path";
import { MailService } from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { Guarantee } from "@bmi/intouch-api-types";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import logger from "@bmi-digital/functions-logger";
import { mockSolutionGuarantee } from "../mocks/guarantee";
import { replaceData } from "./util/mail";
import GuaranteePdfGenerator from "./GuaranteePdf";
import StorageClient from "./storage-client";
import GatewayClient from "./GatewayClient";

export const sendGuaranteePdf = async (postEvent: any) => {
  const { GCP_SECRET_PROJECT, MAIL_FROM, GCP_PRIVATE_BUCKET_NAME, NODE_ENV } =
    process.env;
  const isLocal = NODE_ENV === "local";
  const getSendGridClient = async () => {
    const secretManagerClient = new SecretManagerServiceClient();
    const [value] = await secretManagerClient.accessSecretVersion({
      name: `projects/${GCP_SECRET_PROJECT}/secrets/SENDGRID_API_KEY/versions/latest`
    });
    const sendGridClient = new MailService();
    sendGridClient.setApiKey(value.payload.data.toString());
    return sendGridClient;
  };
  try {
    const payload: Guarantee = isLocal
      ? mockSolutionGuarantee
      : JSON.parse(Buffer.from(postEvent.data, "base64").toString());

    logger.info({
      message: `successfully fetched guarantee with ID: ${payload.id}`
    });

    const {
      id,
      project,
      guaranteeType,
      productByProductBmiRef,
      systemBySystemBmiRef
    } = payload;

    const template = guaranteeType.guaranteeTemplatesCollection.items[0];
    const product = productByProductBmiRef?.name;
    const system = systemBySystemBmiRef?.name;

    const gatewayClient = await GatewayClient.create();
    const storageClient = new StorageClient();
    const guaranteePdf = new GuaranteePdfGenerator(payload);

    const file = await guaranteePdf.create();
    if (isLocal) {
      const path = "./pdf/blank.pdf";
      mkdir(dirname(path), function (err) {
        if (err && err.code !== "EEXIST") return logger.error(err);
        writeFileSync(path, file.data, { flag: "w" });
      });
    }

    // Write file to google cloud
    const fileName = `guarantee/${id}/${file.name}`;
    await storageClient.uploadFile(
      GCP_PRIVATE_BUCKET_NAME,
      fileName,
      file.data
    );

    // Update guarantee
    const response = await gatewayClient.updateGuaranteeFileStorage(
      id,
      fileName
    );
    if (response.ok) {
      const attachment: AttachmentData = {
        content: Buffer.from(file.data).toString("base64"),
        filename: file.name,
        type: "application/pdf",
        disposition: "attachment"
      };

      const sendgridClient = await getSendGridClient();
      const replyTo = "no-reply@intouch.bmigroup.com";
      await sendgridClient.send({
        replyTo,
        to: project.buildingOwnerMail,
        from: MAIL_FROM,
        subject: template.mailSubject,
        text: replaceData(template.mailBody, {
          product,
          system
        }),
        attachments: [attachment]
      });
    } else {
      logger.error({ message: `${response.status} ${response.statusText}` });
    }
  } catch (error) {
    logger.error(error as any);
  }
};
