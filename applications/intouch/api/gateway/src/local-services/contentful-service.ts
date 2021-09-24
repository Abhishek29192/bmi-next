import axios from "axios";
import { GraphQLSchema, print } from "graphql";
import { wrapSchema, introspectSchema } from "@graphql-tools/wrap";
import { AsyncExecutor, ExecutionParams } from "@graphql-tools/delegate";
import { transformSchemaFederation } from "graphql-transform-federation";

import { getSecret } from "../utils/secrets";

const { CONTENTFUL_API_HOST, CONTENTFUL_SPACE_ID, GCP_SECRET_PROJECT } =
  process.env;

let contentfulConfigs;

const executor: AsyncExecutor = async ({
  document,
  variables,
  context = {}
}: ExecutionParams) => {
  if (!contentfulConfigs) {
    contentfulConfigs = await getSecret(
      GCP_SECRET_PROJECT,
      "CONTENTFUL_CONFIG"
    );
  }

  const { market = "en" } = context;
  const parsedContentfulConfigs = JSON.parse(contentfulConfigs);

  const query = print(document);
  const {
    space = CONTENTFUL_SPACE_ID,
    token,
    env
  } = parsedContentfulConfigs[`${market}`];

  const { data } = await axios({
    url: `${CONTENTFUL_API_HOST}/spaces/${space}/environments/${env}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    data: { query, variables },
    timeout: 3000
  });

  return data;
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
