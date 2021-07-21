const sgMail = require("@sendgrid/mail");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export async function emailSender(event, context) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  let parsedPayload;

  // eslint-disable-next-line no-undef
  const payload = Buffer.from(event.data, "base64").toString();

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error: ", error);
  }

  await sgMail.send({
    from: process.env.MAIL_FROM,
    to: parsedPayload.email,
    subject: parsedPayload.title,
    text: parsedPayload.text,
    html: parsedPayload.html
  });
}
