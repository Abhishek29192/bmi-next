import merge from "lodash/merge";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "@auth0/nextjs-auth0";
import { Account } from "@bmi/intouch-api-types";
import { NextLogger } from "@bmi/logger";
import {
  getServerPageGetGlobalData,
  getServerPageGetMarketsByDomain
} from "../../graphql/generated/page";
import {
  GetGlobalDataQuery,
  GetMarketsByDomainQuery
} from "../../graphql/generated/operations";
import { isSingleMarket } from "../../lib/config";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { marketRedirect } from "../redirects/market";
import { redirectCompanyRegistration } from "../redirects/companyRegistration";
import { userRegistration } from "../redirects/userRegistration";
import { queryAccountByEmail } from "../account";

type PageContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  auth0: any;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  session: Session;
  account: Account;
  market: GetMarketsByDomainQuery["markets"]["nodes"][0];
  globalPageData: GetGlobalDataQuery;
};

export type GlobalPageProps = {
  account: Account;
  market: GetMarketsByDomainQuery["markets"]["nodes"][0];
  globalPageData: GetGlobalDataQuery;
};

export const innerGetServerSideProps = async (
  getServerSideProps,
  auth0,
  ctx
) => {
  const { req, res } = ctx;
  const session: Session = auth0.getSession(req, res);

  const apolloClient = initializeApollo(null, { req, res });

  const {
    data: { accountByEmail: account }
  } = await apolloClient.query({
    query: queryAccountByEmail,
    variables: {
      email: session.user.email
    }
  });

  // Redirect based on market, this will overwrite the above redirect
  // we will redirect the user to the company registration after landed
  // on the right market

  let redirect = marketRedirect(req, account);
  if (redirect) return redirect;

  // Redirect to user registration if missing data in the user profile
  redirect = userRegistration(ctx.resolvedUrl, account);
  if (redirect) return redirect;

  // Redirect to company registration if new company
  redirect = redirectCompanyRegistration(ctx.resolvedUrl, account);
  if (redirect) return redirect;

  const domain = isSingleMarket ? "en" : req.headers.host?.split(".")?.[0];
  const {
    props: {
      data: {
        markets: {
          nodes: [market]
        }
      }
    }
  } = await getServerPageGetMarketsByDomain(
    { variables: { domain } },
    apolloClient
  );

  // TODO: we could pass market.cmsSpaceId to this query when we have multiple Contentful spaces
  const {
    props: { data: globalPageData }
  } = await getServerPageGetGlobalData({}, apolloClient);

  return merge(
    await getServerSideProps({
      ...ctx,
      // enhanced context
      // these properties are available on every "withPage" getServerSideProps
      auth0,
      apolloClient,
      session,
      account,
      market,
      globalPageData
    }),
    {
      props: {
        // these props will be available to every "withPage" component
        // without having to manually pass them
        account,
        market,
        globalPageData
      }
    }
  );
};

export const withPage =
  (getServerSideProps) => async (context: PageContext) => {
    if (context.req) {
      NextLogger(context.req, context.res);
    }
    const auth0 = await getAuth0Instance(context.req, context.res);
    return auth0.withPageAuthRequired({
      async getServerSideProps(ctx: PageContext) {
        return innerGetServerSideProps(getServerSideProps, auth0, ctx);
      }
    })(context);
  };
