import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { Logger } from "winston";

export const mutationPerformMerchandiseSso = gql`
  mutation performMerchandiseSso($email: String!) {
    performMerchandiseSso(email: $email)
  }
`;

export default class Merchandise {
  session: any;
  logger: Logger;
  apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(logger, apolloClient, session) {
    this.apolloClient = apolloClient;
    this.session = session;
    this.logger = logger("merchandise");
  }

  completeMerchandiseSso = async () => {
    const { user } = this.session;

    try {
      const { data } = await this.apolloClient.mutate({
        mutation: mutationPerformMerchandiseSso,
        variables: {
          email: user.email
        }
      });

      return data;
    } catch (error) {
      this.logger.error(`ERROR`, error.toString());
      throw error;
    }
  };
}
