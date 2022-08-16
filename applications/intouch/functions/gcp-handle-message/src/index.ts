import sgMail from "@sendgrid/mail";

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

export async function emailSender(event, context) {
  let parsedPayload;
  const replyTo = "no-reply@intouch.bmigroup.com";

  const { SENDGRID_API_KEY } = process.env;

  // eslint-disable-next-line no-undef
  const payload = Buffer.from(event.data, "base64").toString();

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error: ", error);
  }

  sgMail.setApiKey(SENDGRID_API_KEY);
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
