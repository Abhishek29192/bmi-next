import { Session } from "@auth0/nextjs-auth0";
import { Account } from "@bmi/intouch-api-types";
import { NextLogger } from "@bmi/logger";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { marketRedirect } from "../redirects/market";
import { redirectCompanyRegistration } from "../redirects/companyRegistration";
import { userRegistration } from "../redirects/userRegistration";
import { queryAccountByEmail } from "../account";
import { getServerPageGetGlobalData } from "../../graphql/generated/page";

export const innerGetServerSideProps = async (
  getServerSideProps,
  auth0,
  ctx
) => {
  const { req, res } = ctx;
  const session: Session = auth0.getSession(req, res);

  const apolloClient = await initializeApollo(null, { req, res });

  const {
    data: { accountByEmail }
  } = await apolloClient.query({
    query: queryAccountByEmail,
    variables: {
      email: session.user.email
    }
  });

  // Redirect based on market, this will overwrite the above redirect
  // we will redirect the user to the company registration after landed
  // on the right market
  let redirect = marketRedirect(req, accountByEmail);
  if (redirect) return redirect;

  // Redirect to user registration if missing data in the user profile
  redirect = userRegistration(ctx.resolvedUrl, accountByEmail);
  if (redirect) return redirect;

  // Redirect to company registration if new company
  redirect = redirectCompanyRegistration(ctx.resolvedUrl, accountByEmail);
  if (redirect) return redirect;

  const {
    props: { data: globalPageData }
  } = await getServerPageGetGlobalData({}, apolloClient);

  return await getServerSideProps({
    ...ctx,
    auth0,
    apolloClient,
    session: session,
    account: accountByEmail as Account,
    globalPageData
  });
};

export const withPage = (getServerSideProps) => async (context) => {
  if (context.req) {
    NextLogger(context.req, context.res);
  }
  const auth0 = await getAuth0Instance(context.req, context.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps(ctx) {
      return innerGetServerSideProps(getServerSideProps, auth0, ctx);
    }
  })(context);
};
