import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { NextLogger } from "@bmi/logger";
import merge from "lodash/merge";
import { NextApiRequest, NextApiResponse } from "next";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { getServerPageGetGlobalDataPublic } from "../../graphql/generated/page";
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

  const headers = {
    "x-api-key": process.env.GATEWAY_API_KEY
  };

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
