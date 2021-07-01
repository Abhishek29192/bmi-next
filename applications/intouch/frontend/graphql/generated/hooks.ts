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
        accountId
      }
    }
  }
`;
export const ImageFragmentFragmentDoc = gql`
  fragment ImageFragment on Asset {
    title
    description
    contentType
    fileName
    size
    url
    width
    height
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
export type UpdateCompanyDetailsMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateCompanyDetailsMutation>;
export type UpdateCompanyDetailsMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateCompanyDetailsMutation,
  OperationTypes.UpdateCompanyDetailsMutationVariables
>;
export const AccountByEmailDocument = gql`
  query accountByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      role
      marketId
      doceboUserId
      market {
        domain
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
      companyMembers {
        nodes {
          company {
            id
            status
          }
        }
      }
    }
  }
`;

/**
 * __useAccountByEmailQuery__
 *
 * To run a query within a React component, call `useAccountByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAccountByEmailQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.AccountByEmailQuery,
    OperationTypes.AccountByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.AccountByEmailQuery,
    OperationTypes.AccountByEmailQueryVariables
  >(AccountByEmailDocument, options);
}
export function useAccountByEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.AccountByEmailQuery,
    OperationTypes.AccountByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.AccountByEmailQuery,
    OperationTypes.AccountByEmailQueryVariables
  >(AccountByEmailDocument, options);
}
export type AccountByEmailQueryHookResult = ReturnType<
  typeof useAccountByEmailQuery
>;
export type AccountByEmailLazyQueryHookResult = ReturnType<
  typeof useAccountByEmailLazyQuery
>;
export type AccountByEmailQueryResult = Apollo.QueryResult<
  OperationTypes.AccountByEmailQuery,
  OperationTypes.AccountByEmailQueryVariables
>;
export const CreateAccountDocument = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      account {
        id
        role
        email
        firstName
        lastName
        marketId
        market {
          language
          doceboCompanyAdminBranchId
          doceboInstallersBranchId
        }
        companyMembers {
          nodes {
            company {
              id
              status
            }
          }
        }
      }
    }
  }
`;
export type CreateAccountMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateAccountMutation,
  OperationTypes.CreateAccountMutationVariables
>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateAccountMutation,
    OperationTypes.CreateAccountMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateAccountMutation,
    OperationTypes.CreateAccountMutationVariables
  >(CreateAccountDocument, options);
}
export type CreateAccountMutationHookResult = ReturnType<
  typeof useCreateAccountMutation
>;
export type CreateAccountMutationResult =
  Apollo.MutationResult<OperationTypes.CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateAccountMutation,
  OperationTypes.CreateAccountMutationVariables
>;
export const CreateDoceboUserDocument = gql`
  mutation createDoceboUser($input: UserCreateInput!) {
    createDoceboUser(input: $input) {
      success
      user_id
    }
  }
`;
export type CreateDoceboUserMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateDoceboUserMutation,
  OperationTypes.CreateDoceboUserMutationVariables
>;

/**
 * __useCreateDoceboUserMutation__
 *
 * To run a mutation, you first call `useCreateDoceboUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDoceboUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDoceboUserMutation, { data, loading, error }] = useCreateDoceboUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDoceboUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateDoceboUserMutation,
    OperationTypes.CreateDoceboUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateDoceboUserMutation,
    OperationTypes.CreateDoceboUserMutationVariables
  >(CreateDoceboUserDocument, options);
}
export type CreateDoceboUserMutationHookResult = ReturnType<
  typeof useCreateDoceboUserMutation
>;
export type CreateDoceboUserMutationResult =
  Apollo.MutationResult<OperationTypes.CreateDoceboUserMutation>;
export type CreateDoceboUserMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateDoceboUserMutation,
  OperationTypes.CreateDoceboUserMutationVariables
>;
export const UpdateAccountDocument = gql`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        id
        doceboUserId
      }
    }
  }
`;
export type UpdateAccountMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateAccountMutation,
  OperationTypes.UpdateAccountMutationVariables
>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateAccountMutation,
    OperationTypes.UpdateAccountMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateAccountMutation,
    OperationTypes.UpdateAccountMutationVariables
  >(UpdateAccountDocument, options);
}
export type UpdateAccountMutationHookResult = ReturnType<
  typeof useUpdateAccountMutation
>;
export type UpdateAccountMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateAccountMutation,
  OperationTypes.UpdateAccountMutationVariables
>;
export const UserByEmailDocument = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      user_id
    }
  }
`;

/**
 * __useUserByEmailQuery__
 *
 * To run a query within a React component, call `useUserByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUserByEmailQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.UserByEmailQuery,
    OperationTypes.UserByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.UserByEmailQuery,
    OperationTypes.UserByEmailQueryVariables
  >(UserByEmailDocument, options);
}
export function useUserByEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.UserByEmailQuery,
    OperationTypes.UserByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.UserByEmailQuery,
    OperationTypes.UserByEmailQueryVariables
  >(UserByEmailDocument, options);
}
export type UserByEmailQueryHookResult = ReturnType<typeof useUserByEmailQuery>;
export type UserByEmailLazyQueryHookResult = ReturnType<
  typeof useUserByEmailLazyQuery
>;
export type UserByEmailQueryResult = Apollo.QueryResult<
  OperationTypes.UserByEmailQuery,
  OperationTypes.UserByEmailQueryVariables
>;
export const InvitationsDocument = gql`
  query invitations($invitee: String!) {
    invitations(condition: { invitee: $invitee, status: NEW }) {
      nodes {
        id
        status
        invitee
        senderAccountId
      }
    }
  }
`;

/**
 * __useInvitationsQuery__
 *
 * To run a query within a React component, call `useInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvitationsQuery({
 *   variables: {
 *      invitee: // value for 'invitee'
 *   },
 * });
 */
export function useInvitationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.InvitationsQuery,
    OperationTypes.InvitationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.InvitationsQuery,
    OperationTypes.InvitationsQueryVariables
  >(InvitationsDocument, options);
}
export function useInvitationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.InvitationsQuery,
    OperationTypes.InvitationsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.InvitationsQuery,
    OperationTypes.InvitationsQueryVariables
  >(InvitationsDocument, options);
}
export type InvitationsQueryHookResult = ReturnType<typeof useInvitationsQuery>;
export type InvitationsLazyQueryHookResult = ReturnType<
  typeof useInvitationsLazyQuery
