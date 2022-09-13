import { mkdir, writeFileSync } from "fs";
import { dirname } from "path";
import logger from "@bmi-digital/functions-logger";
import { Guarantee, MessageTemplateCollection } from "@bmi/intouch-api-types";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { MailService } from "@sendgrid/mail";
import { mockSolutionGuarantee } from "../mocks/guarantee";
import GatewayClient from "./GatewayClient";
import GuaranteePdfGenerator from "./GuaranteePdf";
import StorageClient from "./storage-client";
import { replaceData } from "./util/mail";

export const sendGuaranteePdf = async (postEvent: any) => {
  const { MAIL_FROM, GCP_PRIVATE_BUCKET_NAME, NODE_ENV, SENDGRID_API_KEY } =
    process.env;
  const isLocal = NODE_ENV === "local";
  const getSendGridClient = async () => {
    const sendGridClient = new MailService();
    sendGridClient.setApiKey(SENDGRID_API_KEY);
    return sendGridClient;
  };
  try {
    const payload: Guarantee & {
      messageTemplateCollection: MessageTemplateCollection;
    } = isLocal
      ? mockSolutionGuarantee
      : JSON.parse(Buffer.from(postEvent.data, "base64").toString());

    logger.info({
      message: `successfully fetched guarantee with ID: ${payload.id}`
    });

    const {
      id,
      project,
      status,
      guaranteeType,
      productByProductBmiRef,
      systemBySystemBmiRef,
      fileStorageId,
      signedFileStorageUrl
    } = payload;

    const isSolutionGuarantee = guaranteeType.coverage === "SOLUTION";
    const template = guaranteeType.guaranteeTemplatesCollection.items[0];
    const product = productByProductBmiRef?.name;
    const system = systemBySystemBmiRef?.name;
    const emailDetails = {
      to: project.buildingOwnerMail,
      from: MAIL_FROM,
      replyTo: "no-reply@intouch.bmigroup.com",
      subject: template.mailSubject,
      text: replaceData(template.mailBody, {
        product,
        system
      })
    };
    const gatewayClient = await GatewayClient.create(
      project.company.market.domain
    );
    const storageClient = new StorageClient();
    const guaranteePdf = new GuaranteePdfGenerator(payload);
    const sendgridClient = await getSendGridClient();

    if (isSolutionGuarantee && !!signedFileStorageUrl && !!fileStorageId) {
      if (status !== "DECLINED") {
        const fileData = await guaranteePdf.getPdfFromUrl(signedFileStorageUrl);
        const file = await guaranteePdf.mergePdf(fileData);
        const attachment: AttachmentData = {
          content: Buffer.from(file).toString("base64"),
          filename: fileStorageId.replace(`guarantee/${id}/`, ""),
          type: "application/pdf",
          disposition: "attachment"
        };
        await sendgridClient.send({
          ...emailDetails,
          attachments: [attachment]
        });
      }
    } else {
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
        if (isSolutionGuarantee) {
          const doubleAcceptanceResponse =
            await gatewayClient.createDoubleAcceptance(id);
          if (doubleAcceptanceResponse.ok) {
            const {
              data: {
                createDoubleAcceptance: { doubleAcceptance }
              }
            } = await doubleAcceptanceResponse.json();

            logger.info({
              message: `successfully created double acceptance with ID: ${doubleAcceptance.id}`
            });
          } else {
            logger.error({
              message: `failed to creat double acceptance for guarantee with ID: ${id}`
            });
          }
        } else {
          const attachment: AttachmentData = {
            content: Buffer.from(file.data).toString("base64"),
            filename: file.name,
            type: "application/pdf",
            disposition: "attachment"
          };

          await sendgridClient.send({
            ...emailDetails,
            attachments: [attachment]
          });
          await gatewayClient.updateGuaranteeStatus(id);
        }
      } else {
        logger.error({ message: `${response.status} ${response.statusText}` });
      }
    }
  } catch (error) {
    logger.error(error as any);
  }
};
