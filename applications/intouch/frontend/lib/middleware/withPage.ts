import { gql } from "@apollo/client";
import { NextLogger } from "@bmi/logger";
import { getAuth0Instance } from "../auth0";
import { initializeApollo } from "../apolloClient";
import { marketRedirect } from "../redirects/market";
import { redirectCompanyRegistration } from "../redirects/companyRegistration";

export const queryAccountByEmail = gql`
  query accountByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      marketId
      doceboUserId
      market {
        domain
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
      companyMembers {
        nodes {
          company {
            id
            status
          }
        }
      }
    }
  }
`;

export const innerGetServerSideProps = async (
  getServerSideProps,
  auth0,
  ctx
) => {
  const { req, res } = ctx;
  const { user, ...session } = auth0.getSession(req, res);

  const apolloClient = await initializeApollo(null, { req, res });

  const {
    data: { accountByEmail }
  } = await apolloClient.query({
    query: queryAccountByEmail,
    variables: {
      email: user.email
    }
  });

  const account = {
    ...user,
    ...accountByEmail
  };

  // Redirect based on market, this will overwrite the above redirect
  // we will redirect the user to the company registration after landed
  // on the right market
  let redirect = marketRedirect(req, account);
  if (redirect) return redirect;

  // Redirect to copmany registration if new company
  redirect = redirectCompanyRegistration(req, account);
  if (redirect) return redirect;

  return await getServerSideProps({
    ...ctx,
    auth0,
    apolloClient,
    session: { user, ...session },
    account
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
