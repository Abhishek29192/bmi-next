import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { publish, TOPICS } from "../../services/events";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs: gql`
    type Publish {
      title: String
      text: String
      html: String
      email: String
    }
    input PublishInput {
      title: String
      text: String
      html: String
      email: String
    }

    extend type Mutation {
      publishMessage(input: PublishInput!): Publish
    }
  `,
  resolvers: {
    Mutation: {
      publishMessage: async (_query, args, context, resolveInfo) => {
        const { input } = args;
        const { pubSub } = context;

        await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, input);

        return input;
      }
    }
  }
}));

export default ExtendSchemaPlugin;
