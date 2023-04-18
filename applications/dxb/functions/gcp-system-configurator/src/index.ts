import logger from "@bmi-digital/functions-logger";
import { verifyRecaptchaToken } from "@bmi/functions-recaptcha";
import fetch from "node-fetch";
import { Answer, NextStep, Response, TransformedAnswer } from "./types";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

const {
  CONTENTFUL_DELIVERY_TOKEN,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  PREVIEW_API,
  RECAPTCHA_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

export const recaptchaTokenHeader = "X-Recaptcha-Token";
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1.0");

const transformAnswer = (
  answer: Omit<Answer, "nextStep">
): TransformedAnswer => {
  const { sys, title, description } = answer;

  const data = {
    contentful_id: sys.id,
    id: sys.id,
    title
  };

  return {
    ...data,
    __typename: `ContentfulSystemConfiguratorAnswer`,
    description: description && {
      raw: JSON.stringify(description.json),
      references: description.links.assets.block.map((blockAsset) => ({
        __typename: "ContentfulAsset",
        contentful_id: blockAsset.sys.id,
        id: blockAsset.sys.id,
        title: blockAsset.title,
        file: {
          url: blockAsset.url!,
          contentType: blockAsset.contentType!
        }
      }))
    }
  };
};

const transformNextStepData = (nextStepData: NextStep): Response => {
  const { sys, title } = nextStepData;

  const data = {
    contentful_id: sys.id,
    id: sys.id,
    title
  };

  if (nextStepData.__typename === "SystemConfiguratorQuestion") {
    const { answersCollection, description } = nextStepData;

    return {
      ...data,
      __typename: `ContentfulSystemConfiguratorQuestion`,
      description: description && {
        raw: JSON.stringify(description.json),
        references: description.links.assets.block.map((blockAsset) => ({
          __typename: "ContentfulAsset",
          contentful_id: blockAsset.sys.id,
          id: blockAsset.sys.id,
          title: blockAsset.title,
          file: {
            url: blockAsset.url!,
            contentType: blockAsset.contentType!
          }
        }))
      },
      answers: answersCollection.items.map((answer) => transformAnswer(answer))
    };
  }

  if (nextStepData.__typename === "SystemConfiguratorResult") {
    const { recommendedSystems, description } = nextStepData;
    return {
      ...data,
      __typename: `ContentfulSystemConfiguratorResult`,
      description: description && {
        raw: JSON.stringify(description.json),
        references: description.links.assets.block.map((blockAsset) => ({
          __typename: "ContentfulAsset",
          contentful_id: blockAsset.sys.id,
          id: blockAsset.sys.id,
          title: blockAsset.title,
          file: {
            url: blockAsset.url!,
            contentType: blockAsset.contentType!
          }
        }))
      },
      recommendedSystems: recommendedSystems
    };
  }

  return {
    __typename: `ContentfulTitleWithContent`,
    ...data,
    content: { raw: JSON.stringify(nextStepData.content.json) }
  };
};

const runQuery = async (
  query: string,
  variables: { [key: string]: unknown }
): Promise<Answer> => {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONTENTFUL_DELIVERY_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    }
  );

  const json = await response.json();
  if (json.errors) {
    throw Error(json.errors[0].message);
  }

  return json.data.systemConfiguratorAnswer;
};

const generateError = (message: string) => {
  const error = Error(message);
  logger.error({ message: (error as Error).message });

  return error;
};

const PAGE_SIZE = 9;

