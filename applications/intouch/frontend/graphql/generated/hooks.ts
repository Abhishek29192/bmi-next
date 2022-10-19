import * as OperationTypes from "./operations";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export const AddressLinesFragmentFragmentDoc = gql`
  fragment AddressLinesFragment on Address {
    id
    firstLine
    secondLine
    town
    region
    country
    postcode
    coordinates {
      x
      y
    }
  }
`;
export const ProjectDetailsProductFragmentFragmentDoc = gql`
  fragment ProjectDetailsProductFragment on Product {
    id
    name
    brand
    family
    description
  }
`;
export const ProjectMemberDetailsFragmentFragmentDoc = gql`
  fragment ProjectMemberDetailsFragment on ProjectMember {
    id
    accountId
    account {
      id
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
    isResponsibleInstaller
  }
`;
export const ProjectDetailsFragmentFragmentDoc = gql`
  fragment ProjectDetailsFragment on Project {
    id
    hidden
    name
    technology
    roofArea
    startDate
    endDate
    description
    siteAddress {
      ...AddressLinesFragment
    }
    buildingOwnerFirstname
    buildingOwnerLastname
    buildingOwnerCompany
    buildingOwnerMail
    buildingOwnerAddress {
      ...AddressLinesFragment
    }
    inspection
    inspectedAt
    guarantees {
      nodes {
        id
        guaranteeReferenceCode
        reviewerAccountId
        coverage
        languageCode
        guaranteeType {
          sys {
            id
          }
          name
          coverage
          displayName
          technology
          tiersAvailable
          evidenceCategoriesCollection {
            items {
              sys {
                id
              }
              referenceCode
              name
              minimumUploads
              description {
                json
              }
            }
          }
        }
        productByProductBmiRef {
          ...ProjectDetailsProductFragment
        }
        systemBySystemBmiRef {
          id
          name
          description
          systemMembersBySystemBmiRef {
            nodes {
              id
              productByProductBmiRef {
                ...ProjectDetailsProductFragment
              }
            }
          }
        }
        fileStorageId
        signedFileStorageUrl
        status
      }
    }
    evidenceItems {
      nodes {
        id
        name
        signedUrl
        guaranteeId
        evidenceCategoryType
        customEvidenceCategoryKey
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
        senderName
        createdAt
      }
    }
    projectMembers {
      nodes {
        ...ProjectMemberDetailsFragment
      }
    }
    company {
      id
      name
      tier
    }
  }
  ${AddressLinesFragmentFragmentDoc}
  ${ProjectDetailsProductFragmentFragmentDoc}
  ${ProjectMemberDetailsFragmentFragmentDoc}
`;
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
export const CompanyDetailsFragmentFragmentDoc = gql`
  fragment CompanyDetailsFragment on Company {
    name
    businessType
    logo
    aboutUs
    tradingAddress {
      id
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
      id
      ...AddressLinesFragment
    }
    taxNumber
    tier
    companyOperationsByCompany {
      nodes {
        id
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
          signedPhotoUrl
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
export const CompanyDocumentFragmentFragmentDoc = gql`
  fragment CompanyDocumentFragment on CompanyDocument {
    id
    document
    name
    documentType
    size
    signedDocumentUrl
    createdAt
    updatedAt
  }
`;
export const CompanyDocumentsFragmentFragmentDoc = gql`
  fragment CompanyDocumentsFragment on Company {
    companyDocuments {
      nodes {
        ...CompanyDocumentFragment
      }
    }
  }
  ${CompanyDocumentFragmentFragmentDoc}
`;
export const CompanyPageDetailsFragmentFragmentDoc = gql`
  fragment CompanyPageDetailsFragment on Company {
    id
    ...CompanyDetailsFragment
    ...CompanyRegisteredDetailsFragment
    ...CompanyAdminsFragment
    ...CompanyCertifications
    ...CompanyDocumentsFragment
    status
    isProfileComplete
  }
  ${CompanyDetailsFragmentFragmentDoc}
  ${CompanyRegisteredDetailsFragmentFragmentDoc}
  ${CompanyAdminsFragmentFragmentDoc}
  ${CompanyCertificationsFragmentDoc}
  ${CompanyDocumentsFragmentFragmentDoc}
`;
export const DoubleAcceptanceFragmentFragmentDoc = gql`
  fragment DoubleAcceptanceFragment on DoubleAcceptance {
    id
    tempToken
    expiryDate
    guaranteeId
    acceptanceDate
  }
`;
export const GuaranteeTemplateDetailFragmentFragmentDoc = gql`
  fragment GuaranteeTemplateDetailFragment on GuaranteeTemplate {
    displayName
    technology
    coverage
    languageCode
    languageDescriptor
    approvalMessage {
      event
      subject
      notificationBody
      emailBody
    }
    rejectionMessage {
      event
      subject
      notificationBody
      emailBody
    }
    logo {
      title
      url
    }
    maintenanceTemplate {
      fileName
      url
    }
    terms {
      fileName
      url
    }
    guaranteeScope
    signatory
    headingGuarantee
    headingScope
    headingProducts
    headingBeneficiary
    headingBuildingOwnerName
    headingBuildingAddress
    headingRoofArea
    headingRoofType
    headingContractor
    headingContractorName
    headingContractorId
    headingStartDate
    headingGuaranteeId
    headingValidity
    headingExpiry
    footer
    mailSubject
    mailBody
    filenamePrefix
    titleLine1
    titleLine2
    roofType
    onerousConditionsSummary
    onerousConditionsText {
      json
    }
  }
`;
export const ImageFragmentFragmentDoc = gql`
  fragment ImageFragment on Asset {
    sys {
      id
    }
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
export const MediaToolDetailsFragmentDoc = gql`
  fragment MediaToolDetails on MediaTool {
    __typename
    sys {
      id
    }
    name
    media {
      ...ImageFragment
    }
    thumbnail {
      ...ImageFragment
    }
    url
    cta
  }
  ${ImageFragmentFragmentDoc}
`;
export const ArticleContentLinksFragmentFragmentDoc = gql`
  fragment ArticleContentLinksFragment on ContentArticleBodyLinks {
    assets {
      block {
        sys {
          id
        }
        url
        title
        width
        height
        description
      }
    }
  }
`;
export const AccountPageDetailsFragmentFragmentDoc = gql`
  fragment AccountPageDetailsFragment on Account {
    id
    firstName
    lastName
    role
    email
    phone
    photo
    signedPhotoUrl
    companyMembers {
      nodes {
        company {
          id
          ...CompanyDetailsFragment
        }
      }
    }
    certificationsByDoceboUserId {
      nodes {
        id
        technology
        expiryDate
        name
      }
    }
  }
  ${CompanyDetailsFragmentFragmentDoc}
`;
export const UpdateProjectHiddenDocument = gql`
  mutation UpdateProjectHidden($projectId: Int!, $hidden: Boolean!) {
    updateProject(input: { id: $projectId, patch: { hidden: $hidden } }) {
      project {
        id
        hidden
      }
    }
  }
`;
export type UpdateProjectHiddenMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateProjectHiddenMutation,
  OperationTypes.UpdateProjectHiddenMutationVariables
>;

/**
 * __useUpdateProjectHiddenMutation__
 *
 * To run a mutation, you first call `useUpdateProjectHiddenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectHiddenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectHiddenMutation, { data, loading, error }] = useUpdateProjectHiddenMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      hidden: // value for 'hidden'
 *   },
 * });
 */
export function useUpdateProjectHiddenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateProjectHiddenMutation,
    OperationTypes.UpdateProjectHiddenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateProjectHiddenMutation,
    OperationTypes.UpdateProjectHiddenMutationVariables
  >(UpdateProjectHiddenDocument, options);
}
export type UpdateProjectHiddenMutationHookResult = ReturnType<
  typeof useUpdateProjectHiddenMutation
>;
export type UpdateProjectHiddenMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateProjectHiddenMutation>;
export type UpdateProjectHiddenMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateProjectHiddenMutation,
  OperationTypes.UpdateProjectHiddenMutationVariables
>;
export const UpdateProjectInspectionDocument = gql`
  mutation UpdateProjectInspection($projectId: Int!, $inspection: Boolean!) {
    updateProject(
      input: { id: $projectId, patch: { inspection: $inspection } }
    ) {
      project {
        id
        inspection
      }
    }
  }
`;
export type UpdateProjectInspectionMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateProjectInspectionMutation,
  OperationTypes.UpdateProjectInspectionMutationVariables
>;

/**
 * __useUpdateProjectInspectionMutation__
 *
 * To run a mutation, you first call `useUpdateProjectInspectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectInspectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectInspectionMutation, { data, loading, error }] = useUpdateProjectInspectionMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      inspection: // value for 'inspection'
 *   },
 * });
 */
export function useUpdateProjectInspectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateProjectInspectionMutation,
    OperationTypes.UpdateProjectInspectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateProjectInspectionMutation,
    OperationTypes.UpdateProjectInspectionMutationVariables
  >(UpdateProjectInspectionDocument, options);
}
export type UpdateProjectInspectionMutationHookResult = ReturnType<
  typeof useUpdateProjectInspectionMutation
>;
export type UpdateProjectInspectionMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateProjectInspectionMutation>;
export type UpdateProjectInspectionMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateProjectInspectionMutation,
  OperationTypes.UpdateProjectInspectionMutationVariables
>;
export const RestartGuaranteeDocument = gql`
  mutation RestartGuarantee($projectId: Int!) {
    restartGuarantee(projectId: $projectId)
  }
`;
export type RestartGuaranteeMutationFn = Apollo.MutationFunction<
  OperationTypes.RestartGuaranteeMutation,
  OperationTypes.RestartGuaranteeMutationVariables
>;

