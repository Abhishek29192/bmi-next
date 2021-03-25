import auth0 from "../../lib/auth0";

export default async function checkProfile(req, res) {
  try {
    await auth0.handleProfile(req, res, {
      refetch: true
    });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
