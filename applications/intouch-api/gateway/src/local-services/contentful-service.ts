import { fetch } from "cross-fetch";
import { GraphQLSchema, print } from "graphql";
import { wrapSchema, introspectSchema } from "@graphql-tools/wrap";
import { Executor, ExecutionParams } from "@graphql-tools/delegate";
import { transformSchemaFederation } from "graphql-transform-federation";

const {
  CONTENTFUL_API_HOST,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_TOKEN
} = process.env;

const CONTENTFUL_SERVICE = `${CONTENTFUL_API_HOST}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

const executor: Executor = async ({ document, variables }: ExecutionParams) => {
  const query = print(document);
  const fetchResult = await fetch(CONTENTFUL_SERVICE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONTENTFUL_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};

export default async (): Promise<GraphQLSchema> => {
  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor: executor
  });
  return transformSchemaFederation(schema, {
    Query: {
      extend: true
    }
  });
};
