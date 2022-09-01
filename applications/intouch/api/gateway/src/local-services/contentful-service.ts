import { AsyncExecutor, ExecutionParams } from "@graphql-tools/delegate";
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap";
import axios from "axios";
import { GraphQLSchema, print } from "graphql";
import { transformSchemaFederation } from "graphql-transform-federation";

const { CONTENTFUL_API_HOST, CONTENTFUL_SPACE_ID, CONTENTFUL_CONFIG } =
  process.env;

const executor: AsyncExecutor = async ({
  document,
  variables,
  context = {}
}: ExecutionParams) => {
  const { market = "en" } = context;
  const parsedContentfulConfigs = JSON.parse(CONTENTFUL_CONFIG);

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
