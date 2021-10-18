import merge from "lodash/merge";
import { gql } from "@apollo/client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextLogger } from "@bmi/logger";
import { getServerPageGetGlobalDataPublic } from "../../graphql/generated/page";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { initializeApollo } from "../apolloClient";
import { getSecret } from "../utils/secrets";

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

  const GATEWAY_API_KEY = await getSecret(
    process.env.GCP_SECRET_PROJECT,
    "GATEWAY_API_KEY"
  );
  const headers = {
    "x-api-key": GATEWAY_API_KEY
  };

  // NOTE: I'm not sure of this API, but I'd like to be able to pass extra headers to client
  const apolloClient = initializeApollo(null, { req, res, headers });

  const {
    props: { data: globalPageData }
  } = await getServerPageGetGlobalDataPublic({}, apolloClient);

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

export const GET_PAGE_DATA = gql`
  query GetGlobalDataPublic {
    # Only one Market Content is expected to be available for user
    marketContentCollection(limit: 1) {
      items {
        footerLinksCollection {
          items {
            title
            relativePath
          }
        }
        # Top bar - Contact us link
        contactUsPage {
          title
          relativePath
        }
        # Top bar - global external link
        externalLinkUrl
        externalLinkLabel
      }
    }
  }
`;

export const withPublicPage =
  (getServerSideProps) => async (context: PageContext) => {
    if (context.req) {
      NextLogger(context.req, context.res);
    }
    return innerGetServerSideProps(getServerSideProps, context);
  };
