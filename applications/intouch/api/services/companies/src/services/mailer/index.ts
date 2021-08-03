import { publish, TOPICS } from "../events";
import { messageTemplate, EventMessage } from "../contentful";
import { PostGraphileContext } from "../../types";

type ChangeRoleEmailProps = {
  market?: string;
  email: string;
  firstname: string;
  role: string;
};

const replaceData = (template, data) => {
  if (!template) return template;
  const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
  return template.replace(pattern, (_, token) => data[`${token}`] || "");
};

export const sendEmailWithTemplate = async (
  context: PostGraphileContext,
  event: EventMessage,
  body: ChangeRoleEmailProps
) => {
  const { data } = await messageTemplate(event);
  const { messageTemplateCollection } = data;

  if (!messageTemplateCollection.items.length) {
    throw new Error("template_not_found");
  }

  const [template] = messageTemplateCollection.items;

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