>;
export type InvitationsQueryResult = Apollo.QueryResult<
  OperationTypes.InvitationsQuery,
  OperationTypes.InvitationsQueryVariables
>;
export const CompleteInvitationDocument = gql`
  mutation completeInvitation($companyId: Int!) {
    completeInvitation(companyId: $companyId) {
      id
      role
      email
      firstName
      lastName
      marketId
      market {
        language
        domain
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
    }
  }
`;
export type CompleteInvitationMutationFn = Apollo.MutationFunction<
  OperationTypes.CompleteInvitationMutation,
  OperationTypes.CompleteInvitationMutationVariables
>;

/**
 * __useCompleteInvitationMutation__
 *
 * To run a mutation, you first call `useCompleteInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeInvitationMutation, { data, loading, error }] = useCompleteInvitationMutation({
 *   variables: {
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useCompleteInvitationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CompleteInvitationMutation,
    OperationTypes.CompleteInvitationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CompleteInvitationMutation,
    OperationTypes.CompleteInvitationMutationVariables
  >(CompleteInvitationDocument, options);
}
export type CompleteInvitationMutationHookResult = ReturnType<
  typeof useCompleteInvitationMutation
>;
export type CompleteInvitationMutationResult =
  Apollo.MutationResult<OperationTypes.CompleteInvitationMutation>;
export type CompleteInvitationMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CompleteInvitationMutation,
  OperationTypes.CompleteInvitationMutationVariables
>;
export const CreateSsoUrlDocument = gql`
  mutation createSSOUrl($username: String!, $path: String) {
    createSSOUrl(username: $username, path: $path) {
      url
    }
  }
`;
export type CreateSsoUrlMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateSsoUrlMutation,
  OperationTypes.CreateSsoUrlMutationVariables
>;

/**
 * __useCreateSsoUrlMutation__
 *
 * To run a mutation, you first call `useCreateSsoUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSsoUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSsoUrlMutation, { data, loading, error }] = useCreateSsoUrlMutation({
 *   variables: {
 *      username: // value for 'username'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useCreateSsoUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateSsoUrlMutation,
    OperationTypes.CreateSsoUrlMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateSsoUrlMutation,
    OperationTypes.CreateSsoUrlMutationVariables
  >(CreateSsoUrlDocument, options);
}
export type CreateSsoUrlMutationHookResult = ReturnType<
  typeof useCreateSsoUrlMutation
>;
export type CreateSsoUrlMutationResult =
  Apollo.MutationResult<OperationTypes.CreateSsoUrlMutation>;
export type CreateSsoUrlMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateSsoUrlMutation,
  OperationTypes.CreateSsoUrlMutationVariables
>;
export const ProductsAndSystemsDocument = gql`
  query ProductsAndSystems {
    products {
      nodes {
        id
        bmiRef
        family
        name
        brand
        published
        description
        brand
      }
    }
    systems {
      nodes {
        id
        bmiRef
        description
        name
        published
      }
    }
  }
`;

/**
 * __useProductsAndSystemsQuery__
 *
 * To run a query within a React component, call `useProductsAndSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsAndSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsAndSystemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductsAndSystemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.ProductsAndSystemsQuery,
    OperationTypes.ProductsAndSystemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.ProductsAndSystemsQuery,
    OperationTypes.ProductsAndSystemsQueryVariables
  >(ProductsAndSystemsDocument, options);
}
export function useProductsAndSystemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.ProductsAndSystemsQuery,
    OperationTypes.ProductsAndSystemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.ProductsAndSystemsQuery,
    OperationTypes.ProductsAndSystemsQueryVariables
  >(ProductsAndSystemsDocument, options);
}
export type ProductsAndSystemsQueryHookResult = ReturnType<
  typeof useProductsAndSystemsQuery
>;
export type ProductsAndSystemsLazyQueryHookResult = ReturnType<
  typeof useProductsAndSystemsLazyQuery
>;
export type ProductsAndSystemsQueryResult = Apollo.QueryResult<
  OperationTypes.ProductsAndSystemsQuery,
  OperationTypes.ProductsAndSystemsQueryVariables
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
export type BulkImportMutationResult =
  Apollo.MutationResult<OperationTypes.BulkImportMutation>;
export type BulkImportMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.BulkImportMutation,
  OperationTypes.BulkImportMutationVariables
>;
export const UpdateProductDocument = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
      }
    }
  }
`;
export type UpdateProductMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateProductMutation,
  OperationTypes.UpdateProductMutationVariables
>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateProductMutation,
    OperationTypes.UpdateProductMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateProductMutation,
    OperationTypes.UpdateProductMutationVariables
  >(UpdateProductDocument, options);
}
export type UpdateProductMutationHookResult = ReturnType<
  typeof useUpdateProductMutation
>;
export type UpdateProductMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateProductMutation,
  OperationTypes.UpdateProductMutationVariables
>;
export const UpdateSystemDocument = gql`
  mutation updateSystem($input: UpdateSystemInput!) {
    updateSystem(input: $input) {
      system {
        id
      }
    }
  }
`;
export type UpdateSystemMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateSystemMutation,
  OperationTypes.UpdateSystemMutationVariables
>;

/**
 * __useUpdateSystemMutation__
 *
 * To run a mutation, you first call `useUpdateSystemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemMutation, { data, loading, error }] = useUpdateSystemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateSystemMutation,
    OperationTypes.UpdateSystemMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateSystemMutation,
    OperationTypes.UpdateSystemMutationVariables
  >(UpdateSystemDocument, options);
}
export type UpdateSystemMutationHookResult = ReturnType<
  typeof useUpdateSystemMutation
>;
export type UpdateSystemMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateSystemMutation>;
export type UpdateSystemMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateSystemMutation,
  OperationTypes.UpdateSystemMutationVariables
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
export type CreateCompanyMutationResult =
  Apollo.MutationResult<OperationTypes.CreateCompanyMutation>;
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
export const GetPartnerBrandsDocument = gql`
  query GetPartnerBrands {
    marketContentCollection(limit: 1) {
      items {
        partnerBrandsCollection {
          items {
            name
            shortDescription
            image {
              ...ImageFragment
            }
            logo {
              ...ImageFragment
            }
          }
        }
      }
    }
  }
  ${ImageFragmentFragmentDoc}
`;

/**
 * __useGetPartnerBrandsQuery__
 *
 * To run a query within a React component, call `useGetPartnerBrandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPartnerBrandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPartnerBrandsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPartnerBrandsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetPartnerBrandsQuery,
    OperationTypes.GetPartnerBrandsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetPartnerBrandsQuery,
    OperationTypes.GetPartnerBrandsQueryVariables
  >(GetPartnerBrandsDocument, options);
}
export function useGetPartnerBrandsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetPartnerBrandsQuery,
    OperationTypes.GetPartnerBrandsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetPartnerBrandsQuery,
    OperationTypes.GetPartnerBrandsQueryVariables
  >(GetPartnerBrandsDocument, options);
}
export type GetPartnerBrandsQueryHookResult = ReturnType<
  typeof useGetPartnerBrandsQuery
>;
export type GetPartnerBrandsLazyQueryHookResult = ReturnType<
  typeof useGetPartnerBrandsLazyQuery
>;
export type GetPartnerBrandsQueryResult = Apollo.QueryResult<
  OperationTypes.GetPartnerBrandsQuery,
  OperationTypes.GetPartnerBrandsQueryVariables
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
