import merge from "lodash/merge";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextLogger } from "@bmi/logger";
import { getServerPageGetGlobalData } from "../../graphql/generated/page";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { initializeApollo } from "../apolloClient";

type PageContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  globalPageData: GetGlobalDataQuery;
};

export type GlobalPageProps = {
  globalPageData: GetGlobalDataQuery;
};

export const innerGetServerSideProps = async (getServerSideProps, ctx) => {
  const { req, res } = ctx;

  const apolloClient = initializeApollo(null, { req, res });

  const {
    props: { data: globalPageData }
  } = await getServerPageGetGlobalData(
    {
      context: {
        headers: {
          "x-api-key": "my-super-api-key"
        }
      }
    },
    apolloClient
  );

  return merge(
    await getServerSideProps({
      ...ctx,
      // enhanced context
      // these properties are available on every "withPublicPage" getServerSideProps
      apolloClient,
      globalPageData
    }),
    {
      props: {
        // these props will be available to every "withPublicPage" component
        // without having to manually pass them
        globalPageData
      }
    }
  );
};

export const withPublicPage =
  (getServerSideProps) => async (context: PageContext) => {
    if (context.req) {
      NextLogger(context.req, context.res);
    }
    return innerGetServerSideProps(getServerSideProps, context);
  };
