import * as OperationTypes from "./operations";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {};
export const ContactDetailsCollectionFragmentFragmentDoc = gql`
  fragment ContactDetailsCollectionFragment on ContactDetailsCollection {
    items {
      fullName
      subHeading
      email
      phoneNumber
    }
  }
`;
export const AddressLinesFragmentFragmentDoc = gql`
  fragment AddressLinesFragment on Address {
    firstLine
    secondLine
    town
    region
    country
    postcode
  }
`;
export const CompanyHeaderDetailsFragmentFragmentDoc = gql`
  fragment CompanyHeaderDetailsFragment on Company {
    businessType
    logo
    aboutUs
    tradingAddress {
      ...AddressLinesFragment
      coordinates {
        x
        y
      }
    }
    ownerFullname
    ownerPhone
    ownerEmail
    phone
    publicEmail
    website
    facebook
    linkedIn
  }
  ${AddressLinesFragmentFragmentDoc}
`;
export const CompanyRegisteredDetailsFragmentFragmentDoc = gql`
  fragment CompanyRegisteredDetailsFragment on Company {
    name
    referenceNumber
    registeredAddress {
      ...AddressLinesFragment
    }
    taxNumber
    tier
    companyOperationsByCompany {
      nodes {
        operation
      }
    }
  }
  ${AddressLinesFragmentFragmentDoc}
`;
export const CompanyAdminsFragmentFragmentDoc = gql`
  fragment CompanyAdminsFragment on Company {
    companyMembers {
      nodes {
        account {
          role
          id
          firstName
          lastName
          role
          phone
          email
          photo
        }
      }
    }
  }
`;
export const CompanyCertificationsFragmentDoc = gql`
  fragment CompanyCertifications on Company {
    certifications
  }
`;
export const CompanyDetailsFragmentFragmentDoc = gql`
  fragment CompanyDetailsFragment on Company {
    id
    ...CompanyHeaderDetailsFragment
    ...CompanyRegisteredDetailsFragment
    ...CompanyAdminsFragment
    ...CompanyCertifications
  }
  ${CompanyHeaderDetailsFragmentFragmentDoc}
  ${CompanyRegisteredDetailsFragmentFragmentDoc}
  ${CompanyAdminsFragmentFragmentDoc}
  ${CompanyCertificationsFragmentDoc}
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
export const GetGlobalDataDocument = gql`
  query GetGlobalData {
    marketContentCollection(limit: 1) {
      items {
        footerLinksCollection {
          items {
            title
            relativePath
          }
        }
        contactUsPage {
          title
          relativePath
        }
        externalLinkUrl
        externalLinkLabel
      }
    }
  }
`;

/**
 * __useGetGlobalDataQuery__
 *
 * To run a query within a React component, call `useGetGlobalDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetGlobalDataQuery,
    OperationTypes.GetGlobalDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetGlobalDataQuery,
    OperationTypes.GetGlobalDataQueryVariables
  >(GetGlobalDataDocument, options);
}
export function useGetGlobalDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetGlobalDataQuery,
    OperationTypes.GetGlobalDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetGlobalDataQuery,
    OperationTypes.GetGlobalDataQueryVariables
  >(GetGlobalDataDocument, options);
}
export type GetGlobalDataQueryHookResult = ReturnType<
  typeof useGetGlobalDataQuery
>;
export type GetGlobalDataLazyQueryHookResult = ReturnType<
  typeof useGetGlobalDataLazyQuery
>;
export type GetGlobalDataQueryResult = Apollo.QueryResult<
  OperationTypes.GetGlobalDataQuery,
  OperationTypes.GetGlobalDataQueryVariables
>;
export const InviteDocument = gql`
  mutation invite($input: InviteInput!) {
    invite(input: $input) {
      id
      invitee
      senderAccount {
        email
      }
    }
  }
`;
export type InviteMutationFn = Apollo.MutationFunction<
  OperationTypes.InviteMutation,
  OperationTypes.InviteMutationVariables
>;

