import gql from "graphql-tag";
import { NextRouter, useRouter } from "next/router";
import { QueryHookOptions, useQuery } from "@apollo/client";
import * as Apollo from "@apollo/client";
import type React from "react";
import type { NormalizedCacheObject } from "@apollo/client";
import * as OperationTypes from "./operations";

export const TrainingsDocument = gql`
  query trainings {
    training {
      name
      url
      user {
        id
        email
        user_level
        username
        firstname
        lastname
        enrollment {
          count
          has_more_data
          current_page
          current_page_size
          total_page_count
          total_count
          items {
            id
            name
            description
            status
            image_url
            url
            type
            level
          }
        }
      }
    }
  }
`;
export async function getServerPageTrainings(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.TrainingsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.TrainingsQuery>({
    ...options,
    query: TrainingsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useTrainings = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.TrainingsQuery,
    OperationTypes.TrainingsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(TrainingsDocument, options);
};
export type PageTrainingsComp = React.FC<{
  data?: OperationTypes.TrainingsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrTrainings = {
  getServerPage: getServerPageTrainings,

  usePage: useTrainings
};
