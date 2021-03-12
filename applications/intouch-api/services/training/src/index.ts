import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";

dotenv.config();

import { IDataSources, IContext } from "./type";
import schemas from "./graphql/schemas";
import resolvers from "./graphql/resolvers";
import { Docebo } from "./apis";

async function main() {
  const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs: schemas, resolvers }),
    dataSources: (): IDataSources => {
      return {
        doceboApi: new Docebo()
      };
    },
    context: ({ req }): IContext => {
      const token = req.headers.authorization || "";
      return {
        token: token
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