/**
 * __useInviteMutation__
 *
 * To run a mutation, you first call `useInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMutation, { data, loading, error }] = useInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.InviteMutation,
    OperationTypes.InviteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.InviteMutation,
    OperationTypes.InviteMutationVariables
  >(InviteDocument, options);
}
export type InviteMutationHookResult = ReturnType<typeof useInviteMutation>;
export type InviteMutationResult =
  Apollo.MutationResult<OperationTypes.InviteMutation>;
export type InviteMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.InviteMutation,
  OperationTypes.InviteMutationVariables
>;
export const DeleteCompanyMemberDocument = gql`
  mutation deleteCompanyMember($id: Int!) {
    deleteCompanyMember(input: { id: $id }) {
      clientMutationId
    }
  }
`;
export type DeleteCompanyMemberMutationFn = Apollo.MutationFunction<
  OperationTypes.DeleteCompanyMemberMutation,
  OperationTypes.DeleteCompanyMemberMutationVariables
>;

/**
 * __useDeleteCompanyMemberMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyMemberMutation, { data, loading, error }] = useDeleteCompanyMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCompanyMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.DeleteCompanyMemberMutation,
    OperationTypes.DeleteCompanyMemberMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.DeleteCompanyMemberMutation,
    OperationTypes.DeleteCompanyMemberMutationVariables
  >(DeleteCompanyMemberDocument, options);
}
export type DeleteCompanyMemberMutationHookResult = ReturnType<
  typeof useDeleteCompanyMemberMutation
>;
export type DeleteCompanyMemberMutationResult =
  Apollo.MutationResult<OperationTypes.DeleteCompanyMemberMutation>;
export type DeleteCompanyMemberMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.DeleteCompanyMemberMutation,
  OperationTypes.DeleteCompanyMemberMutationVariables
>;
export const GetProjectDocument = gql`
  query GetProject($projectId: Int!) {
    project(id: $projectId) {
      id
      name
      technology
      roofArea
      startDate
      endDate
      description
      siteAddress {
        firstLine
        secondLine
        town
        region
        postcode
      }
      buildingOwnerFirstname
      buildingOwnerLastname
      buildingOwnerCompany
      buildingOwnerMail
      buildingOwnerAddress {
        firstLine
        secondLine
        town
        region
        postcode
      }
      guarantees {
        nodes {
          id
          guaranteeTypeId
          guaranteeType {
            name
            evidenceCategoriesCollection {
              items {
                name
                minimumUploads
              }
            }
          }
        }
      }
      evidenceItems {
        nodes {
          id
          name
          guaranteeId
          evidenceCategoryType
          customEvidenceCategoryId
          customEvidenceCategory {
            name
            minimumUploads
          }
        }
      }
      notes(orderBy: ID_DESC) {
        nodes {
          id
          body
          createdAt
        }
      }
      projectMembers {
        nodes {
          id
          accountId
          account {
            firstName
            lastName
            role
            certificationsByDoceboUserId {
              nodes {
                name
                technology
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetProjectQuery,
    OperationTypes.GetProjectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProjectQuery,
    OperationTypes.GetProjectQueryVariables
  >(GetProjectDocument, options);
}
export function useGetProjectLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProjectQuery,
    OperationTypes.GetProjectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProjectQuery,
    OperationTypes.GetProjectQueryVariables
  >(GetProjectDocument, options);
}
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<
  typeof useGetProjectLazyQuery
>;
export type GetProjectQueryResult = Apollo.QueryResult<
  OperationTypes.GetProjectQuery,
  OperationTypes.GetProjectQueryVariables
>;
export const DeleteProjectMemberDocument = gql`
  mutation deleteProjectMember($input: DeleteProjectMemberInput!) {
    deleteProjectMember(input: $input) {
      account {
        id
        firstName
        lastName
      }
    }
  }
`;
export type DeleteProjectMemberMutationFn = Apollo.MutationFunction<
  OperationTypes.DeleteProjectMemberMutation,
  OperationTypes.DeleteProjectMemberMutationVariables
>;

/**
 * __useDeleteProjectMemberMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMemberMutation, { data, loading, error }] = useDeleteProjectMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteProjectMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.DeleteProjectMemberMutation,
    OperationTypes.DeleteProjectMemberMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.DeleteProjectMemberMutation,
    OperationTypes.DeleteProjectMemberMutationVariables
  >(DeleteProjectMemberDocument, options);
}
export type DeleteProjectMemberMutationHookResult = ReturnType<
  typeof useDeleteProjectMemberMutation
>;
export type DeleteProjectMemberMutationResult =
  Apollo.MutationResult<OperationTypes.DeleteProjectMemberMutation>;
export type DeleteProjectMemberMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.DeleteProjectMemberMutation,
  OperationTypes.DeleteProjectMemberMutationVariables
>;
export const GetProjectCompanyMembersDocument = gql`
  query getProjectCompanyMembers($existAccounts: [Int!]) {
    companyMembers(filter: { accountId: { notIn: $existAccounts } }) {
      nodes {
        id
        accountId
        account {
          id
          firstName
          lastName
          email
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetProjectCompanyMembersQuery__
 *
 * To run a query within a React component, call `useGetProjectCompanyMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectCompanyMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectCompanyMembersQuery({
 *   variables: {
 *      existAccounts: // value for 'existAccounts'
 *   },
 * });
 */
