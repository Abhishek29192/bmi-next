import auth0 from "../../lib/auth0";

// This endpoint fetch the user profile in auth0, we use this endpoint to refetch the user info, useful to check if the user it's been blocked/deleted on each page load
export default async function checkProfile(req, res) {
  try {
    await auth0.handleProfile(req, res, {
      refetch: true
    });
  } catch (error) {
    if (error.error === "unauthorized") {
      res.status(401).end(error.message);
    } else {
      res.status(error.status || 500).end(error.message);
    }
  }
}
