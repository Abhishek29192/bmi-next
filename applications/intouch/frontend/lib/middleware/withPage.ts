import merge from "lodash/merge";
import { gql } from "@apollo/client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { Session } from "@auth0/nextjs-auth0";
import { Account } from "@bmi/intouch-api-types";
import { getServerPageGetGlobalData } from "../../graphql/generated/page";
import {
  GetGlobalDataQuery,
  GetMarketsByDomainQuery
} from "../../graphql/generated/operations";
import { queryMarketsByDomain } from "../../lib/market";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { marketRedirect } from "../redirects/market";
import { redirectCompanyRegistration } from "../redirects/companyRegistration";
import { userRegistration } from "../redirects/userRegistration";
import { withLogger } from "../middleware/withLogger";
import { getMarketAndEnvFromReq } from "../utils";

type PageContext = GetServerSidePropsContext & {
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

export const queryAccountByEmail = gql`
  query accountInfoByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      role
      marketId
      firstName
      lastName
      email
      doceboUserId
      market {
        id
        domain
        projectsEnabled
      }
      companyMembers {
        nodes {
          company {
            id
            status
            name
            tier
          }
        }
      }
      # At the moment only interested in whether account is assigned to any projects at all
      projectMembers {
        totalCount
      }
    }
  }
`;

export const innerGetServerSideProps = async (
  getServerSideProps,
  auth0,
  ctx
) => {
  const { req, res, resolvedUrl } = ctx;

  const session: Session = auth0.getSession(req, res);

  let accessToken = session.accessToken;

  const now = Date.now();

  if (now >= session.accessTokenExpiresAt * 1000) {
    try {
      const newAccessToken = await auth0.getAccessToken(req, res, {
        refresh: true
      });
      accessToken = newAccessToken?.accessToken;
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: "/api/auth/logout"
        }
      };
    }
  }

  const logger = req.logger("withPage");
  const apolloClient = initializeApollo(null, { req, res, accessToken });

  let market = null;
  let account = null;
  let globalPageData = null;

  try {
    const {
      data: { accountByEmail }
    } = await apolloClient.query({
      query: queryAccountByEmail,
      variables: {
        email: session.user.email
      }
    });

    account = accountByEmail;

    if (!account) {
      logger.error(`User not found in db: ${session.user.sub}`);

      return {
        redirect: {
          permanent: false,
          destination: "/api/auth/logout"
        }
      };
    }

    const marketEnv = getMarketAndEnvFromReq(req);

    const {
      data: {
        markets: { nodes: markets = [market] }
      }
    } = await apolloClient.query({
      query: queryMarketsByDomain,
      variables: { domain: marketEnv.market }
    });

    // Redirect based on market, this will overwrite the above redirect
    // we will redirect the user to the company registration after landed
    // on the right market
    let redirect = marketRedirect(req, account);
    if (redirect) return redirect;

    // Redirect to user registration if missing data in the user profile
    redirect = userRegistration(resolvedUrl, account, session);
    if (redirect) return redirect;

    // Redirect to company registration if new company
    redirect = redirectCompanyRegistration(resolvedUrl, account);
    if (redirect) return redirect;

    market = markets[0];

    // TODO: get all in 1 query (the previous one)?
    const {
      props: { data }
    } = await getServerPageGetGlobalData(
      { variables: { accountId: account.id } },
      apolloClient
    );

    globalPageData = data;
  } catch (error) {
    const { networkError } = error;

    logger.error("Generic error", networkError?.result?.message || error);

    if (networkError?.result) {
      if (networkError?.result?.message === "Jwt issuer is not configured") {
        return {
          redirect: {
            permanent: false,
            destination: `/api/auth/logout`
          }
        };
      } else {
        if (resolvedUrl?.indexOf("/api-error") === -1) {
          return {
            redirect: {
              permanent: false,
              destination: `/api-error?message=genericError`
            }
          };
        }
      }
    }
  }

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

export const withPage = (getServerSideProps) =>
  withLogger(async (context: PageContext) => {
    const auth0 = await getAuth0Instance(context.req, context.res);
    return auth0.withPageAuthRequired({
      async getServerSideProps(ctx: PageContext) {
        return innerGetServerSideProps(getServerSideProps, auth0, ctx);
      }
    })(context);
  });
