import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import QueryString from "qs";
import fetch from "node-fetch";
import { EntryFields } from "contentful";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const {
  CONTENTFUL_DELIVERY_TOKEN_SECRET,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SECRET_MAN_GCP_PROJECT_NAME,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

const secretManagerClient = new SecretManagerServiceClient();
export const recaptchaTokenHeader = "X-Recaptcha-Token";
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE);

export type Answer = {
  nextStep: NextStep | null;
};

export type NextStep = Entry | TitleWithContent;

type Entry = {
  __typename: "SystemConfiguratorBlock";
  sys: {
    id: string;
  };
  title: string;
  type: string;
  description: EntryFields.RichText | null;
} & Question &
  Result;

type Result = {
  recommendedSystems: string[] | null;
};

type Question = {
  answersCollection: {
    items: Entry[];
  } | null;
};

type TitleWithContent = {
  __typename: "TitleWithContent";
  sys: {
    id: string;
  };
  title: string;
  content: EntryFields.RichText | null;
};

type Type = "Question" | "Result";

const nextStepMap: Record<Type, "answersCollection" | "recommendedSystems"> = {
  Question: "answersCollection",
  Result: "recommendedSystems"
};

type SecretRef = "contentfulDeliveryToken" | "recaptchaKey";

const memoisedGetSecret = () => {
  let cache = {};

  const secretsMap = {
    contentfulDeliveryToken: CONTENTFUL_DELIVERY_TOKEN_SECRET,
    recaptchaKey: RECAPTCHA_SECRET_KEY
  };

  return async (secretRef: SecretRef): Promise<string> => {
    // eslint-disable-next-line security/detect-object-injection
    if (cache[secretRef]) {
      // eslint-disable-next-line security/detect-object-injection
      return cache[secretRef];
    }
    /* istanbul ignore next */
    if (process.env.NODE_ENV === "development") {
      const devSecretsMap = {
        contentfulDeliveryToken:
          process.env.DEV_CONTENTFUL_DELIVERY_TOKEN_SECRET,
        recaptchaKey: process.env.DEV_RECAPTCHA_SECRET_KEY
      };

      // eslint-disable-next-line security/detect-object-injection
      const developmentSecret = devSecretsMap[secretRef];

      // eslint-disable-next-line security/detect-object-injection
      cache[secretRef] = developmentSecret;

      return developmentSecret;
    }

    const [secretResponse] = await secretManagerClient.accessSecretVersion({
      // eslint-disable-next-line security/detect-object-injection
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretsMap[secretRef]}/versions/latest`
    });

    if (
      !secretResponse ||
      !secretResponse.payload ||
      !secretResponse.payload.data
    ) {
      throw Error(`Unable to get ${secretRef} secret key.`);
    }

    const secret = secretResponse.payload.data.toString();

    // eslint-disable-next-line security/detect-object-injection
    cache[secretRef] = secret;

    return secret;
  };
};

const getSecret = memoisedGetSecret();

const runQuery = async (
  query: string,
  variables: QueryString.ParsedQs,
  spaceId: string = CONTENTFUL_SPACE_ID,
  environment: string = CONTENTFUL_ENVIRONMENT
): Promise<Answer> => {
  let contentfulDeliveryTokenSecret;

  try {
    contentfulDeliveryTokenSecret = await getSecret("contentfulDeliveryToken");
  } catch (error) {
    throw Error(error.message);
  }

  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${contentfulDeliveryTokenSecret}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.errors) {
        throw Error(response.errors[0].message);
      }

      return response.data.systemConfiguratorBlock;
    });
};

const generateError = (message: string) => {
  const error = Error(message);
  // eslint-disable-next-line no-console
  console.error(error);

  return error;
};

export const query = `
query NextStep($answerId: String!, $locale: String!) {
  systemConfiguratorBlock(id: $answerId, locale: $locale) {
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
  answersCollection {
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
    json
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
`;

export const nextStep: HttpFunction = async (request, response) => {
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

  let recaptchaKeySecret;

  try {
    recaptchaKeySecret = await getSecret("recaptchaKey");
  } catch (error) {
    return response.status(500).send(generateError(error.message));
  }

  try {
    const recaptchaResponse = await fetch(
      `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${recaptchaKeySecret}&response=${recaptchaToken}`,
      { method: "POST" }
    );
    if (!recaptchaResponse.ok) {
      return response
        .status(400)
        .send(generateError("Recaptcha check failed."));
    }
    const json = await recaptchaResponse.json();
    if (!json.success || json.score < minimumScore) {
      // eslint-disable-next-line no-console
      console.error(
        `Recaptcha check failed with error ${JSON.stringify(json)}.`
      );
      return response.status(400).send(Error("Recaptcha check failed."));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Recaptcha request failed with error ${error}.`);
    return response.status(500).send(Error("Recaptcha request failed."));
  }

  let data;
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

  try {
    data = await runQuery(query, { answerId, locale });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return response.status(500).send(error);
  }

  if (!data) {
    return response
      .status(404)
      .send(generateError(`System Configurator entry ${answerId} not found.`));
  }

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

    if (nextStep[nextStepMap[type]]) {
      return response.status(200).send(nextStep);
    }

    return response
      .status(400)
      .send(
        generateError(
          `Type ${type} is not a valid System Configurator next step of type Answer (type Question or Result only).`
        )
      );
  }

  if (nextStep.__typename === "TitleWithContent") {
    return response.status(200).send(nextStep);
  }

  return response
    .status(400)
    .send(
      generateError(
        `__typename ${nextStep.__typename} is not a valid content type (SystemConfiguratorBlock or TitleWithContent)`
      )
    );
};
