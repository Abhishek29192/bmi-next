import { MailService } from "@sendgrid/mail";
import { AttachmentData } from "@sendgrid/helpers/classes/attachment";
import { Guarantee } from "@bmi/intouch-api-types";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
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
    const gatewayClient = await GatewayClient.create();
    const storageClient = new StorageClient();
    const guaranteePdf = new GuaranteePdfGenerator(payload);

    const file = await guaranteePdf.create();

    //Write file to google cloud
    const fileName = `guarantee/${payload.id}/${file.name}`;
    await storageClient.uploadFile(
      GCP_PRIVATE_BUCKET_NAME,
      fileName,
      file.data
    );

    //Update guarantee
    //TODO: We can't update guarantee Because we don't have token etc.
    await gatewayClient.updateGuaranteeFileStorage(payload.id, fileName);

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
      to: payload.project.buildingOwnerMail,
      from: MAIL_FROM,
      subject: "Guarantee PDF",
      text: "Guarantee PDF",
      attachments: [attachment]
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error pdf create:", error);
  }
};
