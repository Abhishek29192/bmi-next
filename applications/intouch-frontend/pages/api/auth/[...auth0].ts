// pages/api/auth/[...auth0].js
import auth0 from "../../../lib/auth0";

export default auth0.handleAuth({
  async login(req, res) {
    try {
      await auth0.handleLogin(req, res, {
        authorizationParams: {
          market: req.query.market || "en"
        }
      });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
});
