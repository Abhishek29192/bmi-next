import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
import * as OperationTypes from "./operations";

const defaultOptions = {};

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

/**
 * __useTrainingsQuery__
 *
 * To run a query within a React component, call `useTrainingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTrainingsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.TrainingsQuery,
    OperationTypes.TrainingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.TrainingsQuery,
    OperationTypes.TrainingsQueryVariables
  >(TrainingsDocument, options);
}
export function useTrainingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.TrainingsQuery,
    OperationTypes.TrainingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.TrainingsQuery,
    OperationTypes.TrainingsQueryVariables
  >(TrainingsDocument, options);
}
export type TrainingsQueryHookResult = ReturnType<typeof useTrainingsQuery>;
export type TrainingsLazyQueryHookResult = ReturnType<
  typeof useTrainingsLazyQuery
>;
export type TrainingsQueryResult = Apollo.QueryResult<
  OperationTypes.TrainingsQuery,
  OperationTypes.TrainingsQueryVariables
>;
