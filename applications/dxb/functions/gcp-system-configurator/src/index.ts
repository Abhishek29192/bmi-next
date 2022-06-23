import logger from "@bmi-digital/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import QueryString from "qs";
import { Answer, NextStep, Response, Type } from "./types";

const {
  CONTENTFUL_DELIVERY_TOKEN,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  PREVIEW_API,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

export const recaptchaTokenHeader = "X-Recaptcha-Token";
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1.0");

const nextStepMap: Record<Type, "answersCollection" | "recommendedSystems"> = {
  Question: "answersCollection",
  Result: "recommendedSystems"
};

const transformNextStepData = (nextStepData: NextStep): Response => {
  const { sys, title } = nextStepData;

  const data = {
    contentful_id: sys.id,
    id: sys.id,
    type: null,
    title,
    answers: null,
    recommendedSystems: null,
    content: null
  };

  if (nextStepData.__typename === "SystemConfiguratorBlock") {
    const { type, answersCollection, recommendedSystems, description } =
      nextStepData;

    return {
      ...data,
      __typename: `ContentfulSystemConfiguratorBlock`,
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
      type,
      answers:
        (answersCollection &&
          answersCollection.items.map((answer) =>
            transformNextStepData(answer)
          )) ||
        null,
      recommendedSystems: recommendedSystems || null
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
  variables: QueryString.ParsedQs
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

  return json.data.systemConfiguratorBlock;
};

const generateError = (message: string) => {
  const error = Error(message);
  logger.error({ message: (error as Error).message });

  return error;
};

const PAGE_SIZE = 9;

export const query = (page: number) => `
query NextStep($answerId: String!, $locale: String!, preview: Boolean) {
  systemConfiguratorBlock(id: $answerId, locale: $locale, preview: $preview) {
    nextStep {
      __typename
      ...EntryFragment
      ...QuestionFragment
      ...ResultFragment
      ...TitleWithContentFragment
    }
  }
}

fragment QuestionFragment on SystemConfiguratorBlock {
  answersCollection(limit: ${PAGE_SIZE}, skip: ${page * PAGE_SIZE}) {
    total
    items {
      ...EntryFragment
    }
  }
}

fragment ResultFragment on SystemConfiguratorBlock {
  recommendedSystems
}

fragment EntryFragment on SystemConfiguratorBlock {
  __typename
  sys {
    id
  }
  title
  description {
    ...RichTextFragment
  }
  type
}

fragment TitleWithContentFragment on TitleWithContent {
  sys {
    id
  }
  title
  content {
    json
  }
}

fragment AssetFragment on Asset {
  __typename
  sys {
    id
  }
  title
  url
  contentType
}

fragment RichTextFragment on SystemConfiguratorBlockDescription {
  json
  links {
    assets {
      block {
          ...AssetFragment
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
      "Content-Type",
      recaptchaTokenHeader
    ]);
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  }

  if (request.method !== "GET") {
    return response.status(400).send(generateError(`Method is forbidden.`));
  }

  const recaptchaToken =
    // eslint-disable-next-line security/detect-object-injection
    request.headers[recaptchaTokenHeader] ||
    request.headers[recaptchaTokenHeader.toLowerCase()];

  if (!recaptchaToken) {
    return response
      .status(400)
      .send(generateError("Recaptcha token not provided."));
  }

  try {
    const recaptchaResponse = await fetch(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_KEY}&response=${recaptchaToken}`,
      { method: "POST" }
    );
    if (!recaptchaResponse.ok) {
      return response
        .status(400)
        .send(generateError("Recaptcha check failed."));
    }
    const json = await recaptchaResponse.json();
    if (!json.success || json.score < minimumScore) {
      logger.error({
        message: `Recaptcha check failed with error ${JSON.stringify(json)}.`
      });
      return response.status(400).send(Error("Recaptcha check failed."));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error({ message: `Recaptcha request failed with error ${error}.` });
    return response.status(500).send(Error("Recaptcha request failed."));
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
        preview: PREVIEW_API || "false"
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

    if (
      data.nextStep?.__typename !== "SystemConfiguratorBlock" ||
      !data.nextStep.answersCollection
    ) {
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

  if (nextStep.__typename === "SystemConfiguratorBlock") {
    const { type } = nextStep;

    // eslint-disable-next-line security/detect-object-injection
    if (nextStep[nextStepMap[type]]) {
      return response.status(200).send(transformNextStepData(nextStep));
    }

    return response
      .status(400)
      .send(
        generateError(
          `Type ${type} is not a valid System Configurator next step of type Answer (type Question or Result only).`
        )
      );
  }

  return response.status(200).send(transformNextStepData(nextStep));
};
