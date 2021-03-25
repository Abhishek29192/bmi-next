import Router from "next/router";
import { gql } from "@apollo/client";
import auth0 from "../auth0";
import { initializeApollo } from "../apolloClient";
import { ROLES } from "../config";

const GET_COMPANY = gql`
  query currentCompany {
    currentCompany
  }
`;

const initialProps = async ({ ctx, Component }) => {
  const { req, res, pathname } = ctx;

  // Let's api work normally
  if (pathname.indexOf("/api") !== -1) {
    return {};
  }

  // Check if the user is a company_admin and if he has a company
  const apolloClient = initializeApollo();
  const session = await auth0.getSession(req, res);

  if (session) {
    const { accessToken, user } = session;
    const userRole = user[`${process.env.AUTH0_NAMESPACE}/role`];

    // Get the current user's company
    const {
      data: { currentCompany }
    } = await apolloClient.query({
      query: GET_COMPANY,
      variables: {},
      context: { headers: { Authorization: `Bearer ${accessToken}` } }
    });
    // If company_admin and no company is found let's show the "complete registration" page
    if (
      userRole === ROLES.COMPANY_ADMIN &&
      pathname !== "/registration" &&
      !currentCompany
    ) {
      if (res) {
        res.writeHead(302, { Location: "/registration" });
        res.end();
      } else {
        Router.replace("/registration");
      }
      return {};
    }
  }

  if (Component.getServerSideProps) {
    Object.assign({}, await Component.getServerSideProps(ctx));
  }

  return {};
};

export default initialProps;
