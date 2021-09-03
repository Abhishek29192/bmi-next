import { publish, TOPICS } from "../events";
import { messageTemplate, EventMessage } from "../contentful";
import { PostGraphileContext } from "../../types";

const replaceData = (template, data) => {
  if (!template) return template;
  const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
  return template.replace(pattern, (_, token) => data[`${token}`] || "");
};

export const sendEmailWithTemplate = async (
  context: PostGraphileContext,
  event: EventMessage,
  body: any
) => {
  const { data } = await messageTemplate(context.clientGateway, event);
  const { messageTemplateCollection } = data;

  if (!messageTemplateCollection.items.length) {
    throw new Error("template_not_found");
  }

  const [template] = messageTemplateCollection.items;

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
