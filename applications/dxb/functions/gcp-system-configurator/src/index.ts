import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import QueryString from "qs";
import fetch from "node-fetch";
import { EntryFields } from "contentful";

const { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } =
  process.env;

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

const runQuery = async (
  query: string,
  variables: QueryString.ParsedQs,
  accessToken: string = CONTENTFUL_ACCESS_TOKEN,
  spaceId: string = CONTENTFUL_SPACE_ID,
  environment: string = CONTENTFUL_ENVIRONMENT
): Promise<Answer> => {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
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

  if (request.method !== "GET") {
    return response.status(400).send(generateError(`Method is forbidden.`));
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
