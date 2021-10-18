import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth();

export const getGCPToken = async (url: string) => {
  const client = await auth.getIdTokenClient(url);
  const headers = await client.getRequestHeaders();
  return headers?.Authorization;
};
