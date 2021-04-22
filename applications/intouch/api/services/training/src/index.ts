import { Buffer } from "buffer";
import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";

dotenv.config();

import { IDataSources, IContext } from "./type";
import schemas from "./graphql/schemas";
import resolvers from "./graphql/resolvers";
import { Docebo, loginToDocebo } from "./apis";
import LRU from "./util/cache";

const NAMESPACE = "https://intouch";

async function main() {
  const cache = new LRU();
  const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs: schemas, resolvers }),
    dataSources: (): IDataSources => {
      return {
        doceboApi: new Docebo()
      };
    },
    cacheControl: {
      defaultMaxAge: 10
    },
    context: async ({ req }): Promise<IContext> => {
      let user: any = {};
      let doceboToken: String;
      const userInfo = req.headers["x-apigateway-api-userinfo"];

      if (userInfo) {
        user = JSON.parse(
          Buffer.from(userInfo as string, "base64").toString("ascii")
        );
      }

      if (!cache.get(`${userInfo}_token`)) {
        try {
          const { data } = await loginToDocebo(user[`${NAMESPACE}/email`]);
          doceboToken = data?.access_token;
          cache.set(`${userInfo}_token`, doceboToken);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log("Error: ", error.message);
        }
      } else {
        doceboToken = cache.get(`${userInfo}_token`);
      }

      return {
        token: doceboToken
      };
    }
  });

  const PORT = process.env.PORT || 4003;
  await server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Training service started at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