/**
 * __useRestartGuaranteeMutation__
 *
 * To run a mutation, you first call `useRestartGuaranteeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestartGuaranteeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restartGuaranteeMutation, { data, loading, error }] = useRestartGuaranteeMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useRestartGuaranteeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.RestartGuaranteeMutation,
    OperationTypes.RestartGuaranteeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.RestartGuaranteeMutation,
    OperationTypes.RestartGuaranteeMutationVariables
  >(RestartGuaranteeDocument, options);
}
export type RestartGuaranteeMutationHookResult = ReturnType<
  typeof useRestartGuaranteeMutation
>;
export type RestartGuaranteeMutationResult =
  Apollo.MutationResult<OperationTypes.RestartGuaranteeMutation>;
export type RestartGuaranteeMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.RestartGuaranteeMutation,
  OperationTypes.RestartGuaranteeMutationVariables
>;
export const MarkAllNotificationsAsReadDocument = gql`
  mutation markAllNotificationsAsRead($accountId: Int!) {
    markAllNotificationsAsRead(input: { accountToUpdateId: $accountId }) {
      notifications {
        id
        read
      }
    }
  }
`;
export type MarkAllNotificationsAsReadMutationFn = Apollo.MutationFunction<
  OperationTypes.MarkAllNotificationsAsReadMutation,
  OperationTypes.MarkAllNotificationsAsReadMutationVariables
>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.MarkAllNotificationsAsReadMutation,
    OperationTypes.MarkAllNotificationsAsReadMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.MarkAllNotificationsAsReadMutation,
    OperationTypes.MarkAllNotificationsAsReadMutationVariables
  >(MarkAllNotificationsAsReadDocument, options);
}
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<
  typeof useMarkAllNotificationsAsReadMutation
>;
export type MarkAllNotificationsAsReadMutationResult =
  Apollo.MutationResult<OperationTypes.MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions =
  Apollo.BaseMutationOptions<
    OperationTypes.MarkAllNotificationsAsReadMutation,
    OperationTypes.MarkAllNotificationsAsReadMutationVariables
  >;
export const GetGlobalDataDocument = gql`
  query GetGlobalData($accountId: Int!, $tag: String!) {
    marketContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
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
    notifications(last: 125, condition: { accountId: $accountId }) {
      nodes {
        body
        sendDate
        read
        id
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
 *      accountId: // value for 'accountId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetGlobalDataQuery(
  baseOptions: Apollo.QueryHookOptions<
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
export const CreateCompanyDocumentsDocument = gql`
  mutation createCompanyDocuments($input: CreateCompanyDocumentsInput!) {
    createCompanyDocuments(input: $input) {
      companyDocuments {
        ...CompanyDocumentFragment
      }
    }
  }
  ${CompanyDocumentFragmentFragmentDoc}
`;
export type CreateCompanyDocumentsMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateCompanyDocumentsMutation,
  OperationTypes.CreateCompanyDocumentsMutationVariables
>;

/**
 * __useCreateCompanyDocumentsMutation__
 *
 * To run a mutation, you first call `useCreateCompanyDocumentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyDocumentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyDocumentsMutation, { data, loading, error }] = useCreateCompanyDocumentsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyDocumentsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateCompanyDocumentsMutation,
    OperationTypes.CreateCompanyDocumentsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateCompanyDocumentsMutation,
    OperationTypes.CreateCompanyDocumentsMutationVariables
  >(CreateCompanyDocumentsDocument, options);
}
export type CreateCompanyDocumentsMutationHookResult = ReturnType<
  typeof useCreateCompanyDocumentsMutation
>;
export type CreateCompanyDocumentsMutationResult =
  Apollo.MutationResult<OperationTypes.CreateCompanyDocumentsMutation>;
export type CreateCompanyDocumentsMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateCompanyDocumentsMutation,
  OperationTypes.CreateCompanyDocumentsMutationVariables
>;
export const DeleteCompanyDocumentDocument = gql`
  mutation deleteCompanyDocument($input: DeleteCompanyDocumentInput!) {
    deleteCompanyDocument(input: $input) {
      companyDocument {
        id
        document
        createdAt
      }
    }
  }
`;
export type DeleteCompanyDocumentMutationFn = Apollo.MutationFunction<
  OperationTypes.DeleteCompanyDocumentMutation,
  OperationTypes.DeleteCompanyDocumentMutationVariables
>;

/**
 * __useDeleteCompanyDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteCompanyDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCompanyDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCompanyDocumentMutation, { data, loading, error }] = useDeleteCompanyDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteCompanyDocumentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.DeleteCompanyDocumentMutation,
    OperationTypes.DeleteCompanyDocumentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.DeleteCompanyDocumentMutation,
    OperationTypes.DeleteCompanyDocumentMutationVariables
  >(DeleteCompanyDocumentDocument, options);
}
export type DeleteCompanyDocumentMutationHookResult = ReturnType<
  typeof useDeleteCompanyDocumentMutation
>;
export type DeleteCompanyDocumentMutationResult =
  Apollo.MutationResult<OperationTypes.DeleteCompanyDocumentMutation>;
export type DeleteCompanyDocumentMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.DeleteCompanyDocumentMutation,
  OperationTypes.DeleteCompanyDocumentMutationVariables
>;
export const UpdateCompanyDetailsDocument = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyPageDetailsFragment
      }
    }
  }
  ${CompanyPageDetailsFragmentFragmentDoc}
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
export const ImportAccountsCompaniesFromCvsDocument = gql`
  mutation importAccountsCompaniesFromCVS(
    $input: ImportAccountsCompaniesFromCSVInput!
  ) {
    importAccountsCompaniesFromCVS(input: $input) {
      auth0Job {
        id
      }
      accounts {
        email
        role
        phone
        status
        firstName
        lastName
        created
        doceboUserId
        doceboUsername
      }
      companies {
        businessType
        name
        tier
        status
        taxNumber
        aboutUs
        logo
        phone
        publicEmail
        website
        linkedIn
        registeredAddress {
          firstLine
          secondLine
          town
          country
          postcode
          coordinates {
            x
            y
          }
        }
        companyMembers {
          nodes {
            account {
              role
              email
              status
              phone
              firstName
              lastName
              created
              doceboUserId
              doceboUsername
            }
          }
        }
      }
    }
  }
`;
export type ImportAccountsCompaniesFromCvsMutationFn = Apollo.MutationFunction<
  OperationTypes.ImportAccountsCompaniesFromCvsMutation,
  OperationTypes.ImportAccountsCompaniesFromCvsMutationVariables
>;

/**
 * __useImportAccountsCompaniesFromCvsMutation__
 *
 * To run a mutation, you first call `useImportAccountsCompaniesFromCvsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportAccountsCompaniesFromCvsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importAccountsCompaniesFromCvsMutation, { data, loading, error }] = useImportAccountsCompaniesFromCvsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useImportAccountsCompaniesFromCvsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.ImportAccountsCompaniesFromCvsMutation,
    OperationTypes.ImportAccountsCompaniesFromCvsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.ImportAccountsCompaniesFromCvsMutation,
    OperationTypes.ImportAccountsCompaniesFromCvsMutationVariables
  >(ImportAccountsCompaniesFromCvsDocument, options);
}
export type ImportAccountsCompaniesFromCvsMutationHookResult = ReturnType<
  typeof useImportAccountsCompaniesFromCvsMutation
>;
export type ImportAccountsCompaniesFromCvsMutationResult =
  Apollo.MutationResult<OperationTypes.ImportAccountsCompaniesFromCvsMutation>;
export type ImportAccountsCompaniesFromCvsMutationOptions =
  Apollo.BaseMutationOptions<
    OperationTypes.ImportAccountsCompaniesFromCvsMutation,
    OperationTypes.ImportAccountsCompaniesFromCvsMutationVariables
  >;
export const UpdateMarketDocument = gql`
  mutation updateMarket($input: UpdateMarketInput!) {
    updateMarket(input: $input) {
      query {
        markets {
          nodes {
            id
            language
            domain
            cmsSpaceId
            name
            sendName
            sendMailbox
            doceboInstallersBranchId
            doceboCompanyAdminBranchId
            merchandisingUrl
            merchandiseSso
            projectsEnabled
            locationBiasRadiusKm
            gtag
            gtagMarketMedia
          }
        }
      }
    }
  }
`;
export type UpdateMarketMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateMarketMutation,
  OperationTypes.UpdateMarketMutationVariables
>;

/**
 * __useUpdateMarketMutation__
 *
 * To run a mutation, you first call `useUpdateMarketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMarketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMarketMutation, { data, loading, error }] = useUpdateMarketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMarketMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateMarketMutation,
    OperationTypes.UpdateMarketMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateMarketMutation,
    OperationTypes.UpdateMarketMutationVariables
  >(UpdateMarketDocument, options);
}
export type UpdateMarketMutationHookResult = ReturnType<
  typeof useUpdateMarketMutation
>;
export type UpdateMarketMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateMarketMutation>;
export type UpdateMarketMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateMarketMutation,
  OperationTypes.UpdateMarketMutationVariables
>;
export const UpdateDoceboTiersByMarketDocument = gql`
  mutation updateDoceboTiersByMarket($input: UpdateDoceboTiersByMarketInput!) {
    updateDoceboTiersByMarket(input: $input) {
      id
      docebo_catalogue_id
      market_id
      tier_code
    }
  }
`;
export type UpdateDoceboTiersByMarketMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateDoceboTiersByMarketMutation,
  OperationTypes.UpdateDoceboTiersByMarketMutationVariables
>;

/**
 * __useUpdateDoceboTiersByMarketMutation__
 *
 * To run a mutation, you first call `useUpdateDoceboTiersByMarketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDoceboTiersByMarketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDoceboTiersByMarketMutation, { data, loading, error }] = useUpdateDoceboTiersByMarketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDoceboTiersByMarketMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateDoceboTiersByMarketMutation,
    OperationTypes.UpdateDoceboTiersByMarketMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateDoceboTiersByMarketMutation,
    OperationTypes.UpdateDoceboTiersByMarketMutationVariables
  >(UpdateDoceboTiersByMarketDocument, options);
}
export type UpdateDoceboTiersByMarketMutationHookResult = ReturnType<
  typeof useUpdateDoceboTiersByMarketMutation
>;
export type UpdateDoceboTiersByMarketMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateDoceboTiersByMarketMutation>;
export type UpdateDoceboTiersByMarketMutationOptions =
  Apollo.BaseMutationOptions<
    OperationTypes.UpdateDoceboTiersByMarketMutation,
    OperationTypes.UpdateDoceboTiersByMarketMutationVariables
  >;
export const UpdateMerchandiseTiersByMarketDocument = gql`
  mutation updateMerchandiseTiersByMarket(
    $input: UpdateMerchandiseTiersByMarketInput!
  ) {
    updateMerchandiseTiersByMarket(input: $input) {
      id
      merchandise_division_id
      market_id
      tier_code
    }
  }
`;
export type UpdateMerchandiseTiersByMarketMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateMerchandiseTiersByMarketMutation,
  OperationTypes.UpdateMerchandiseTiersByMarketMutationVariables
>;

/**
 * __useUpdateMerchandiseTiersByMarketMutation__
 *
 * To run a mutation, you first call `useUpdateMerchandiseTiersByMarketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMerchandiseTiersByMarketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMerchandiseTiersByMarketMutation, { data, loading, error }] = useUpdateMerchandiseTiersByMarketMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMerchandiseTiersByMarketMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateMerchandiseTiersByMarketMutation,
    OperationTypes.UpdateMerchandiseTiersByMarketMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateMerchandiseTiersByMarketMutation,
    OperationTypes.UpdateMerchandiseTiersByMarketMutationVariables
  >(UpdateMerchandiseTiersByMarketDocument, options);
}
export type UpdateMerchandiseTiersByMarketMutationHookResult = ReturnType<
  typeof useUpdateMerchandiseTiersByMarketMutation
>;
export type UpdateMerchandiseTiersByMarketMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateMerchandiseTiersByMarketMutation>;
export type UpdateMerchandiseTiersByMarketMutationOptions =
  Apollo.BaseMutationOptions<
    OperationTypes.UpdateMerchandiseTiersByMarketMutation,
    OperationTypes.UpdateMerchandiseTiersByMarketMutationVariables
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
      errorSystemsToUpdate {
        ref
        message
      }
      errorSystemsToInsert {
        ref
        message
      }
      errorProductsToUpdate {
        ref
        message
      }
      errorProductsToInsert {
        ref
        message
      }
      errorSystemMembersInsert {
        ref
        message
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
  mutation updateProduct($input: UpdateProductInput!, $marketId: Int) {
    updateProduct(input: $input) {
      query {
        products(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
          nodes {
            id
            name
            brand
            family
            bmiRef
            updatedAt
            published
            technology
            description
            maximumValidityYears
          }
        }
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
 *      marketId: // value for 'marketId'
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
  mutation updateSystem($input: UpdateSystemInput!, $marketId: Int) {
    updateSystem(input: $input) {
      query {
        systems(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
          nodes {
            id
            name
            bmiRef
            updatedAt
            published
            technology
            description
            maximumValidityYears
          }
        }
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
 *      marketId: // value for 'marketId'
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
export const CreateProjectDocument = gql`
  mutation createProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        ...ProjectDetailsFragment
      }
    }
  }
  ${ProjectDetailsFragmentFragmentDoc}
`;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateProjectMutation,
  OperationTypes.CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateProjectMutation,
    OperationTypes.CreateProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateProjectMutation,
    OperationTypes.CreateProjectMutationVariables
  >(CreateProjectDocument, options);
}
export type CreateProjectMutationHookResult = ReturnType<
  typeof useCreateProjectMutation
>;
export type CreateProjectMutationResult =
  Apollo.MutationResult<OperationTypes.CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateProjectMutation,
  OperationTypes.CreateProjectMutationVariables
>;
export const UpdateProjectDocument = gql`
  mutation updateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        ...ProjectDetailsFragment
      }
    }
  }
  ${ProjectDetailsFragmentFragmentDoc}
`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateProjectMutation,
  OperationTypes.UpdateProjectMutationVariables
>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateProjectMutation,
    OperationTypes.UpdateProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateProjectMutation,
    OperationTypes.UpdateProjectMutationVariables
  >(UpdateProjectDocument, options);
}
export type UpdateProjectMutationHookResult = ReturnType<
  typeof useUpdateProjectMutation
>;
export type UpdateProjectMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateProjectMutation,
  OperationTypes.UpdateProjectMutationVariables
>;
export const UpdateAccountProfileDocument = gql`
  mutation updateAccountProfile($updateAccountInput: UpdateAccountInput!) {
    updateAccount(input: $updateAccountInput) {
      account {
        ...AccountPageDetailsFragment
      }
    }
  }
  ${AccountPageDetailsFragmentFragmentDoc}
`;
export type UpdateAccountProfileMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateAccountProfileMutation,
  OperationTypes.UpdateAccountProfileMutationVariables
>;

/**
 * __useUpdateAccountProfileMutation__
 *
 * To run a mutation, you first call `useUpdateAccountProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountProfileMutation, { data, loading, error }] = useUpdateAccountProfileMutation({
 *   variables: {
 *      updateAccountInput: // value for 'updateAccountInput'
 *   },
 * });
 */
