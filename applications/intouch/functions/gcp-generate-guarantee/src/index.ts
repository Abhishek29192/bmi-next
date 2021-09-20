import { MailService } from "@sendgrid/mail";
import { Guarantee } from "@bmi-digital/intouch-api-types";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import GuaranteePdfGenerator from "./GuaranteePdf";

const { GCP_SECRET_PROJECT, MAIL_FROM } = process.env;

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
  const payload: Guarantee = JSON.parse(
    Buffer.from(postEvent.data, "base64").toString()
  );

  const guaranteePdf = new GuaranteePdfGenerator(payload);
  const pdfs = await guaranteePdf.create();

  const attachments = await Promise.all(
    pdfs.map(async (pdf) => {
      const file = await pdf;
      const b64 = Buffer.from(file.data).toString("base64");
      return {
        content: b64,
        filename: file.name,
        type: "application/pdf",
        disposition: "attachment"
      };
    })
  );

  const sendgridClient = await getSendGridClient();

  const replyTo = "no-reply@intouch.bmigroup.com";
  await sendgridClient.send({
    replyTo,
    to: payload.project.buildingOwnerMail,
    from: MAIL_FROM,
    subject: "Guarantee PDF",
    text: "Guarantee PDF",
    attachments
  });
};