export function useGetProjectCompanyMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetProjectCompanyMembersQuery,
    OperationTypes.GetProjectCompanyMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProjectCompanyMembersQuery,
    OperationTypes.GetProjectCompanyMembersQueryVariables
  >(GetProjectCompanyMembersDocument, options);
}
export function useGetProjectCompanyMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProjectCompanyMembersQuery,
    OperationTypes.GetProjectCompanyMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProjectCompanyMembersQuery,
    OperationTypes.GetProjectCompanyMembersQueryVariables
  >(GetProjectCompanyMembersDocument, options);
}
export type GetProjectCompanyMembersQueryHookResult = ReturnType<
  typeof useGetProjectCompanyMembersQuery
>;
export type GetProjectCompanyMembersLazyQueryHookResult = ReturnType<
  typeof useGetProjectCompanyMembersLazyQuery
>;
export type GetProjectCompanyMembersQueryResult = Apollo.QueryResult<
  OperationTypes.GetProjectCompanyMembersQuery,
  OperationTypes.GetProjectCompanyMembersQueryVariables
>;
export const CreateProjectMemberDocument = gql`
  mutation createProjectMember($input: CreateProjectMemberInput!) {
    createProjectMember(input: $input) {
      projectMember {
        id
        accountId
        account {
          id
          firstName
          lastName
          role
          certificationsByDoceboUserId {
            nodes {
              technology
            }
          }
        }
      }
    }
  }
`;
export type CreateProjectMemberMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateProjectMemberMutation,
  OperationTypes.CreateProjectMemberMutationVariables
>;

/**
 * __useCreateProjectMemberMutation__
 *
 * To run a mutation, you first call `useCreateProjectMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMemberMutation, { data, loading, error }] = useCreateProjectMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateProjectMemberMutation,
    OperationTypes.CreateProjectMemberMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateProjectMemberMutation,
    OperationTypes.CreateProjectMemberMutationVariables
  >(CreateProjectMemberDocument, options);
}
export type CreateProjectMemberMutationHookResult = ReturnType<
  typeof useCreateProjectMemberMutation
>;
export type CreateProjectMemberMutationResult =
  Apollo.MutationResult<OperationTypes.CreateProjectMemberMutation>;
export type CreateProjectMemberMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateProjectMemberMutation,
  OperationTypes.CreateProjectMemberMutationVariables
>;
export const AddProjectsMemberDocument = gql`
  mutation addProjectsMember($input: ProjectMembersAddInput!) {
    projectMembersAdd(input: $input) {
      projectMembers {
        projectId
        accountId
      }
    }
  }
`;
export type AddProjectsMemberMutationFn = Apollo.MutationFunction<
  OperationTypes.AddProjectsMemberMutation,
  OperationTypes.AddProjectsMemberMutationVariables
>;

/**
 * __useAddProjectsMemberMutation__
 *
 * To run a mutation, you first call `useAddProjectsMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectsMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProjectsMemberMutation, { data, loading, error }] = useAddProjectsMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProjectsMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.AddProjectsMemberMutation,
    OperationTypes.AddProjectsMemberMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.AddProjectsMemberMutation,
    OperationTypes.AddProjectsMemberMutationVariables
  >(AddProjectsMemberDocument, options);
}
export type AddProjectsMemberMutationHookResult = ReturnType<
  typeof useAddProjectsMemberMutation
>;
export type AddProjectsMemberMutationResult =
  Apollo.MutationResult<OperationTypes.AddProjectsMemberMutation>;
export type AddProjectsMemberMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.AddProjectsMemberMutation,
  OperationTypes.AddProjectsMemberMutationVariables
>;
export const AccountByEmailDocument = gql`
  query accountByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      role
      marketId
      firstName
      lastName
      email
      doceboUserId
      market {
        domain
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
        projectsEnabled
      }
      companyMembers {
        nodes {
          company {
            id
            status
            name
            tier
          }
        }
      }
      projectMembers {
        totalCount
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
export const GetContentArticleContentDocument = gql`
  query getContentArticleContent($relativePath: String!) {
    contentArticleCollection(where: { relativePath: $relativePath }, limit: 1) {
      items {
        title
        body {
          json
        }
      }
    }
  }
`;

/**
 * __useGetContentArticleContentQuery__
 *
 * To run a query within a React component, call `useGetContentArticleContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContentArticleContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContentArticleContentQuery({
 *   variables: {
 *      relativePath: // value for 'relativePath'
 *   },
 * });
 */
