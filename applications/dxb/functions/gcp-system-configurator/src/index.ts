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
  description: {
    json: EntryFields.RichText;
    links: {
      assets: {
        block: Asset[];
      };
    };
  } | null;
} & Partial<Question> &
  Partial<Result>;

type Result = {
  recommendedSystems: string[] | null;
};

type Question = {
  answersCollection: {
    total: number;
    items: Entry[];
  } | null;
};

type TitleWithContent = {
  __typename: "TitleWithContent";
  sys: {
    id: string;
  };
  title: string;
};

type Asset = {
  __typename: "Asset";
  sys: {
    id: string;
  };
  title: string | null;
  url: string | null;
  contentType: string | null;
};

type Type = "Question" | "Result";

type ResponseRichText = {
  raw: string;
  references: Array<{
    __typename: "ContentfulAsset";
    contentful_id: string;
    id: string;
    title: string | null;
    file: {
      url: string;
      contentType: string;
    };
  }>;
};

export type Response = {
  contentful_id: string;
  id: string;
  title: string;
} & (
  | {
      __typename: `ContentfulSystemConfiguratorBlock`;
      type: string;
      description: ResponseRichText | null;
      answers: Response[];
      recommendedSystems: string[] | null;
    }
  | {
      __typename: `ContentfulTitleWithContent`;
      type: null;
      answers: null;
      recommendedSystems: null;
    }
);

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

const transformNextStepData = (nextStepData: NextStep): Response => {
  const { sys, title } = nextStepData;

  const data = {
    contentful_id: sys.id,
    id: sys.id,
    type: null,
    title,
    answers: null,
    recommendedSystems: null
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
            url: blockAsset.url,
            contentType: blockAsset.contentType
          }
        }))
      },
      type,
      answers:
        answersCollection &&
        answersCollection.items.map((answer) => transformNextStepData(answer)),
      recommendedSystems
    };
  }

  return {
    __typename: `ContentfulTitleWithContent`,
    ...data
  };
};

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

const PAGE_SIZE = 9;

export const query = (page) => `
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
  let answers = [];
  let page = 0;

  do {
    try {
      data = await runQuery(query(page), { answerId, locale });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
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

  if (nextStep.__typename === "TitleWithContent") {
    return response.status(200).send(transformNextStepData(nextStep));
  }

  return response.status(400).send(
    generateError(
      // @ts-ignore: if change to CMS
      `__typename ${nextStep.__typename} is not a valid content type (SystemConfiguratorBlock or TitleWithContent)`
    )
  );
};
