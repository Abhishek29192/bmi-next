import { MailService } from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { Guarantee } from "@bmi/intouch-api-types";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { replaceData } from "./util/mail";
import GuaranteePdfGenerator from "./GuaranteePdf";
import StorageClient from "./storage-client";
import GatewayClient from "./GatewayClient";

const { GCP_SECRET_PROJECT, MAIL_FROM, GCP_PRIVATE_BUCKET_NAME } = process.env;

const getSendGridClient = async () => {
  const secretManagerClient = new SecretManagerServiceClient();
  const [value] = await secretManagerClient.accessSecretVersion({
    name: `projects/${GCP_SECRET_PROJECT}/secrets/SENDGRID_API_KEY/versions/latest`
  });
  const sendGridClient = new MailService();
  sendGridClient.setApiKey(value.payload.data.toString());
  return sendGridClient;
};
export const sendGuaranteePdf = async (postEvent: any) => {
  try {
    const payload: Guarantee = JSON.parse(
      Buffer.from(postEvent.data, "base64").toString()
    );

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

    //Write file to google cloud
    const fileName = `guarantee/${id}/${file.name}`;
    await storageClient.uploadFile(
      GCP_PRIVATE_BUCKET_NAME,
      fileName,
      file.data
    );

    //Update guarantee
    await gatewayClient.updateGuaranteeFileStorage(id, fileName);

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
      subject: `${template.titleLine1} ${template.titleLine2}`,
      text: replaceData(template.mailBody, {
        product,
        system
      }),
      attachments: [attachment]
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error pdf create:", error);
  }
};