export function useUpdateAccountProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateAccountProfileMutation,
    OperationTypes.UpdateAccountProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateAccountProfileMutation,
    OperationTypes.UpdateAccountProfileMutationVariables
  >(UpdateAccountProfileDocument, options);
}
export type UpdateAccountProfileMutationHookResult = ReturnType<
  typeof useUpdateAccountProfileMutation
>;
export type UpdateAccountProfileMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateAccountProfileMutation>;
export type UpdateAccountProfileMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateAccountProfileMutation,
  OperationTypes.UpdateAccountProfileMutationVariables
>;
export const LeaveCompanyDocument = gql`
  mutation leaveCompany($accountId: Int!, $companyId: Int!, $marketId: Int!) {
    deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId(
      input: {
        accountId: $accountId
        companyId: $companyId
        marketId: $marketId
      }
    ) {
      clientMutationId
      account {
        ...AccountPageDetailsFragment
      }
    }
  }
  ${AccountPageDetailsFragmentFragmentDoc}
`;
export type LeaveCompanyMutationFn = Apollo.MutationFunction<
  OperationTypes.LeaveCompanyMutation,
  OperationTypes.LeaveCompanyMutationVariables
>;

/**
 * __useLeaveCompanyMutation__
 *
 * To run a mutation, you first call `useLeaveCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveCompanyMutation, { data, loading, error }] = useLeaveCompanyMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      companyId: // value for 'companyId'
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useLeaveCompanyMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.LeaveCompanyMutation,
    OperationTypes.LeaveCompanyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.LeaveCompanyMutation,
    OperationTypes.LeaveCompanyMutationVariables
  >(LeaveCompanyDocument, options);
}
export type LeaveCompanyMutationHookResult = ReturnType<
  typeof useLeaveCompanyMutation
>;
export type LeaveCompanyMutationResult =
  Apollo.MutationResult<OperationTypes.LeaveCompanyMutation>;
export type LeaveCompanyMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.LeaveCompanyMutation,
  OperationTypes.LeaveCompanyMutationVariables
>;
export const ResetPasswordDocument = gql`
  mutation resetPassword {
    resetPassword
  }
`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<
  OperationTypes.ResetPasswordMutation,
  OperationTypes.ResetPasswordMutationVariables
>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.ResetPasswordMutation,
    OperationTypes.ResetPasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.ResetPasswordMutation,
    OperationTypes.ResetPasswordMutationVariables
  >(ResetPasswordDocument, options);
}
export type ResetPasswordMutationHookResult = ReturnType<
  typeof useResetPasswordMutation
>;
export type ResetPasswordMutationResult =
  Apollo.MutationResult<OperationTypes.ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.ResetPasswordMutation,
  OperationTypes.ResetPasswordMutationVariables
>;
export const CreateCompanyDocument = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      company {
        id
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
export const GetProjectDocument = gql`
  query GetProject($projectId: Int!) {
    project(id: $projectId) {
      ...ProjectDetailsFragment
    }
  }
  ${ProjectDetailsFragmentFragmentDoc}
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
export const GetCompaniesReportDocument = gql`
  query GetCompaniesReport($marketId: Int!) {
    companies(condition: { marketId: $marketId }) {
      nodes {
        referenceNumber
        name
        tier
        registeredAddress {
          ...AddressLinesFragment
        }
        tradingAddress {
          ...AddressLinesFragment
          coordinates {
            x
            y
          }
        }
        logo
        aboutUs
        businessType
        companyOperationsByCompany {
          nodes {
            id
            operation
          }
        }
        isProfileComplete
        phone
        publicEmail
        website
        facebook
        linkedIn
        ownerFullname
        ownerEmail
        status
        taxNumber
        updatedAt
      }
    }
  }
  ${AddressLinesFragmentFragmentDoc}
`;

/**
 * __useGetCompaniesReportQuery__
 *
 * To run a query within a React component, call `useGetCompaniesReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesReportQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useGetCompaniesReportQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetCompaniesReportQuery,
    OperationTypes.GetCompaniesReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetCompaniesReportQuery,
    OperationTypes.GetCompaniesReportQueryVariables
  >(GetCompaniesReportDocument, options);
}
export function useGetCompaniesReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetCompaniesReportQuery,
    OperationTypes.GetCompaniesReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetCompaniesReportQuery,
    OperationTypes.GetCompaniesReportQueryVariables
  >(GetCompaniesReportDocument, options);
}
export type GetCompaniesReportQueryHookResult = ReturnType<
  typeof useGetCompaniesReportQuery
>;
export type GetCompaniesReportLazyQueryHookResult = ReturnType<
  typeof useGetCompaniesReportLazyQuery
>;
export type GetCompaniesReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetCompaniesReportQuery,
  OperationTypes.GetCompaniesReportQueryVariables
>;
export const GetGuaranteesReportDocument = gql`
  query GetGuaranteesReport($market: Int!) {
    guaranteesByMarket(market: $market) {
      nodes {
        id
        bmiReferenceId
        project {
          name
          technology
          roofArea
          company {
            name
          }
          hidden
          inspection
        }
        requestorAccountId
        requestorAccount {
          firstName
          lastName
        }
        coverage
        status
        languageCode
        guaranteeReferenceCode
        guaranteeType {
          name
        }
        startDate
        expiryDate
        signedFileStorageUrl
        fileStorageId
        systemBySystemBmiRef {
          name
          maximumValidityYears
        }
        productByProductBmiRef {
          name
          maximumValidityYears
        }
      }
    }
  }
`;

/**
 * __useGetGuaranteesReportQuery__
 *
 * To run a query within a React component, call `useGetGuaranteesReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGuaranteesReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGuaranteesReportQuery({
 *   variables: {
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetGuaranteesReportQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetGuaranteesReportQuery,
    OperationTypes.GetGuaranteesReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetGuaranteesReportQuery,
    OperationTypes.GetGuaranteesReportQueryVariables
  >(GetGuaranteesReportDocument, options);
}
export function useGetGuaranteesReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetGuaranteesReportQuery,
    OperationTypes.GetGuaranteesReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetGuaranteesReportQuery,
    OperationTypes.GetGuaranteesReportQueryVariables
  >(GetGuaranteesReportDocument, options);
}
export type GetGuaranteesReportQueryHookResult = ReturnType<
  typeof useGetGuaranteesReportQuery
>;
export type GetGuaranteesReportLazyQueryHookResult = ReturnType<
  typeof useGetGuaranteesReportLazyQuery
>;
export type GetGuaranteesReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetGuaranteesReportQuery,
  OperationTypes.GetGuaranteesReportQueryVariables
>;
export const GetProductsReportDocument = gql`
  query GetProductsReport($marketId: Int) {
    products(condition: { marketId: $marketId }) {
      nodes {
        id
        bmiRef
        name
        description
        technology
        family
        brand
        maximumValidityYears
        published
        updatedAt
      }
    }
  }
`;

/**
 * __useGetProductsReportQuery__
 *
 * To run a query within a React component, call `useGetProductsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsReportQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useGetProductsReportQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetProductsReportQuery,
    OperationTypes.GetProductsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProductsReportQuery,
    OperationTypes.GetProductsReportQueryVariables
  >(GetProductsReportDocument, options);
}
export function useGetProductsReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProductsReportQuery,
    OperationTypes.GetProductsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProductsReportQuery,
    OperationTypes.GetProductsReportQueryVariables
  >(GetProductsReportDocument, options);
}
export type GetProductsReportQueryHookResult = ReturnType<
  typeof useGetProductsReportQuery
>;
export type GetProductsReportLazyQueryHookResult = ReturnType<
  typeof useGetProductsReportLazyQuery
>;
export type GetProductsReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetProductsReportQuery,
  OperationTypes.GetProductsReportQueryVariables
>;
export const GetProjectsReportDocument = gql`
  query GetProjectsReport($market: Int!) {
    projectsByMarket(market: $market) {
      nodes {
        id
        name
        siteAddress {
          ...AddressLinesFragment
        }
        company {
          name
          status
        }
        technology
        roofArea
        guarantees(first: 1) {
          nodes {
            id
            coverage
            languageCode
            guaranteeReferenceCode
            guaranteeType {
              name
            }
            guaranteeTypes {
              items {
                name
              }
            }
          }
        }
        buildingOwnerFirstname
        buildingOwnerLastname
        buildingOwnerCompany
        startDate
        endDate
        hidden
        projectMembers {
          nodes {
            id
            account {
              email
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  }
  ${AddressLinesFragmentFragmentDoc}
`;

/**
 * __useGetProjectsReportQuery__
 *
 * To run a query within a React component, call `useGetProjectsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsReportQuery({
 *   variables: {
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetProjectsReportQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetProjectsReportQuery,
    OperationTypes.GetProjectsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProjectsReportQuery,
    OperationTypes.GetProjectsReportQueryVariables
  >(GetProjectsReportDocument, options);
}
export function useGetProjectsReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProjectsReportQuery,
    OperationTypes.GetProjectsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProjectsReportQuery,
    OperationTypes.GetProjectsReportQueryVariables
  >(GetProjectsReportDocument, options);
}
export type GetProjectsReportQueryHookResult = ReturnType<
  typeof useGetProjectsReportQuery
>;
export type GetProjectsReportLazyQueryHookResult = ReturnType<
  typeof useGetProjectsReportLazyQuery
>;
export type GetProjectsReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetProjectsReportQuery,
  OperationTypes.GetProjectsReportQueryVariables
>;
export const GetSystemsReportDocument = gql`
  query GetSystemsReport($marketId: Int) {
    systems(condition: { marketId: $marketId }) {
      nodes {
        id
        bmiRef
        name
        description
        technology
        maximumValidityYears
        systemMembersBySystemBmiRef {
          nodes {
            productBmiRef
          }
        }
        published
        updatedAt
      }
    }
  }
`;

/**
 * __useGetSystemsReportQuery__
 *
 * To run a query within a React component, call `useGetSystemsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemsReportQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useGetSystemsReportQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetSystemsReportQuery,
    OperationTypes.GetSystemsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetSystemsReportQuery,
    OperationTypes.GetSystemsReportQueryVariables
  >(GetSystemsReportDocument, options);
}
export function useGetSystemsReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetSystemsReportQuery,
    OperationTypes.GetSystemsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetSystemsReportQuery,
    OperationTypes.GetSystemsReportQueryVariables
  >(GetSystemsReportDocument, options);
}
export type GetSystemsReportQueryHookResult = ReturnType<
  typeof useGetSystemsReportQuery
>;
export type GetSystemsReportLazyQueryHookResult = ReturnType<
  typeof useGetSystemsReportLazyQuery
>;
export type GetSystemsReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetSystemsReportQuery,
  OperationTypes.GetSystemsReportQueryVariables
>;
export const GetTeamsReportDocument = gql`
  query GetTeamsReport($marketId: Int!) {
    accounts(condition: { marketId: $marketId }) {
      nodes {
        id
        email
        phone
        firstName
        lastName
        role
        status
        doceboUserId
        doceboUsername
        photo
        signedPhotoUrl
        migrationId
        migratedToAuth0
        createdAt
        updatedAt
        companyMembers {
          nodes {
            company {
              name
              tier
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetTeamsReportQuery__
 *
 * To run a query within a React component, call `useGetTeamsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamsReportQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useGetTeamsReportQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetTeamsReportQuery,
    OperationTypes.GetTeamsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetTeamsReportQuery,
    OperationTypes.GetTeamsReportQueryVariables
  >(GetTeamsReportDocument, options);
}
export function useGetTeamsReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetTeamsReportQuery,
    OperationTypes.GetTeamsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetTeamsReportQuery,
    OperationTypes.GetTeamsReportQueryVariables
  >(GetTeamsReportDocument, options);
}
export type GetTeamsReportQueryHookResult = ReturnType<
  typeof useGetTeamsReportQuery
>;
export type GetTeamsReportLazyQueryHookResult = ReturnType<
  typeof useGetTeamsReportLazyQuery
>;
export type GetTeamsReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetTeamsReportQuery,
  OperationTypes.GetTeamsReportQueryVariables
>;
export const GetEvidenceItemsReportDocument = gql`
  query GetEvidenceItemsReport($market: Int!) {
    evidenceItemsByMarket(market: $market) {
      nodes {
        evidenceCategoryType
        name
        uploaderAccountId
        createdAt
        project {
          name
          company {
            name
            tier
          }
          roofArea
        }
        guarantee {
          coverage
        }
        uploaderAccount {
          lastName
          firstName
          email
        }
      }
    }
  }
`;

/**
 * __useGetEvidenceItemsReportQuery__
 *
 * To run a query within a React component, call `useGetEvidenceItemsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvidenceItemsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvidenceItemsReportQuery({
 *   variables: {
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetEvidenceItemsReportQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetEvidenceItemsReportQuery,
    OperationTypes.GetEvidenceItemsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetEvidenceItemsReportQuery,
    OperationTypes.GetEvidenceItemsReportQueryVariables
  >(GetEvidenceItemsReportDocument, options);
}
export function useGetEvidenceItemsReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetEvidenceItemsReportQuery,
    OperationTypes.GetEvidenceItemsReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetEvidenceItemsReportQuery,
    OperationTypes.GetEvidenceItemsReportQueryVariables
  >(GetEvidenceItemsReportDocument, options);
}
export type GetEvidenceItemsReportQueryHookResult = ReturnType<
  typeof useGetEvidenceItemsReportQuery
>;
export type GetEvidenceItemsReportLazyQueryHookResult = ReturnType<
  typeof useGetEvidenceItemsReportLazyQuery
>;
export type GetEvidenceItemsReportQueryResult = Apollo.QueryResult<
  OperationTypes.GetEvidenceItemsReportQuery,
  OperationTypes.GetEvidenceItemsReportQueryVariables
>;
export const GetTierBenefitDocument = gql`
  query getTierBenefit($tag: String!) {
    tierBenefitCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        tier
        name
      }
    }
  }
`;

/**
 * __useGetTierBenefitQuery__
 *
 * To run a query within a React component, call `useGetTierBenefitQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTierBenefitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTierBenefitQuery({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetTierBenefitQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetTierBenefitQuery,
    OperationTypes.GetTierBenefitQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetTierBenefitQuery,
    OperationTypes.GetTierBenefitQueryVariables
  >(GetTierBenefitDocument, options);
}
export function useGetTierBenefitLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetTierBenefitQuery,
    OperationTypes.GetTierBenefitQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetTierBenefitQuery,
    OperationTypes.GetTierBenefitQueryVariables
  >(GetTierBenefitDocument, options);
}
export type GetTierBenefitQueryHookResult = ReturnType<
  typeof useGetTierBenefitQuery
>;
export type GetTierBenefitLazyQueryHookResult = ReturnType<
  typeof useGetTierBenefitLazyQuery
>;
export type GetTierBenefitQueryResult = Apollo.QueryResult<
  OperationTypes.GetTierBenefitQuery,
  OperationTypes.GetTierBenefitQueryVariables
>;
export const CreateGuaranteeDocument = gql`
  mutation createGuarantee($input: CreateGuaranteeInput!) {
    createGuarantee(input: $input) {
      guarantee {
        id
        coverage
        status
      }
    }
  }
`;
export type CreateGuaranteeMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateGuaranteeMutation,
  OperationTypes.CreateGuaranteeMutationVariables
>;

/**
 * __useCreateGuaranteeMutation__
 *
 * To run a mutation, you first call `useCreateGuaranteeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGuaranteeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGuaranteeMutation, { data, loading, error }] = useCreateGuaranteeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGuaranteeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateGuaranteeMutation,
    OperationTypes.CreateGuaranteeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateGuaranteeMutation,
    OperationTypes.CreateGuaranteeMutationVariables
  >(CreateGuaranteeDocument, options);
}
export type CreateGuaranteeMutationHookResult = ReturnType<
  typeof useCreateGuaranteeMutation
>;
export type CreateGuaranteeMutationResult =
  Apollo.MutationResult<OperationTypes.CreateGuaranteeMutation>;
export type CreateGuaranteeMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateGuaranteeMutation,
  OperationTypes.CreateGuaranteeMutationVariables
>;
export const CreateGuaranteePdfDocument = gql`
  mutation createGuaranteePdf($id: Int!) {
    createGuaranteePdf(id: $id) {
      messageId
    }
  }
`;
export type CreateGuaranteePdfMutationFn = Apollo.MutationFunction<
  OperationTypes.CreateGuaranteePdfMutation,
  OperationTypes.CreateGuaranteePdfMutationVariables
>;

/**
 * __useCreateGuaranteePdfMutation__
 *
 * To run a mutation, you first call `useCreateGuaranteePdfMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGuaranteePdfMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGuaranteePdfMutation, { data, loading, error }] = useCreateGuaranteePdfMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCreateGuaranteePdfMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.CreateGuaranteePdfMutation,
    OperationTypes.CreateGuaranteePdfMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.CreateGuaranteePdfMutation,
    OperationTypes.CreateGuaranteePdfMutationVariables
  >(CreateGuaranteePdfDocument, options);
}
export type CreateGuaranteePdfMutationHookResult = ReturnType<
  typeof useCreateGuaranteePdfMutation
>;
export type CreateGuaranteePdfMutationResult =
  Apollo.MutationResult<OperationTypes.CreateGuaranteePdfMutation>;
export type CreateGuaranteePdfMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.CreateGuaranteePdfMutation,
  OperationTypes.CreateGuaranteePdfMutationVariables
>;
export const UpdateGuaranteeDocument = gql`
  mutation updateGuarantee($input: UpdateGuaranteeInput!) {
    updateGuarantee(input: $input) {
      guarantee {
        id
        coverage
        status
      }
    }
  }
`;
export type UpdateGuaranteeMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateGuaranteeMutation,
  OperationTypes.UpdateGuaranteeMutationVariables
>;

/**
 * __useUpdateGuaranteeMutation__
 *
 * To run a mutation, you first call `useUpdateGuaranteeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGuaranteeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGuaranteeMutation, { data, loading, error }] = useUpdateGuaranteeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGuaranteeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateGuaranteeMutation,
    OperationTypes.UpdateGuaranteeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateGuaranteeMutation,
    OperationTypes.UpdateGuaranteeMutationVariables
  >(UpdateGuaranteeDocument, options);
}
export type UpdateGuaranteeMutationHookResult = ReturnType<
  typeof useUpdateGuaranteeMutation
>;
export type UpdateGuaranteeMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateGuaranteeMutation>;
export type UpdateGuaranteeMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateGuaranteeMutation,
  OperationTypes.UpdateGuaranteeMutationVariables
>;
export const AddProjectNoteDocument = gql`
  mutation addProjectNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      note {
        id
      }
    }
  }
`;
export type AddProjectNoteMutationFn = Apollo.MutationFunction<
  OperationTypes.AddProjectNoteMutation,
  OperationTypes.AddProjectNoteMutationVariables
>;

/**
 * __useAddProjectNoteMutation__
 *
 * To run a mutation, you first call `useAddProjectNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProjectNoteMutation, { data, loading, error }] = useAddProjectNoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProjectNoteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.AddProjectNoteMutation,
    OperationTypes.AddProjectNoteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.AddProjectNoteMutation,
    OperationTypes.AddProjectNoteMutationVariables
  >(AddProjectNoteDocument, options);
}
export type AddProjectNoteMutationHookResult = ReturnType<
  typeof useAddProjectNoteMutation
>;
export type AddProjectNoteMutationResult =
  Apollo.MutationResult<OperationTypes.AddProjectNoteMutation>;
export type AddProjectNoteMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.AddProjectNoteMutation,
  OperationTypes.AddProjectNoteMutationVariables
>;
export const DeleteProjectMemberDocument = gql`
  mutation deleteProjectMember($input: DeleteProjectMemberInput!) {
    deleteProjectMember(input: $input) {
      projectMember {
        ...ProjectMemberDetailsFragment
      }
    }
  }
  ${ProjectMemberDetailsFragmentFragmentDoc}
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
  query getProjectCompanyMembers($existAccounts: [Int!], $companyId: Int!) {
    companyMembers(
      filter: { accountId: { notIn: $existAccounts } }
      condition: { companyId: $companyId }
    ) {
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
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useGetProjectCompanyMembersQuery(
  baseOptions: Apollo.QueryHookOptions<
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
        ...ProjectMemberDetailsFragment
      }
    }
  }
  ${ProjectMemberDetailsFragmentFragmentDoc}
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
export const UpdateProjectMemberDocument = gql`
  mutation updateProjectMember(
    $input: UpdateProjectMemberInput!
    $projectId: Int!
  ) {
    updateProjectMember(input: $input) {
      projectMember {
        id
        projectId
        isResponsibleInstaller
      }
      query {
        projectMembers(condition: { projectId: $projectId }) {
          nodes {
            ...ProjectMemberDetailsFragment
          }
        }
      }
    }
  }
  ${ProjectMemberDetailsFragmentFragmentDoc}
`;
export type UpdateProjectMemberMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateProjectMemberMutation,
  OperationTypes.UpdateProjectMemberMutationVariables
>;

/**
 * __useUpdateProjectMemberMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMemberMutation, { data, loading, error }] = useUpdateProjectMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useUpdateProjectMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateProjectMemberMutation,
    OperationTypes.UpdateProjectMemberMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateProjectMemberMutation,
    OperationTypes.UpdateProjectMemberMutationVariables
  >(UpdateProjectMemberDocument, options);
}
export type UpdateProjectMemberMutationHookResult = ReturnType<
  typeof useUpdateProjectMemberMutation
>;
export type UpdateProjectMemberMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateProjectMemberMutation>;
export type UpdateProjectMemberMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateProjectMemberMutation,
  OperationTypes.UpdateProjectMemberMutationVariables
>;
export const AddEvidencesDocument = gql`
  mutation addEvidences($input: EvidenceItemsAddInput!) {
    evidenceItemsAdd(input: $input) {
      evidenceItems {
        id
        name
      }
    }
  }
`;
export type AddEvidencesMutationFn = Apollo.MutationFunction<
  OperationTypes.AddEvidencesMutation,
  OperationTypes.AddEvidencesMutationVariables
>;

/**
 * __useAddEvidencesMutation__
 *
 * To run a mutation, you first call `useAddEvidencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEvidencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEvidencesMutation, { data, loading, error }] = useAddEvidencesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddEvidencesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.AddEvidencesMutation,
    OperationTypes.AddEvidencesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.AddEvidencesMutation,
    OperationTypes.AddEvidencesMutationVariables
  >(AddEvidencesDocument, options);
}
export type AddEvidencesMutationHookResult = ReturnType<
  typeof useAddEvidencesMutation
>;
export type AddEvidencesMutationResult =
  Apollo.MutationResult<OperationTypes.AddEvidencesMutation>;
export type AddEvidencesMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.AddEvidencesMutation,
  OperationTypes.AddEvidencesMutationVariables
>;
export const ContentfulEvidenceCategoriesDocument = gql`
  query contentfulEvidenceCategories($tag: String!) {
    evidenceCategoryCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        sys {
          id
        }
        name
        referenceCode
        minimumUploads
      }
    }
  }
`;

/**
 * __useContentfulEvidenceCategoriesQuery__
 *
 * To run a query within a React component, call `useContentfulEvidenceCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useContentfulEvidenceCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContentfulEvidenceCategoriesQuery({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useContentfulEvidenceCategoriesQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.ContentfulEvidenceCategoriesQuery,
    OperationTypes.ContentfulEvidenceCategoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.ContentfulEvidenceCategoriesQuery,
    OperationTypes.ContentfulEvidenceCategoriesQueryVariables
  >(ContentfulEvidenceCategoriesDocument, options);
}
export function useContentfulEvidenceCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.ContentfulEvidenceCategoriesQuery,
    OperationTypes.ContentfulEvidenceCategoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.ContentfulEvidenceCategoriesQuery,
    OperationTypes.ContentfulEvidenceCategoriesQueryVariables
  >(ContentfulEvidenceCategoriesDocument, options);
}
export type ContentfulEvidenceCategoriesQueryHookResult = ReturnType<
  typeof useContentfulEvidenceCategoriesQuery
>;
export type ContentfulEvidenceCategoriesLazyQueryHookResult = ReturnType<
  typeof useContentfulEvidenceCategoriesLazyQuery
>;
export type ContentfulEvidenceCategoriesQueryResult = Apollo.QueryResult<
  OperationTypes.ContentfulEvidenceCategoriesQuery,
  OperationTypes.ContentfulEvidenceCategoriesQueryVariables
>;
export const DeleteEvidenceItemDocument = gql`
  mutation deleteEvidenceItem($input: DeleteEvidenceItemInput!) {
    deleteEvidenceItem(input: $input) {
      evidenceItem {
        id
        name
        attachment
        guaranteeId
        evidenceCategoryType
      }
    }
  }
`;
export type DeleteEvidenceItemMutationFn = Apollo.MutationFunction<
  OperationTypes.DeleteEvidenceItemMutation,
  OperationTypes.DeleteEvidenceItemMutationVariables
>;

/**
 * __useDeleteEvidenceItemMutation__
 *
 * To run a mutation, you first call `useDeleteEvidenceItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEvidenceItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEvidenceItemMutation, { data, loading, error }] = useDeleteEvidenceItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteEvidenceItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.DeleteEvidenceItemMutation,
    OperationTypes.DeleteEvidenceItemMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.DeleteEvidenceItemMutation,
    OperationTypes.DeleteEvidenceItemMutationVariables
  >(DeleteEvidenceItemDocument, options);
}
export type DeleteEvidenceItemMutationHookResult = ReturnType<
  typeof useDeleteEvidenceItemMutation
>;
export type DeleteEvidenceItemMutationResult =
  Apollo.MutationResult<OperationTypes.DeleteEvidenceItemMutation>;
export type DeleteEvidenceItemMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.DeleteEvidenceItemMutation,
  OperationTypes.DeleteEvidenceItemMutationVariables
>;
export const SearchProductsDocument = gql`
  query searchProducts($query: String!, $technology: Technology!) {
    searchProducts(query: $query, technology: $technology, first: 20) {
      totalCount
      nodes {
        id
        technology
        name
        description
        published
        brand
        family
        bmiRef
      }
    }
  }
`;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useSearchProductsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.SearchProductsQuery,
    OperationTypes.SearchProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.SearchProductsQuery,
    OperationTypes.SearchProductsQueryVariables
  >(SearchProductsDocument, options);
}
export function useSearchProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.SearchProductsQuery,
    OperationTypes.SearchProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.SearchProductsQuery,
    OperationTypes.SearchProductsQueryVariables
  >(SearchProductsDocument, options);
}
export type SearchProductsQueryHookResult = ReturnType<
  typeof useSearchProductsQuery
>;
export type SearchProductsLazyQueryHookResult = ReturnType<
  typeof useSearchProductsLazyQuery
>;
export type SearchProductsQueryResult = Apollo.QueryResult<
  OperationTypes.SearchProductsQuery,
  OperationTypes.SearchProductsQueryVariables
>;
export const SearchSystemsDocument = gql`
  query searchSystems($query: String!, $technology: Technology!) {
    searchSystems(query: $query, technology: $technology, first: 20) {
      totalCount
      nodes {
        id
        technology
        name
        description
        bmiRef
        systemMembersBySystemBmiRef {
          nodes {
            id
            productByProductBmiRef {
              id
              name
              family
              brand
            }
          }
        }
      }
    }
  }
`;

/**
 * __useSearchSystemsQuery__
 *
 * To run a query within a React component, call `useSearchSystemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSystemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSystemsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useSearchSystemsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.SearchSystemsQuery,
    OperationTypes.SearchSystemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.SearchSystemsQuery,
    OperationTypes.SearchSystemsQueryVariables
  >(SearchSystemsDocument, options);
}
export function useSearchSystemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.SearchSystemsQuery,
    OperationTypes.SearchSystemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.SearchSystemsQuery,
    OperationTypes.SearchSystemsQueryVariables
  >(SearchSystemsDocument, options);
}
export type SearchSystemsQueryHookResult = ReturnType<
  typeof useSearchSystemsQuery
>;
export type SearchSystemsLazyQueryHookResult = ReturnType<
  typeof useSearchSystemsLazyQuery
>;
export type SearchSystemsQueryResult = Apollo.QueryResult<
  OperationTypes.SearchSystemsQuery,
  OperationTypes.SearchSystemsQueryVariables
>;
export const GetProductGuaranteeTypesDocument = gql`
  query getProductGuaranteeTypes($technology: String, $tag: String!) {
    guaranteeTypeCollection(
      order: ranking_ASC
      where: {
        technology: $technology
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 10
    ) {
      items {
        sys {
          id
        }
        guaranteeReferenceCode
        name
        displayName
        technology
        coverage
        ranking
        tiersAvailable
        evidenceCategoriesCollection {
          items {
            name
            referenceCode
            minimumUploads
          }
        }
      }
    }
  }
`;

/**
 * __useGetProductGuaranteeTypesQuery__
 *
 * To run a query within a React component, call `useGetProductGuaranteeTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductGuaranteeTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductGuaranteeTypesQuery({
 *   variables: {
 *      technology: // value for 'technology'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetProductGuaranteeTypesQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetProductGuaranteeTypesQuery,
    OperationTypes.GetProductGuaranteeTypesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetProductGuaranteeTypesQuery,
    OperationTypes.GetProductGuaranteeTypesQueryVariables
  >(GetProductGuaranteeTypesDocument, options);
}
export function useGetProductGuaranteeTypesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetProductGuaranteeTypesQuery,
    OperationTypes.GetProductGuaranteeTypesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetProductGuaranteeTypesQuery,
    OperationTypes.GetProductGuaranteeTypesQueryVariables
  >(GetProductGuaranteeTypesDocument, options);
}
export type GetProductGuaranteeTypesQueryHookResult = ReturnType<
  typeof useGetProductGuaranteeTypesQuery
>;
export type GetProductGuaranteeTypesLazyQueryHookResult = ReturnType<
  typeof useGetProductGuaranteeTypesLazyQuery
>;
export type GetProductGuaranteeTypesQueryResult = Apollo.QueryResult<
  OperationTypes.GetProductGuaranteeTypesQuery,
  OperationTypes.GetProductGuaranteeTypesQueryVariables
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
        id
        domain
        language
        projectsEnabled
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
        merchandisingUrl
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
export const GetCompaniesByMarketDocument = gql`
  query GetCompaniesByMarket($marketId: Int!, $tag: String!) {
    companies(condition: { marketId: $marketId }) {
      nodes {
        ...CompanyPageDetailsFragment
        updatedAt
      }
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      ...ContactDetailsCollectionFragment
    }
  }
  ${CompanyPageDetailsFragmentFragmentDoc}
  ${ContactDetailsCollectionFragmentFragmentDoc}
`;

/**
 * __useGetCompaniesByMarketQuery__
 *
 * To run a query within a React component, call `useGetCompaniesByMarketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesByMarketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesByMarketQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetCompaniesByMarketQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetCompaniesByMarketQuery,
    OperationTypes.GetCompaniesByMarketQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetCompaniesByMarketQuery,
    OperationTypes.GetCompaniesByMarketQueryVariables
  >(GetCompaniesByMarketDocument, options);
}
export function useGetCompaniesByMarketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetCompaniesByMarketQuery,
    OperationTypes.GetCompaniesByMarketQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetCompaniesByMarketQuery,
    OperationTypes.GetCompaniesByMarketQueryVariables
  >(GetCompaniesByMarketDocument, options);
}
export type GetCompaniesByMarketQueryHookResult = ReturnType<
  typeof useGetCompaniesByMarketQuery
>;
export type GetCompaniesByMarketLazyQueryHookResult = ReturnType<
  typeof useGetCompaniesByMarketLazyQuery
>;
export type GetCompaniesByMarketQueryResult = Apollo.QueryResult<
  OperationTypes.GetCompaniesByMarketQuery,
  OperationTypes.GetCompaniesByMarketQueryVariables
>;
export const GetCompanyDocument = gql`
  query GetCompany($companyId: Int!, $tag: String!) {
    company(id: $companyId) {
      ...CompanyPageDetailsFragment
    }
    contactDetailsCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      ...ContactDetailsCollectionFragment
    }
  }
  ${CompanyPageDetailsFragmentFragmentDoc}
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
 *      tag: // value for 'tag'
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
export const GetOperationTypeCollectionDocument = gql`
  query GetOperationTypeCollection($tag: String!) {
    operationTypeCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        type
        displayName
      }
    }
  }
`;

/**
 * __useGetOperationTypeCollectionQuery__
 *
 * To run a query within a React component, call `useGetOperationTypeCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOperationTypeCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOperationTypeCollectionQuery({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetOperationTypeCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetOperationTypeCollectionQuery,
    OperationTypes.GetOperationTypeCollectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetOperationTypeCollectionQuery,
    OperationTypes.GetOperationTypeCollectionQueryVariables
  >(GetOperationTypeCollectionDocument, options);
}
export function useGetOperationTypeCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetOperationTypeCollectionQuery,
    OperationTypes.GetOperationTypeCollectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetOperationTypeCollectionQuery,
    OperationTypes.GetOperationTypeCollectionQueryVariables
  >(GetOperationTypeCollectionDocument, options);
}
export type GetOperationTypeCollectionQueryHookResult = ReturnType<
  typeof useGetOperationTypeCollectionQuery
>;
export type GetOperationTypeCollectionLazyQueryHookResult = ReturnType<
  typeof useGetOperationTypeCollectionLazyQuery
>;
export type GetOperationTypeCollectionQueryResult = Apollo.QueryResult<
  OperationTypes.GetOperationTypeCollectionQuery,
  OperationTypes.GetOperationTypeCollectionQueryVariables
>;
export const QueryDoceboTiersByMarketIdDocument = gql`
  query queryDoceboTiersByMarketId($marketId: Int!) {
    doceboTiers(condition: { marketId: $marketId }) {
      nodes {
        tierCode
        doceboCatalogueId
      }
    }
  }
`;

/**
 * __useQueryDoceboTiersByMarketIdQuery__
 *
 * To run a query within a React component, call `useQueryDoceboTiersByMarketIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryDoceboTiersByMarketIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryDoceboTiersByMarketIdQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useQueryDoceboTiersByMarketIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.QueryDoceboTiersByMarketIdQuery,
    OperationTypes.QueryDoceboTiersByMarketIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.QueryDoceboTiersByMarketIdQuery,
    OperationTypes.QueryDoceboTiersByMarketIdQueryVariables
  >(QueryDoceboTiersByMarketIdDocument, options);
}
export function useQueryDoceboTiersByMarketIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.QueryDoceboTiersByMarketIdQuery,
    OperationTypes.QueryDoceboTiersByMarketIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.QueryDoceboTiersByMarketIdQuery,
    OperationTypes.QueryDoceboTiersByMarketIdQueryVariables
  >(QueryDoceboTiersByMarketIdDocument, options);
}
export type QueryDoceboTiersByMarketIdQueryHookResult = ReturnType<
  typeof useQueryDoceboTiersByMarketIdQuery
>;
export type QueryDoceboTiersByMarketIdLazyQueryHookResult = ReturnType<
  typeof useQueryDoceboTiersByMarketIdLazyQuery
>;
export type QueryDoceboTiersByMarketIdQueryResult = Apollo.QueryResult<
  OperationTypes.QueryDoceboTiersByMarketIdQuery,
  OperationTypes.QueryDoceboTiersByMarketIdQueryVariables
>;
export const GetDoubleAcceptanceByValidTempTokenDocument = gql`
  mutation getDoubleAcceptanceByValidTempToken(
    $input: GetDoubleAcceptanceByValidTempTokenInput!
  ) {
    getDoubleAcceptanceByValidTempToken(input: $input) {
      id
      tempToken
      expiryDate
      guaranteeId
      acceptanceDate
      maximumValidityYears
      technology
      languageCode
      coverage
    }
  }
`;
export type GetDoubleAcceptanceByValidTempTokenMutationFn =
  Apollo.MutationFunction<
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutation,
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutationVariables
  >;

/**
 * __useGetDoubleAcceptanceByValidTempTokenMutation__
 *
 * To run a mutation, you first call `useGetDoubleAcceptanceByValidTempTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetDoubleAcceptanceByValidTempTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getDoubleAcceptanceByValidTempTokenMutation, { data, loading, error }] = useGetDoubleAcceptanceByValidTempTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDoubleAcceptanceByValidTempTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutation,
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutation,
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutationVariables
  >(GetDoubleAcceptanceByValidTempTokenDocument, options);
}
export type GetDoubleAcceptanceByValidTempTokenMutationHookResult = ReturnType<
  typeof useGetDoubleAcceptanceByValidTempTokenMutation
>;
export type GetDoubleAcceptanceByValidTempTokenMutationResult =
  Apollo.MutationResult<OperationTypes.GetDoubleAcceptanceByValidTempTokenMutation>;
export type GetDoubleAcceptanceByValidTempTokenMutationOptions =
  Apollo.BaseMutationOptions<
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutation,
    OperationTypes.GetDoubleAcceptanceByValidTempTokenMutationVariables
  >;
export const UpdateDoubleAcceptanceDocument = gql`
  mutation updateDoubleAcceptance($input: UpdateDoubleAcceptanceInput!) {
    updateDoubleAcceptance(input: $input) {
      doubleAcceptance {
        ...DoubleAcceptanceFragment
      }
    }
  }
  ${DoubleAcceptanceFragmentFragmentDoc}
`;
export type UpdateDoubleAcceptanceMutationFn = Apollo.MutationFunction<
  OperationTypes.UpdateDoubleAcceptanceMutation,
  OperationTypes.UpdateDoubleAcceptanceMutationVariables
>;

/**
 * __useUpdateDoubleAcceptanceMutation__
 *
 * To run a mutation, you first call `useUpdateDoubleAcceptanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDoubleAcceptanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDoubleAcceptanceMutation, { data, loading, error }] = useUpdateDoubleAcceptanceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDoubleAcceptanceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.UpdateDoubleAcceptanceMutation,
    OperationTypes.UpdateDoubleAcceptanceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.UpdateDoubleAcceptanceMutation,
    OperationTypes.UpdateDoubleAcceptanceMutationVariables
  >(UpdateDoubleAcceptanceDocument, options);
}
export type UpdateDoubleAcceptanceMutationHookResult = ReturnType<
  typeof useUpdateDoubleAcceptanceMutation
>;
export type UpdateDoubleAcceptanceMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateDoubleAcceptanceMutation>;
export type UpdateDoubleAcceptanceMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateDoubleAcceptanceMutation,
  OperationTypes.UpdateDoubleAcceptanceMutationVariables
>;
export const ReleaseGuaranteePdfDocument = gql`
  mutation releaseGuaranteePdf($input: ReleaseGuaranteePdfInput!) {
    releaseGuaranteePdf(input: $input) {
      messageId
    }
  }
`;
export type ReleaseGuaranteePdfMutationFn = Apollo.MutationFunction<
  OperationTypes.ReleaseGuaranteePdfMutation,
  OperationTypes.ReleaseGuaranteePdfMutationVariables
>;

/**
 * __useReleaseGuaranteePdfMutation__
 *
 * To run a mutation, you first call `useReleaseGuaranteePdfMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleaseGuaranteePdfMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releaseGuaranteePdfMutation, { data, loading, error }] = useReleaseGuaranteePdfMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReleaseGuaranteePdfMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.ReleaseGuaranteePdfMutation,
    OperationTypes.ReleaseGuaranteePdfMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.ReleaseGuaranteePdfMutation,
    OperationTypes.ReleaseGuaranteePdfMutationVariables
  >(ReleaseGuaranteePdfDocument, options);
}
export type ReleaseGuaranteePdfMutationHookResult = ReturnType<
  typeof useReleaseGuaranteePdfMutation
>;
export type ReleaseGuaranteePdfMutationResult =
  Apollo.MutationResult<OperationTypes.ReleaseGuaranteePdfMutation>;
export type ReleaseGuaranteePdfMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.ReleaseGuaranteePdfMutation,
  OperationTypes.ReleaseGuaranteePdfMutationVariables
>;
export const GetGuaranteeTemplatesDocument = gql`
  query getGuaranteeTemplates(
    $technology: String!
    $coverage: String!
    $language: String
    $tag: String!
  ) {
    guaranteeTemplateCollection(
      where: {
        coverage: $coverage
        technology: $technology
        languageCode: $language
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        sys {
          id
        }
        ...GuaranteeTemplateDetailFragment
      }
    }
  }
  ${GuaranteeTemplateDetailFragmentFragmentDoc}
`;

/**
 * __useGetGuaranteeTemplatesQuery__
 *
 * To run a query within a React component, call `useGetGuaranteeTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGuaranteeTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGuaranteeTemplatesQuery({
 *   variables: {
 *      technology: // value for 'technology'
 *      coverage: // value for 'coverage'
 *      language: // value for 'language'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetGuaranteeTemplatesQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetGuaranteeTemplatesQuery,
    OperationTypes.GetGuaranteeTemplatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetGuaranteeTemplatesQuery,
    OperationTypes.GetGuaranteeTemplatesQueryVariables
  >(GetGuaranteeTemplatesDocument, options);
}
export function useGetGuaranteeTemplatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetGuaranteeTemplatesQuery,
    OperationTypes.GetGuaranteeTemplatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetGuaranteeTemplatesQuery,
    OperationTypes.GetGuaranteeTemplatesQueryVariables
  >(GetGuaranteeTemplatesDocument, options);
}
export type GetGuaranteeTemplatesQueryHookResult = ReturnType<
  typeof useGetGuaranteeTemplatesQuery
>;
export type GetGuaranteeTemplatesLazyQueryHookResult = ReturnType<
  typeof useGetGuaranteeTemplatesLazyQuery
>;
export type GetGuaranteeTemplatesQueryResult = Apollo.QueryResult<
  OperationTypes.GetGuaranteeTemplatesQuery,
  OperationTypes.GetGuaranteeTemplatesQueryVariables
>;
export const GetMarketsByDomainDocument = gql`
  query getMarketsByDomain($domain: String!) {
    markets(condition: { domain: $domain }) {
      nodes {
        id
        name
        cmsSpaceId
        language
        domain
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        merchandiseSso
        projectsEnabled
        gtag
        gtagMarketMedia
        sendName
        sendMailbox
        locationBiasRadiusKm
        geoMiddle {
          x
          y
        }
      }
    }
  }
`;

/**
 * __useGetMarketsByDomainQuery__
 *
 * To run a query within a React component, call `useGetMarketsByDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarketsByDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarketsByDomainQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useGetMarketsByDomainQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetMarketsByDomainQuery,
    OperationTypes.GetMarketsByDomainQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetMarketsByDomainQuery,
    OperationTypes.GetMarketsByDomainQueryVariables
  >(GetMarketsByDomainDocument, options);
}
export function useGetMarketsByDomainLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetMarketsByDomainQuery,
    OperationTypes.GetMarketsByDomainQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetMarketsByDomainQuery,
    OperationTypes.GetMarketsByDomainQueryVariables
  >(GetMarketsByDomainDocument, options);
}
export type GetMarketsByDomainQueryHookResult = ReturnType<
  typeof useGetMarketsByDomainQuery
>;
export type GetMarketsByDomainLazyQueryHookResult = ReturnType<
  typeof useGetMarketsByDomainLazyQuery
>;
export type GetMarketsByDomainQueryResult = Apollo.QueryResult<
  OperationTypes.GetMarketsByDomainQuery,
  OperationTypes.GetMarketsByDomainQueryVariables
>;
export const GetMediaFoldersDocument = gql`
  query getMediaFolders($tag: String!) {
    marketContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        mediaLibraryRootCollection {
          items {
            __typename
            sys {
              id
            }
            name
          }
        }
      }
    }
    mediaFolderCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      total
      items {
        __typename
        sys {
          id
        }
        name
        childrenCollection {
          total
          items {
            ... on MediaFolder {
              __typename
              sys {
                id
              }
              name
            }
            ... on MediaTool {
              __typename
              sys {
                id
              }
              name
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetMediaFoldersQuery__
 *
 * To run a query within a React component, call `useGetMediaFoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMediaFoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMediaFoldersQuery({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetMediaFoldersQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetMediaFoldersQuery,
    OperationTypes.GetMediaFoldersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetMediaFoldersQuery,
    OperationTypes.GetMediaFoldersQueryVariables
  >(GetMediaFoldersDocument, options);
}
export function useGetMediaFoldersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetMediaFoldersQuery,
    OperationTypes.GetMediaFoldersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetMediaFoldersQuery,
    OperationTypes.GetMediaFoldersQueryVariables
  >(GetMediaFoldersDocument, options);
}
export type GetMediaFoldersQueryHookResult = ReturnType<
  typeof useGetMediaFoldersQuery
>;
export type GetMediaFoldersLazyQueryHookResult = ReturnType<
  typeof useGetMediaFoldersLazyQuery
>;
export type GetMediaFoldersQueryResult = Apollo.QueryResult<
  OperationTypes.GetMediaFoldersQuery,
  OperationTypes.GetMediaFoldersQueryVariables
>;
export const GetMediaFolderContentsDocument = gql`
  query getMediaFolderContents($mediaFolderId: String!, $tag: String!) {
    mediaFolderCollection(
      where: {
        sys: { id: $mediaFolderId }
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        __typename
        sys {
          id
        }
        name
        childrenCollection {
          total
          items {
            ... on MediaTool {
              ...MediaToolDetails
            }
            ... on MediaFolder {
              __typename
              sys {
                id
              }
              name
            }
          }
        }
      }
    }
  }
  ${MediaToolDetailsFragmentDoc}
`;

/**
 * __useGetMediaFolderContentsQuery__
 *
 * To run a query within a React component, call `useGetMediaFolderContentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMediaFolderContentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMediaFolderContentsQuery({
 *   variables: {
 *      mediaFolderId: // value for 'mediaFolderId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetMediaFolderContentsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetMediaFolderContentsQuery,
    OperationTypes.GetMediaFolderContentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetMediaFolderContentsQuery,
    OperationTypes.GetMediaFolderContentsQueryVariables
  >(GetMediaFolderContentsDocument, options);
}
export function useGetMediaFolderContentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetMediaFolderContentsQuery,
    OperationTypes.GetMediaFolderContentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetMediaFolderContentsQuery,
    OperationTypes.GetMediaFolderContentsQueryVariables
  >(GetMediaFolderContentsDocument, options);
}
export type GetMediaFolderContentsQueryHookResult = ReturnType<
  typeof useGetMediaFolderContentsQuery
>;
export type GetMediaFolderContentsLazyQueryHookResult = ReturnType<
  typeof useGetMediaFolderContentsLazyQuery
>;
export type GetMediaFolderContentsQueryResult = Apollo.QueryResult<
  OperationTypes.GetMediaFolderContentsQuery,
  OperationTypes.GetMediaFolderContentsQueryVariables
>;
export const PerformMerchandiseSsoDocument = gql`
  mutation performMerchandiseSso($email: String!) {
    performMerchandiseSso(email: $email)
  }
`;
export type PerformMerchandiseSsoMutationFn = Apollo.MutationFunction<
  OperationTypes.PerformMerchandiseSsoMutation,
  OperationTypes.PerformMerchandiseSsoMutationVariables
>;

/**
 * __usePerformMerchandiseSsoMutation__
 *
 * To run a mutation, you first call `usePerformMerchandiseSsoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformMerchandiseSsoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performMerchandiseSsoMutation, { data, loading, error }] = usePerformMerchandiseSsoMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function usePerformMerchandiseSsoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.PerformMerchandiseSsoMutation,
    OperationTypes.PerformMerchandiseSsoMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.PerformMerchandiseSsoMutation,
    OperationTypes.PerformMerchandiseSsoMutationVariables
  >(PerformMerchandiseSsoDocument, options);
}
export type PerformMerchandiseSsoMutationHookResult = ReturnType<
  typeof usePerformMerchandiseSsoMutation
>;
export type PerformMerchandiseSsoMutationResult =
  Apollo.MutationResult<OperationTypes.PerformMerchandiseSsoMutation>;
export type PerformMerchandiseSsoMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.PerformMerchandiseSsoMutation,
  OperationTypes.PerformMerchandiseSsoMutationVariables
>;
export const AccountInfoByEmailDocument = gql`
  query accountInfoByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      role
      marketId
      firstName
      lastName
      email
      doceboUserId
      market {
        id
        domain
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
 * __useAccountInfoByEmailQuery__
 *
 * To run a query within a React component, call `useAccountInfoByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountInfoByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountInfoByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAccountInfoByEmailQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.AccountInfoByEmailQuery,
    OperationTypes.AccountInfoByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.AccountInfoByEmailQuery,
    OperationTypes.AccountInfoByEmailQueryVariables
  >(AccountInfoByEmailDocument, options);
}
export function useAccountInfoByEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.AccountInfoByEmailQuery,
    OperationTypes.AccountInfoByEmailQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.AccountInfoByEmailQuery,
    OperationTypes.AccountInfoByEmailQueryVariables
  >(AccountInfoByEmailDocument, options);
}
export type AccountInfoByEmailQueryHookResult = ReturnType<
  typeof useAccountInfoByEmailQuery
>;
export type AccountInfoByEmailLazyQueryHookResult = ReturnType<
  typeof useAccountInfoByEmailLazyQuery
>;
export type AccountInfoByEmailQueryResult = Apollo.QueryResult<
  OperationTypes.AccountInfoByEmailQuery,
  OperationTypes.AccountInfoByEmailQueryVariables
>;
export const GetGlobalDataPublicDocument = gql`
  query GetGlobalDataPublic {
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
 * __useGetGlobalDataPublicQuery__
 *
 * To run a query within a React component, call `useGetGlobalDataPublicQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalDataPublicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalDataPublicQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalDataPublicQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.GetGlobalDataPublicQuery,
    OperationTypes.GetGlobalDataPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetGlobalDataPublicQuery,
    OperationTypes.GetGlobalDataPublicQueryVariables
  >(GetGlobalDataPublicDocument, options);
}
export function useGetGlobalDataPublicLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetGlobalDataPublicQuery,
    OperationTypes.GetGlobalDataPublicQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetGlobalDataPublicQuery,
    OperationTypes.GetGlobalDataPublicQueryVariables
  >(GetGlobalDataPublicDocument, options);
}
export type GetGlobalDataPublicQueryHookResult = ReturnType<
  typeof useGetGlobalDataPublicQuery
>;
export type GetGlobalDataPublicLazyQueryHookResult = ReturnType<
  typeof useGetGlobalDataPublicLazyQuery
>;
export type GetGlobalDataPublicQueryResult = Apollo.QueryResult<
  OperationTypes.GetGlobalDataPublicQuery,
  OperationTypes.GetGlobalDataPublicQueryVariables
>;
export const GetContentArticleContentDocument = gql`
  query getContentArticleContent($relativePath: String!, $tag: String!) {
    contentArticleCollection(
      where: {
        relativePath: $relativePath
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        title
        body {
          json
          links {
            ...ArticleContentLinksFragment
          }
        }
      }
    }
  }
  ${ArticleContentLinksFragmentFragmentDoc}
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
 *      tag: // value for 'tag'
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
export const MarketsDocument = gql`
  query markets {
    markets {
      nodes {
        id
        language
        domain
        cmsSpaceId
        name
        sendName
        sendMailbox
        doceboInstallersBranchId
        doceboCompanyAdminBranchId
        merchandisingUrl
        merchandiseSso
        projectsEnabled
        gtag
        gtagMarketMedia
        locationBiasRadiusKm
      }
    }
    doceboTiers {
      nodes {
        id
        marketId
        tierCode
        doceboCatalogueId
      }
    }
    merchandiseTiers {
      nodes {
        id
        marketId
        tierCode
        merchandiseDivisionId
      }
    }
  }
`;

/**
 * __useMarketsQuery__
 *
 * To run a query within a React component, call `useMarketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMarketsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.MarketsQuery,
    OperationTypes.MarketsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.MarketsQuery,
    OperationTypes.MarketsQueryVariables
  >(MarketsDocument, options);
}
export function useMarketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.MarketsQuery,
    OperationTypes.MarketsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.MarketsQuery,
    OperationTypes.MarketsQueryVariables
  >(MarketsDocument, options);
}
export type MarketsQueryHookResult = ReturnType<typeof useMarketsQuery>;
export type MarketsLazyQueryHookResult = ReturnType<typeof useMarketsLazyQuery>;
export type MarketsQueryResult = Apollo.QueryResult<
  OperationTypes.MarketsQuery,
  OperationTypes.MarketsQueryVariables
>;
export const ProductsAndSystemsDocument = gql`
  query ProductsAndSystems($marketId: Int) {
    products(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
      nodes {
        id
        name
        brand
        family
        bmiRef
        updatedAt
        published
        technology
        description
        maximumValidityYears
      }
    }
    systems(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
      nodes {
        id
        name
        bmiRef
        published
        updatedAt
        technology
        description
        maximumValidityYears
      }
    }
    systemMembers(orderBy: ID_ASC, condition: { marketId: $marketId }) {
      nodes {
        systemBmiRef
        productByProductBmiRef {
          id
          name
        }
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
 *      marketId: // value for 'marketId'
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
export const DeleteInvitedUserDocument = gql`
  mutation DeleteInvitedUser($email: String!) {
    deleteInvitedUser(email: $email)
  }
`;
export type DeleteInvitedUserMutationFn = Apollo.MutationFunction<
  OperationTypes.DeleteInvitedUserMutation,
  OperationTypes.DeleteInvitedUserMutationVariables
>;

/**
 * __useDeleteInvitedUserMutation__
 *
 * To run a mutation, you first call `useDeleteInvitedUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvitedUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvitedUserMutation, { data, loading, error }] = useDeleteInvitedUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useDeleteInvitedUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.DeleteInvitedUserMutation,
    OperationTypes.DeleteInvitedUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.DeleteInvitedUserMutation,
    OperationTypes.DeleteInvitedUserMutationVariables
  >(DeleteInvitedUserDocument, options);
}
export type DeleteInvitedUserMutationHookResult = ReturnType<
  typeof useDeleteInvitedUserMutation
>;
export type DeleteInvitedUserMutationResult =
  Apollo.MutationResult<OperationTypes.DeleteInvitedUserMutation>;
export type DeleteInvitedUserMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.DeleteInvitedUserMutation,
  OperationTypes.DeleteInvitedUserMutationVariables
>;
export const ValidateSignupUserDocument = gql`
  mutation validateSignupUser($email: String!) {
    validateSignupUser(email: $email)
  }
`;
export type ValidateSignupUserMutationFn = Apollo.MutationFunction<
  OperationTypes.ValidateSignupUserMutation,
  OperationTypes.ValidateSignupUserMutationVariables
>;

/**
 * __useValidateSignupUserMutation__
 *
 * To run a mutation, you first call `useValidateSignupUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateSignupUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateSignupUserMutation, { data, loading, error }] = useValidateSignupUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useValidateSignupUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OperationTypes.ValidateSignupUserMutation,
    OperationTypes.ValidateSignupUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OperationTypes.ValidateSignupUserMutation,
    OperationTypes.ValidateSignupUserMutationVariables
  >(ValidateSignupUserDocument, options);
}
export type ValidateSignupUserMutationHookResult = ReturnType<
  typeof useValidateSignupUserMutation
>;
export type ValidateSignupUserMutationResult =
  Apollo.MutationResult<OperationTypes.ValidateSignupUserMutation>;
export type ValidateSignupUserMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.ValidateSignupUserMutation,
  OperationTypes.ValidateSignupUserMutationVariables
>;
export const GetFaqTopicsDocument = gql`
  query GetFaqTopics($role: String!, $tier: String!, $tag: String!) {
    faqTopicCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
        audienceRole_contains_some: [$role]
        audienceTiers_contains_some: [$tier]
      }
    ) {
      items {
        title
        audienceRole
        audienceTiers
        weight
        listCollection {
          items {
            title
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetFaqTopicsQuery__
 *
 * To run a query within a React component, call `useGetFaqTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFaqTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFaqTopicsQuery({
 *   variables: {
 *      role: // value for 'role'
 *      tier: // value for 'tier'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetFaqTopicsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetFaqTopicsQuery,
    OperationTypes.GetFaqTopicsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetFaqTopicsQuery,
    OperationTypes.GetFaqTopicsQueryVariables
  >(GetFaqTopicsDocument, options);
}
export function useGetFaqTopicsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetFaqTopicsQuery,
    OperationTypes.GetFaqTopicsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetFaqTopicsQuery,
    OperationTypes.GetFaqTopicsQueryVariables
  >(GetFaqTopicsDocument, options);
}
export type GetFaqTopicsQueryHookResult = ReturnType<
  typeof useGetFaqTopicsQuery
>;
export type GetFaqTopicsLazyQueryHookResult = ReturnType<
  typeof useGetFaqTopicsLazyQuery
>;
export type GetFaqTopicsQueryResult = Apollo.QueryResult<
  OperationTypes.GetFaqTopicsQuery,
  OperationTypes.GetFaqTopicsQueryVariables
>;
export const GetFaqItemDocument = gql`
  query GetFaqItem($id: String!) {
    faqItemCollection(where: { sys: { id: $id } }, limit: 1) {
      items {
        body {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                title
                width
                height
                description
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useGetFaqItemQuery__
 *
 * To run a query within a React component, call `useGetFaqItemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFaqItemQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFaqItemQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFaqItemQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetFaqItemQuery,
    OperationTypes.GetFaqItemQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetFaqItemQuery,
    OperationTypes.GetFaqItemQueryVariables
  >(GetFaqItemDocument, options);
}
export function useGetFaqItemLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetFaqItemQuery,
    OperationTypes.GetFaqItemQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetFaqItemQuery,
    OperationTypes.GetFaqItemQueryVariables
  >(GetFaqItemDocument, options);
}
export type GetFaqItemQueryHookResult = ReturnType<typeof useGetFaqItemQuery>;
export type GetFaqItemLazyQueryHookResult = ReturnType<
  typeof useGetFaqItemLazyQuery
>;
export type GetFaqItemQueryResult = Apollo.QueryResult<
  OperationTypes.GetFaqItemQuery,
  OperationTypes.GetFaqItemQueryVariables
>;
export const GetPartnerBrandsDocument = gql`
  query GetPartnerBrands($role: String!, $tier: String!, $tag: String!) {
    marketContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        partnerBrandsCollection {
          items {
            name
            shortDescription
            websiteUrl
            description {
              json
            }
            image {
              ...ImageFragment
            }
            logo {
              ...ImageFragment
            }
          }
        }
        newsItemUrl
        newsItemCta
        newsItemHeading
      }
    }
    carouselCollection(
      where: {
        audienceRole: $role
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      total
      items {
        audienceRole
        listCollection {
          total
          items {
            header
            image {
              title
              description
              url
            }
            body
            cta
            customUrl
            customUrlButtonText
            audienceTiers
          }
        }
      }
    }
    tierBenefitCollection(
      where: {
        tier: $tier
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
      limit: 1
    ) {
      items {
        name
        description {
          json
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
 *      role: // value for 'role'
 *      tier: // value for 'tier'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetPartnerBrandsQuery(
  baseOptions: Apollo.QueryHookOptions<
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
export const GetUserProfileDocument = gql`
  query getUserProfile($accountId: Int!) {
    account(id: $accountId) {
      ...AccountPageDetailsFragment
    }
  }
  ${AccountPageDetailsFragmentFragmentDoc}
`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetUserProfileQuery(
  baseOptions: Apollo.QueryHookOptions<
    OperationTypes.GetUserProfileQuery,
    OperationTypes.GetUserProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.GetUserProfileQuery,
    OperationTypes.GetUserProfileQueryVariables
  >(GetUserProfileDocument, options);
}
export function useGetUserProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.GetUserProfileQuery,
    OperationTypes.GetUserProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.GetUserProfileQuery,
    OperationTypes.GetUserProfileQueryVariables
  >(GetUserProfileDocument, options);
}
export type GetUserProfileQueryHookResult = ReturnType<
  typeof useGetUserProfileQuery
>;
export type GetUserProfileLazyQueryHookResult = ReturnType<
  typeof useGetUserProfileLazyQuery
>;
export type GetUserProfileQueryResult = Apollo.QueryResult<
  OperationTypes.GetUserProfileQuery,
  OperationTypes.GetUserProfileQueryVariables
>;
export const GetProjectsDocument = gql`
  query GetProjects($market: Int!) {
    projectsByMarket(market: $market) {
      nodes {
        id
        name
        technology
        startDate
        endDate
        buildingOwnerFirstname
        buildingOwnerLastname
        buildingOwnerCompany
        buildingOwnerMail
        hidden
        siteAddress {
          town
          postcode
        }
        company {
          name
          status
        }
        guarantees(first: 1) {
          nodes {
            coverage
            status
            reviewerAccountId
          }
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
 *      market: // value for 'market'
 *   },
 * });
 */
