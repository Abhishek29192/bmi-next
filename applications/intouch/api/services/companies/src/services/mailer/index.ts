import { MessageTemplate } from "@bmi/intouch-api-types";
import { PostGraphileContext } from "../../types";
import { parseMarketCompanyTag } from "../../utils/contentful";
import { EventMessage, messageTemplate } from "../contentful";
import { publish, TOPICS } from "../events";
import { getDbPool } from "../../db";

export const replaceData = (template, data) => {
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

  const { user } = context;

  const marketDomain = user.market?.domain;
  const contentfulTag = parseMarketCompanyTag(marketDomain);

  try {
    const { data } = await messageTemplate(
      context.clientGateway,
      event,
      contentfulTag
    );
    const {
      messageTemplateCollection
    }: {
      messageTemplateCollection: {
        items: [MessageTemplate];
      };
    } = data;

    if (messageTemplateCollection.items?.length) {
      const [template] = messageTemplateCollection.items;
      const projectName = body.project;
      for (const format of template.format || []) {
        if (format === "NOTIFICATION") {
          if (body.projectId) {
            body.project = `[${body.project}](/projects/${body.projectId})`;
          }
          await addNotification(context, template, body);
        } else if (format === "EMAIL") {
          body.project = projectName;
          await sendMail(context, template, body);
        }
      }
    } else {
      logger.error(`Template not found for event ${event}`);
    }
  } catch (error) {
    logger.error(
      `[error] Error sending an email or a notification: for event ${event}`,
      error
    );
  }
};

export const getTemplateReceipient = async (
  context: PostGraphileContext,
  event: EventMessage
) => {
  const logger = context.logger("mailer");
  const { user } = context;
  const marketDomain = user.market?.domain;
  const contentfulTag = parseMarketCompanyTag(marketDomain);

  try {
    const { data } = await messageTemplate(
      context.clientGateway,
      event,
      contentfulTag
    );
    const {
      messageTemplateCollection
    }: {
      messageTemplateCollection: {
        items: [MessageTemplate];
      };
    } = data;

    if (messageTemplateCollection.items?.length) {
      const [template] = messageTemplateCollection.items;
      return template.emailRecipient;
    } else {
      logger.error(`Template not found for event ${event}`);
    }
    return null;
  } catch (error) {
    logger.error(`Error getting an email Recipient for event ${event}`, error);
  }
};

export const getMarketAdminsEmail = async (
  context: PostGraphileContext,
  event: EventMessage
) => {
  const { user } = context;
  const dbPool = getDbPool();
  const emailRecipient = await (await getTemplateReceipient(context, event))
    ?.split(",")
    .map((email) => email.trim());
  const { rows: marketAdmins } = emailRecipient
    ? await dbPool.query(
        `SELECT * FROM account WHERE email in (${emailRecipient.map(
          (_, id) => `$${id + 2}`
        )}) and role = $1`,
        ["MARKET_ADMIN", ...emailRecipient]
      )
    : await dbPool.query(
        `SELECT account.* FROM account JOIN market ON market.id = account.market_id WHERE account.role = $1 AND account.market_id = $2`,
        ["MARKET_ADMIN", user.marketId]
      );

  return marketAdmins;
};

export const sendMailToMarketAdmins = async (
  context: PostGraphileContext,
  event: EventMessage,
  dynamicContent: Record<string, any>
) => {
  const marketAdmins = await getMarketAdminsEmail(context, event);

  return Promise.all([
    ...marketAdmins.map(({ email, id: accountId, first_name: firstname }) => {
      sendMessageWithTemplate(context, event, {
        email,
        accountId,
        firstname,
        ...dynamicContent
      });
    })
  ]);
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
