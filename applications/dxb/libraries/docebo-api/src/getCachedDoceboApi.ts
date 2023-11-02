import { DoceboApiService } from "./services";

let doceboServiceApi: DoceboApiService | null = null;

export const getCachedDoceboApi = (): DoceboApiService => {
  if (doceboServiceApi) {
    return doceboServiceApi;
  }

  doceboServiceApi = new DoceboApiService({
    apiUrl: process.env.DOCEBO_API_URL!,
    clientId: process.env.DOCEBO_API_CLIENT_ID!,
    clientSecret: process.env.DOCEBO_API_CLIENT_SECRET!,
    username: process.env.DOCEBO_API_USERNAME!,
    password: process.env.DOCEBO_API_PASSWORD!
  });

  return doceboServiceApi;
};