export function useGetProjectsQuery(
  baseOptions: Apollo.QueryHookOptions<
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
export const TeamMembersDocument = gql`
  query teamMembers($expiryDate: Datetime, $marketId: Int) {
    accounts(condition: { marketId: $marketId }) {
      totalCount
      nodes {
        id
        role
        email
        phone
        photo
        signedPhotoUrl
        lastName
        firstName
        formattedRole
        status
        marketId
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
        projectMembers {
          nodes {
            project {
              id
              technology
              name
              startDate
              endDate
              hidden
              company {
                marketId
              }
            }
          }
        }
        companyMembers(first: 1) {
          nodes {
            id
            company {
              name
            }
          }
        }
      }
    }
  }
`;

/**
 * __useTeamMembersQuery__
 *
 * To run a query within a React component, call `useTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersQuery({
 *   variables: {
 *      expiryDate: // value for 'expiryDate'
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useTeamMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OperationTypes.TeamMembersQuery,
    OperationTypes.TeamMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OperationTypes.TeamMembersQuery,
    OperationTypes.TeamMembersQueryVariables
  >(TeamMembersDocument, options);
}
export function useTeamMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OperationTypes.TeamMembersQuery,
    OperationTypes.TeamMembersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OperationTypes.TeamMembersQuery,
    OperationTypes.TeamMembersQueryVariables
  >(TeamMembersDocument, options);
}
export type TeamMembersQueryHookResult = ReturnType<typeof useTeamMembersQuery>;
export type TeamMembersLazyQueryHookResult = ReturnType<
  typeof useTeamMembersLazyQuery
>;
export type TeamMembersQueryResult = Apollo.QueryResult<
  OperationTypes.TeamMembersQuery,
  OperationTypes.TeamMembersQueryVariables
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
export type UpdateRoleAccountMutationResult =
  Apollo.MutationResult<OperationTypes.UpdateRoleAccountMutation>;
export type UpdateRoleAccountMutationOptions = Apollo.BaseMutationOptions<
  OperationTypes.UpdateRoleAccountMutation,
  OperationTypes.UpdateRoleAccountMutationVariables
>;
export const TrainingDocument = gql`
  query training($catalogueId: Int, $userId: Int, $tag: String!) {
    trainingContentCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
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
          slug
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
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useTrainingQuery(
  baseOptions: Apollo.QueryHookOptions<
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
