import { MailService } from "@sendgrid/mail";
import { Guarantee } from "@bmi-digital/intouch-shared-types";
import GuaranteePdf from "./src/GuaranteePdf";

const { SENDGRID_API_KEY, SENDGRID_FROM_MAIL } = process.env;

const getSendGridClient = async () => {
  const sendGridClient = new MailService();
  sendGridClient.setApiKey(SENDGRID_API_KEY);
  return sendGridClient;
};
export const sendGuaranteePdf = async (postEvent: any, context: any) => {
  const payload: Guarantee = JSON.parse(
    Buffer.from(postEvent.data, "base64").toString()
  );

  const guaranteePdf = new GuaranteePdf(payload);
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
  await sendgridClient.send({
    to: payload.project.buildingOwnerMail,
    from: SENDGRID_FROM_MAIL,
    subject: "Guarantee PDF",
    text: "Guarantee PDF",
    attachments
  });
};
