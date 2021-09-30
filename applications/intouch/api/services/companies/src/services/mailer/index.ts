import { MessageTemplate } from "@bmi/intouch-api-types";
import { publish, TOPICS } from "../events";
import { messageTemplate, EventMessage } from "../contentful";
import { PostGraphileContext } from "../../types";

const replaceData = (template, data) => {
  if (!template) return template;
  const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
  return template.replace(pattern, (_, token) => data[`${token}`] || "");
};

export const sendMessageWithTemplate = async (
  context: PostGraphileContext,
  event: EventMessage,
  body: any
) => {
  const logger = context.logger("mailer");
  const { data } = await messageTemplate(context.clientGateway, event);
  const {
    messageTemplateCollection
  }: {
    messageTemplateCollection: {
      items: [MessageTemplate];
    };
  } = data;

  if (messageTemplateCollection?.items?.length) {
    const [template] = messageTemplateCollection.items;

    for (const format of template.format || []) {
      if (format === "NOTIFICATION") {
        await addNotification(context, template, body);
      } else if (format === "EMAIL") {
        try {
          await sendMail(context, template, body);

          logger.info(`Email sent with templates`, {
            event
          });
        } catch (console) {
          logger.info(`Error sending email with template:`, {
            event
          });
        }
      }
    }
  } else {
    logger.error("Email template not found");
  }
};

const addNotification = async (
  context: PostGraphileContext,
  template: MessageTemplate,
  body: any
) => {
  if (body.accountId) {
    const notificationBody = replaceData(template.notificationBody, body);
    // Creating a new notification record
    await context.pgClient.query(
      "INSERT INTO notification(account_id,send_date,body) VALUES ($1,$2,$3) RETURNING *",
      [body.accountId, new Date(), notificationBody]
    );
  }
};

const sendMail = async (
  context: PostGraphileContext,
  template: MessageTemplate,
  body: any
) => {
  const logger = context.logger("sendMail");

  // If I'm sending an email I need to send it based on the market
  // if a sendMailbox is sent we use that email, otherwise we use the default email
  // for the particular market

  if (!body.sendMailbox) {
    body.sendMailbox = context.user.market.sendMailbox;
  }

  await publish(context, TOPICS.TRANSACTIONAL_EMAIL, {
    title: replaceData(template.subject, body),
    text: replaceData(template.emailBody, body),
    html: replaceData(template.emailBody, body)?.replace(
      /(?:\r\n|\r|\n)/g,
      "<br>"
    ),
    email: body.email
  });
};
