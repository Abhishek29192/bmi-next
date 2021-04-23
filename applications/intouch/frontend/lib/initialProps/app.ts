import axios from "axios";
import auth0 from "../auth0";

const USER_UNAUTHORIZED = "unauthorized (user is blocked)";

const initialProps = async ({ ctx, Component }) => {
  const { req, res, pathname } = ctx;

  if (pathname.includes("/api/auth")) {
    return {};
  }

  // Run the check only server side
  if (req) {
    const { AUTH0_NAMESPACE, NEXT_PUBLIC_BASE_URL } = process.env;
    try {
      // Get the current session
      const session = await auth0.getSession(req, res);
      if (session) {
        // Check if the session is valid
        await axios.get(`${NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
          headers: {
            cookie: req?.headers?.cookie
          }
        });

        // Check if the user is a company admin and if it has already registered the company
        const { user } = session;
        const regCompleted =
          user[`${AUTH0_NAMESPACE}/registration_to_complete`];

        // If company not registered then redirect him to the company registration
        if (pathname !== "/company-registration" && regCompleted) {
          res.writeHead(302, { Location: "/company-registration" });
          res.end();
          return {};
        }
      }
    } catch (error) {
      // If Unauthorized user redirect to the logout
      if (
        error?.response?.status === 401 ||
        error?.response.data === USER_UNAUTHORIZED
      ) {
        res.writeHead(302, { Location: "/api/auth/logout" });
        res.end();
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
