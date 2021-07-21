import { PubSub } from "@google-cloud/pubsub";
import { publish, TOPICS } from "../events";
import { messageTemplate } from "../contentful";

type ChangeRoleEmailProps = {
  email: string;
  firstname: string;
  role: string;
};

const replaceData = (template, data) => {
  if (!template) return template;
  const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
  return template.replace(pattern, (_, token) => data[`${token}`] || "");
};

export const tempalteFactory = async (id: string, body: any) => {
  const { data } = await messageTemplate(id);

  return {
    subject: replaceData(data.messageTemplate.subject, body),
    emailBody: replaceData(data.messageTemplate.emailBody, body),
    htmlEmailBody: replaceData(data.messageTemplate.emailBody, body)?.replace(
      /(?:\r\n|\r|\n)/g,
      "<br>"
    )
  };
};

export const sendChangeRoleEmail = async (
  pubSub: PubSub,
  body: ChangeRoleEmailProps
) => {
  const template = await tempalteFactory("6AOfsimVd1dyPzpceKCA7V", body);

  await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, {
    title: template.subject,
    text: template.emailBody,
    html: template.htmlEmailBody,
    email: body.email
  });
};
