import { fetch } from "cross-fetch";
import { GraphQLSchema, print } from "graphql";
import { wrapSchema, introspectSchema } from "@graphql-tools/wrap";
import { AsyncExecutor, ExecutionParams } from "@graphql-tools/delegate";
import { transformSchemaFederation } from "graphql-transform-federation";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const {
  CONTENTFUL_API_HOST,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  GCP_SECRET_PROJECT
} = process.env;

const client = new SecretManagerServiceClient();

const getSecret = async (client, project, key) => {
  const values = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${key}/versions/latest`
  });
  return values[0].payload.data.toString();
};

const CONTENTFUL_SERVICE = `${CONTENTFUL_API_HOST}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

const executor: AsyncExecutor = async ({
  document,
  variables
}: ExecutionParams) => {
  const query = print(document);
  const CONTENTFUL_TOKEN = await getSecret(
    client,
    GCP_SECRET_PROJECT,
    "CONTENTFUL_TOKEN"
  );
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
