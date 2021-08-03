const sgMail = require("@sendgrid/mail");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

export async function emailSender(event, context) {
  let parsedPayload;
  const replyTo = "no-reply@intouch.bmigroup.com";

  const { GCP_SECRET_PROJECT } = process.env;

  const client = new SecretManagerServiceClient();
  const [value] = await client.accessSecretVersion({
    name: `projects/${GCP_SECRET_PROJECT}/secrets/SENDGRID_API_KEY/versions/latest`
  });

  // eslint-disable-next-line no-undef
  const payload = Buffer.from(event.data, "base64").toString();

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error: ", error);
  }

  sgMail.setApiKey(value.payload.data.toString());
  try {
    await sgMail.send({
      replyTo,
      from: parsedPayload.sendMailbox || process.env.MAIL_FROM,
      to: parsedPayload.email,
      subject: parsedPayload.title,
      text: parsedPayload.text,
      html: parsedPayload.html
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error sending email:", error);
  }
}
