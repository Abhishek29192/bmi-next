import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
import * as OperationTypes from "./operations";

const defaultOptions = {};

export const UpdateCompanyDocument = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        name
      }
    }
  }
`;
export type UpdateCompanyMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateCompanyMutation,
  OperationTypes.UpdateCompanyMutationVariables
>;

/**
 * __useUpdateCompanyMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyMutation, { data, loading, error }] = useUpdateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateCompanyMutation,
    OperationTypes.UpdateCompanyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateCompanyMutation,
    OperationTypes.UpdateCompanyMutationVariables
  >(UpdateCompanyDocument, options);
}
export type UpdateCompanyMutationHookResult = ReturnType<
  typeof useUpdateCompanyMutation
>;
export type UpdateCompanyMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateCompanyMutation>;
export type UpdateCompanyMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateCompanyMutation,
  OperationTypes.UpdateCompanyMutationVariables
>;
export const CurrentCompanyDocument = gql`
  query currentCompany {
    currentCompany
  }
`;

/**
 * __useCurrentCompanyQuery__
 *
 * To run a query within a React component, call `useCurrentCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentCompanyQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentCompanyQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.CurrentCompanyQuery,
    OperationTypes.CurrentCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.CurrentCompanyQuery,
    OperationTypes.CurrentCompanyQueryVariables
  >(CurrentCompanyDocument, options);
}
export function useCurrentCompanyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.CurrentCompanyQuery,
    OperationTypes.CurrentCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.CurrentCompanyQuery,
    OperationTypes.CurrentCompanyQueryVariables
  >(CurrentCompanyDocument, options);
}
export type CurrentCompanyQueryHookResult = ReturnType<
  typeof useCurrentCompanyQuery
>;
export type CurrentCompanyLazyQueryHookResult = ReturnType<
  typeof useCurrentCompanyLazyQuery
>;
export type CurrentCompanyQueryResult = Apollo.QueryResult<
  OperationTypes.CurrentCompanyQuery,
  OperationTypes.CurrentCompanyQueryVariables
>;
export const GetCurrentCompanyDocument = gql`
  query GetCurrentCompany {
    currentCompany
  }
`;

/**
 * __useGetCurrentCompanyQuery__
 *
 * To run a query within a React component, call `useGetCurrentCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentCompanyQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentCompanyQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetCurrentCompanyQuery,
    OperationTypes.GetCurrentCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetCurrentCompanyQuery,
    OperationTypes.GetCurrentCompanyQueryVariables
  >(GetCurrentCompanyDocument, options);
}
export function useGetCurrentCompanyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetCurrentCompanyQuery,
    OperationTypes.GetCurrentCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetCurrentCompanyQuery,
    OperationTypes.GetCurrentCompanyQueryVariables
  >(GetCurrentCompanyDocument, options);
}
export type GetCurrentCompanyQueryHookResult = ReturnType<
  typeof useGetCurrentCompanyQuery
>;
export type GetCurrentCompanyLazyQueryHookResult = ReturnType<
  typeof useGetCurrentCompanyLazyQuery
>;
export type GetCurrentCompanyQueryResult = Apollo.QueryResult<
  OperationTypes.GetCurrentCompanyQuery,
  OperationTypes.GetCurrentCompanyQueryVariables
>;
export const GetCompanyDocument = gql`
  query GetCompany($companyId: Int!) {
    company(id: $companyId) {
      name
      phone
      website
      aboutUs
      publicEmail
      phone
      website
    }
  }
`;

/**
 * __useGetCompanyQuery__
 *
 * To run a query within a React component, call `useGetCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useGetCompanyQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetCompanyQuery,
    OperationTypes.GetCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetCompanyQuery,
    OperationTypes.GetCompanyQueryVariables
  >(GetCompanyDocument, options);
}
export function useGetCompanyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetCompanyQuery,
    OperationTypes.GetCompanyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetCompanyQuery,
    OperationTypes.GetCompanyQueryVariables
  >(GetCompanyDocument, options);
}
export type GetCompanyQueryHookResult = ReturnType<typeof useGetCompanyQuery>;
export type GetCompanyLazyQueryHookResult = ReturnType<
  typeof useGetCompanyLazyQuery
>;
export type GetCompanyQueryResult = Apollo.QueryResult<
  OperationTypes.GetCompanyQuery,
  OperationTypes.GetCompanyQueryVariables
>;
export const TrainingInformationDocument = gql`
  query trainingInformation {
    courses {
      nodes {
        id
        name
        technology
        image
        promoted
        trainingType
        description
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
    courseEnrollments {
      nodes {
        id
        url
        status
        course {
          id
          name
          description
          image
          technology
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

/**
 * __useTrainingInformationQuery__
 *
 * To run a query within a React component, call `useTrainingInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainingInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainingInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useTrainingInformationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.TrainingInformationQuery,
    OperationTypes.TrainingInformationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.TrainingInformationQuery,
    OperationTypes.TrainingInformationQueryVariables
  >(TrainingInformationDocument, options);
}
export function useTrainingInformationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.TrainingInformationQuery,
    OperationTypes.TrainingInformationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.TrainingInformationQuery,
    OperationTypes.TrainingInformationQueryVariables
  >(TrainingInformationDocument, options);
}
export type TrainingInformationQueryHookResult = ReturnType<
  typeof useTrainingInformationQuery
>;
export type TrainingInformationLazyQueryHookResult = ReturnType<
  typeof useTrainingInformationLazyQuery
>;
export type TrainingInformationQueryResult = Apollo.QueryResult<
  OperationTypes.TrainingInformationQuery,
  OperationTypes.TrainingInformationQueryVariables
>;
