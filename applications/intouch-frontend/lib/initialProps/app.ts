import Router from "next/router";
import auth0 from "../auth0";

const initialProps = async ({ ctx, Component }) => {
  const { req, res, pathname } = ctx;

  // Let's api work normally
  if (pathname.indexOf("/api") !== -1) {
    return {};
  }

  // Check if the user is a company_admin and if he has a company
  const session = await auth0.getSession(req, res);

  if (session) {
    const { user } = session;
    const regCompleted = user[`${process.env.AUTH0_NAMESPACE}/reg_to_complete`];
    if (pathname !== "/company-registration" && regCompleted) {
      if (res) {
        res.writeHead(302, { Location: "/company-registration" });
        res.end();
      } else {
        Router.replace("/company-registration");
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
