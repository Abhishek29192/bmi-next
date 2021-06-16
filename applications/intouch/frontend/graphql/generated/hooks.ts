import * as OperationTypes from "./operations";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
export const CompanyDetailsFragmentFragmentDoc = gql`
  fragment CompanyDetailsFragment on Company {
    id
    name
    phone
    website
    aboutUs
    publicEmail
    phone
    website
    companyMembers {
      nodes {
        id
      }
    }
  }
`;
export const UpdateCompanyDetailsDocument = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyDetailsFragment
      }
    }
  }
  ${CompanyDetailsFragmentFragmentDoc}
`;
export type UpdateCompanyDetailsMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateCompanyDetailsMutation,
  OperationTypes.UpdateCompanyDetailsMutationVariables
>;

/**
 * __useUpdateCompanyDetailsMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyDetailsMutation, { data, loading, error }] = useUpdateCompanyDetailsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyDetailsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateCompanyDetailsMutation,
    OperationTypes.UpdateCompanyDetailsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateCompanyDetailsMutation,
    OperationTypes.UpdateCompanyDetailsMutationVariables
  >(UpdateCompanyDetailsDocument, options);
}
export type UpdateCompanyDetailsMutationHookResult = ReturnType<
  typeof useUpdateCompanyDetailsMutation
>;
export type UpdateCompanyDetailsMutationResult = Apollo.MutationResult<OperationTypes.UpdateCompanyDetailsMutation>;
export type UpdateCompanyDetailsMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateCompanyDetailsMutation,
  OperationTypes.UpdateCompanyDetailsMutationVariables
>;
export const CreateCompanyDocument = gql`
  mutation createCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        name
      }
    }
  }
`;
export type CreateCompanyMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateCompanyMutation,
  OperationTypes.CreateCompanyMutationVariables
>;

/**
 * __useCreateCompanyMutation__
 *
 * To run a mutation, you first call `useCreateCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyMutation, { data, loading, error }] = useCreateCompanyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateCompanyMutation,
    OperationTypes.CreateCompanyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateCompanyMutation,
    OperationTypes.CreateCompanyMutationVariables
  >(CreateCompanyDocument, options);
}
export type CreateCompanyMutationHookResult = ReturnType<
  typeof useCreateCompanyMutation
>;
export type CreateCompanyMutationResult = Apollo.MutationResult<OperationTypes.CreateCompanyMutation>;
export type CreateCompanyMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateCompanyMutation,
  OperationTypes.CreateCompanyMutationVariables
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
      ...CompanyDetailsFragment
    }
  }
  ${CompanyDetailsFragmentFragmentDoc}
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
export const TrainingDocument = gql`
  query training($catalogueId: Int, $userId: Int) {
    trainingContentCollection {
      items {
        pageHeading
        description
        lmsCtaLabel
        image {
          url
        }
        pageSubHeading
        step1Heading
        step1SubHeading
        step1Description
        step2Heading
        step2SubHeading
        step2Description
        step3Heading
        step3SubHeading
        step3Description
        live
      }
    }
    courseCatalogues(condition: { catalogueId: $catalogueId }) {
      nodes {
        course {
          courseId
          name
          technology
          image
          promoted
          trainingType
          description
          courseEnrollments(condition: { userId: $userId }) {
            nodes {
              id
              status
              url
              courseId
            }
          }
        }
      }
    }
  }
`;

/**
 * __useTrainingQuery__
 *
 * To run a query within a React component, call `useTrainingQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainingQuery({
 *   variables: {
 *      catalogueId: // value for 'catalogueId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useTrainingQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.TrainingQuery,
    OperationTypes.TrainingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.TrainingQuery,
    OperationTypes.TrainingQueryVariables
  >(TrainingDocument, options);
}
export function useTrainingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.TrainingQuery,
    OperationTypes.TrainingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.TrainingQuery,
    OperationTypes.TrainingQueryVariables
  >(TrainingDocument, options);
}
export type TrainingQueryHookResult = ReturnType<typeof useTrainingQuery>;
export type TrainingLazyQueryHookResult = ReturnType<
  typeof useTrainingLazyQuery
>;
export type TrainingQueryResult = Apollo.QueryResult<
  OperationTypes.TrainingQuery,
  OperationTypes.TrainingQueryVariables
>;
export const DoceboCatalogIdByMarketDomainDocument = gql`
  query DoceboCatalogIdByMarketDomain($domain: String!) {
    marketByDomain(domain: $domain) {
      doceboCatalogueId
    }
  }
`;

/**
 * __useDoceboCatalogIdByMarketDomainQuery__
 *
 * To run a query within a React component, call `useDoceboCatalogIdByMarketDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useDoceboCatalogIdByMarketDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDoceboCatalogIdByMarketDomainQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useDoceboCatalogIdByMarketDomainQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.DoceboCatalogIdByMarketDomainQuery,
    OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.DoceboCatalogIdByMarketDomainQuery,
    OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
  >(DoceboCatalogIdByMarketDomainDocument, options);
}
export function useDoceboCatalogIdByMarketDomainLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.DoceboCatalogIdByMarketDomainQuery,
    OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.DoceboCatalogIdByMarketDomainQuery,
    OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
  >(DoceboCatalogIdByMarketDomainDocument, options);
}
export type DoceboCatalogIdByMarketDomainQueryHookResult = ReturnType<
  typeof useDoceboCatalogIdByMarketDomainQuery
>;
export type DoceboCatalogIdByMarketDomainLazyQueryHookResult = ReturnType<
  typeof useDoceboCatalogIdByMarketDomainLazyQuery
>;
export type DoceboCatalogIdByMarketDomainQueryResult = Apollo.QueryResult<
  OperationTypes.DoceboCatalogIdByMarketDomainQuery,
  OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
>;
export const BulkImportDocument = gql`
  mutation bulkImport($input: BulkImportInput!) {
    bulkImport(input: $input) {
      systemsToInsert {
        bmiRef
      }
      systemsToUpdate {
        bmiRef
      }
      productsToInsert {
        bmiRef
      }
      productsToUpdate {
        bmiRef
      }
    }
  }
`;
export type BulkImportMutationFn = Apollo.MutationFunction<
  OperationTypes.BulkImportMutation,
  OperationTypes.BulkImportMutationVariables
>;

/**
 * __useBulkImportMutation__
 *
 * To run a mutation, you first call `useBulkImportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkImportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkImportMutation, { data, loading, error }] = useBulkImportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBulkImportMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.BulkImportMutation,
    OperationTypes.BulkImportMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.BulkImportMutation,
    OperationTypes.BulkImportMutationVariables
  >(BulkImportDocument, options);
}
export type BulkImportMutationHookResult = ReturnType<
  typeof useBulkImportMutation
>;
export type BulkImportMutationResult = Apollo.MutationResult<OperationTypes.BulkImportMutation>;
export type BulkImportMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.BulkImportMutation,
  OperationTypes.BulkImportMutationVariables
>;