export const query = (page: number) => `
query NextStep($answerId: String!, $locale: String!, $preview: Boolean) {
  systemConfiguratorAnswer(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...on SystemConfiguratorQuestion {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorQuestionDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        answersCollection(limit: ${PAGE_SIZE}, skip: ${page * PAGE_SIZE}) {
          total
          items {
            ...on SystemConfiguratorAnswer {
              __typename
              sys {
                id
              }
              title
              description {
                ...on SystemConfiguratorAnswerDescription {
                  json
                  links {
                    assets {
                      block {
                        ...on Asset {
                          __typename
                          sys {
                            id
                          }
                          title
                          url
                          contentType
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ...on SystemConfiguratorResult {
        sys {
          id
        }
        title
        description {
          ...on SystemConfiguratorResultDescription {
            json
            links {
              assets {
                block {
                  ...on Asset {
                    __typename
                    sys {
                      id
                    }
                    title
                    url
                    contentType
                  }
                }
              }
            }
          }
        }
        recommendedSystems
      }
      ...on TitleWithContent {
        sys {
          id
        }
        title
        content {
          json
        }
      }
    }
  }
}
`;

export const nextStep: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_DELIVERY_TOKEN) {
    logger.error({
      message: "CONTENTFUL_DELIVERY_TOKEN has not been set"
    });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "CONTENTFUL_ENVIRONMENT has not been set" });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_SPACE_ID) {
    logger.error({ message: "CONTENTFUL_SPACE_ID has not been set" });
    return response.sendStatus(500);
  }

  if (!RECAPTCHA_KEY) {
    logger.error({ message: "RECAPTCHA_KEY has not been set" });
    return response.sendStatus(500);
  }

  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-Headers", [
      "Authorization",
      "Content-Type",
      recaptchaTokenHeader
    ]);
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  }

  if (request.method !== "GET") {
    return response.status(400).send(generateError(`Method is forbidden.`));
  }
  const authorizationToken = request.headers.authorization;
  const qaAuthToken = process.env.QA_AUTH_TOKEN;
  if (
    authorizationToken &&
    authorizationToken.substring("Bearer ".length) !== qaAuthToken
  ) {
    logger.error({ message: "QaAuthToken failed." });
    return response.status(400).send(generateError("QaAuthToken failed."));
  }

  const recaptchaToken =
    // eslint-disable-next-line security/detect-object-injection
    request.headers[recaptchaTokenHeader] ||
    request.headers[recaptchaTokenHeader.toLowerCase()];

  if (
    (!authorizationToken && !recaptchaToken) ||
    Array.isArray(recaptchaToken)
  ) {
    return response
      .status(400)
      .send(generateError("Recaptcha token not provided."));
  }

  if (!authorizationToken && recaptchaToken) {
    try {
      await verifyRecaptchaToken(recaptchaToken, RECAPTCHA_KEY, minimumScore);
    } catch (error) {
      logger.error({
        message: `Recaptcha check failed with error ${error}.`
      });
      return response.status(400).send(Error("Recaptcha check failed."));
    }
  }
  const { answerId, locale } = request.query;

  if (!answerId || !locale) {
    return response
      .status(400)
      .send(
        generateError(
          `Query parameter 'answerId' and/or 'locale' not provided.`
        )
      );
  }

  let data: Answer;
  const answers = [];
  let page = 0;

  do {
    try {
      data = await runQuery(query(page), {
        answerId,
        locale,
        preview: PREVIEW_API === "true"
      });
    } catch (error) {
      logger.error({ message: (error as Error).message });
      return response.status(500).send(error);
    }

    if (!data) {
      return response
        .status(404)
        .send(
          generateError(`System Configurator entry ${answerId} not found.`)
        );
    }

    if (!(data.nextStep && "answersCollection" in data.nextStep)) {
      break;
    }

    answers.push(...data.nextStep.answersCollection.items);
    data.nextStep.answersCollection.items = answers;

    page++;
  } while (
    data.nextStep.answersCollection.items.length <
    data.nextStep.answersCollection.total
  );

  const { nextStep } = data;

  if (!nextStep) {
    return response
      .status(404)
      .send(
        generateError(
          `System Configurator next step not found for entry ${answerId}.`
        )
      );
  }

  return response.status(200).send(transformNextStepData(nextStep));
};