export function useGetContentArticleContentQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetContentArticleContentQuery,
    OperationTypes.GetContentArticleContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetContentArticleContentQuery,
    OperationTypes.GetContentArticleContentQueryVariables
  >(GetContentArticleContentDocument, options);
}
export function useGetContentArticleContentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetContentArticleContentQuery,
    OperationTypes.GetContentArticleContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetContentArticleContentQuery,
    OperationTypes.GetContentArticleContentQueryVariables
  >(GetContentArticleContentDocument, options);
}
export type GetContentArticleContentQueryHookResult = ReturnType<
  typeof useGetContentArticleContentQuery
>;
export type GetContentArticleContentLazyQueryHookResult = ReturnType<
  typeof useGetContentArticleContentLazyQuery
>;
export type GetContentArticleContentQueryResult = Apollo.QueryResult<
  OperationTypes.GetContentArticleContentQuery,
  OperationTypes.GetContentArticleContentQueryVariables
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
    contactDetailsCollection {
      ...ContactDetailsCollectionFragment
    }
  }
  ${CompanyDetailsFragmentFragmentDoc}
  ${ContactDetailsCollectionFragmentFragmentDoc}
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
export const GetProjectsDocument = gql`
  query GetProjects {
    projects {
      nodes {
        id
        name
        technology
        startDate
        endDate
        siteAddress {
          town
          postcode
        }
      }
    }
  }
`;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetProjectsQuery,
    OperationTypes.GetProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProjectsQuery,
    OperationTypes.GetProjectsQueryVariables
  >(GetProjectsDocument, options);
}
export function useGetProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProjectsQuery,
    OperationTypes.GetProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProjectsQuery,
    OperationTypes.GetProjectsQueryVariables
  >(GetProjectsDocument, options);
}
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<
  typeof useGetProjectsLazyQuery
>;
export type GetProjectsQueryResult = Apollo.QueryResult<
  OperationTypes.GetProjectsQuery,
  OperationTypes.GetProjectsQueryVariables
>;
export const CompanyMembersDocument = gql`
  query companyMembers($expiryDate: Datetime) {
    companyMembers {
      nodes {
        id
        company {
          name
        }
        account {
          id
          role
          email
          phone
          photo
          lastName
          firstName
          certificationsByDoceboUserId(
            filter: { expiryDate: { greaterThanOrEqualTo: $expiryDate } }
          ) {
            nodes {
              id
              name
              technology
              expiryDate
            }
          }
        }
      }
    }
  }
`;

/**
 * __useCompanyMembersQuery__
 *
 * To run a query within a React component, call `useCompanyMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyMembersQuery({
 *   variables: {
 *      expiryDate: // value for 'expiryDate'
 *   },
 * });
 */
export function useCompanyMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.CompanyMembersQuery,
    OperationTypes.CompanyMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.CompanyMembersQuery,
    OperationTypes.CompanyMembersQueryVariables
  >(CompanyMembersDocument, options);
}
export function useCompanyMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.CompanyMembersQuery,
    OperationTypes.CompanyMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.CompanyMembersQuery,
    OperationTypes.CompanyMembersQueryVariables
  >(CompanyMembersDocument, options);
}
export type CompanyMembersQueryHookResult = ReturnType<
  typeof useCompanyMembersQuery
>;
export type CompanyMembersLazyQueryHookResult = ReturnType<
  typeof useCompanyMembersLazyQuery
>;
export type CompanyMembersQueryResult = Apollo.QueryResult<
  OperationTypes.CompanyMembersQuery,
  OperationTypes.CompanyMembersQueryVariables
>;
export const UpdateRoleAccountDocument = gql`
  mutation UpdateRoleAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        id
      }
    }
  }
`;
export type UpdateRoleAccountMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateRoleAccountMutation,
  OperationTypes.UpdateRoleAccountMutationVariables
>;

/**
 * __useUpdateRoleAccountMutation__
 *
 * To run a mutation, you first call `useUpdateRoleAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleAccountMutation, { data, loading, error }] = useUpdateRoleAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateRoleAccountMutation,
    OperationTypes.UpdateRoleAccountMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateRoleAccountMutation,
    OperationTypes.UpdateRoleAccountMutationVariables
  >(UpdateRoleAccountDocument, options);
}
export type UpdateRoleAccountMutationHookResult = ReturnType<
  typeof useUpdateRoleAccountMutation
>;
export type UpdateRoleAccountMutationResult = Apollo.MutationResult<OperationTypes.UpdateRoleAccountMutation>;
export type UpdateRoleAccountMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateRoleAccountMutation,
  OperationTypes.UpdateRoleAccountMutationVariables
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
