import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { publish, TOPICS } from "../../services/events";

const EtendSchemaPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs: gql`
    input PublishInput {
      message: String
    }

    extend type Mutation {
      publishMessage(input: PublishInput!): String
    }
  `,
  resolvers: {
    Mutation: {
      publishMessage: async (_query, args, context, resolveInfo) => {
        const {
          input: { message }
        } = args;
        const { pubSub } = context;

        await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, {
          email: "email@email.com",
          message
        });

        return message;
      }
    }
  }
}));

export default EtendSchemaPlugin;
