import * as OperationTypes from "./operations";

import * as Operations from "./hooks";
import { NextRouter, useRouter } from "next/router";
import { QueryHookOptions, useQuery } from "@apollo/client";
import * as Apollo from "@apollo/client";
import type React from "react";
import type { NormalizedCacheObject } from "@apollo/client";

export async function getServerPageGetGlobalData(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetGlobalDataQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetGlobalDataQuery>({
    ...options,
    query: Operations.GetGlobalDataDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetGlobalData = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetGlobalDataQuery,
    OperationTypes.GetGlobalDataQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetGlobalDataDocument, options);
};
export type PageGetGlobalDataComp = React.FC<{
  data?: OperationTypes.GetGlobalDataQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetGlobalData = {
  getServerPage: getServerPageGetGlobalData,

  usePage: useGetGlobalData
};

export async function getServerPageGetProject(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProjectQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetProjectQuery>({
    ...options,
    query: Operations.GetProjectDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProject = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProjectQuery,
    OperationTypes.GetProjectQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProjectDocument, options);
};
export type PageGetProjectComp = React.FC<{
  data?: OperationTypes.GetProjectQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProject = {
  getServerPage: getServerPageGetProject,

  usePage: useGetProject
};
export async function getServerPageGetCompaniesReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCompaniesReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetCompaniesReportQuery>(
    { ...options, query: Operations.GetCompaniesReportDocument }
  );

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetCompaniesReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetCompaniesReportQuery,
    OperationTypes.GetCompaniesReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetCompaniesReportDocument, options);
};
export type PageGetCompaniesReportComp = React.FC<{
  data?: OperationTypes.GetCompaniesReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCompaniesReport = {
  getServerPage: getServerPageGetCompaniesReport,

  usePage: useGetCompaniesReport
};
export async function getServerPageGetGuaranteesReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetGuaranteesReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetGuaranteesReportQuery>({
      ...options,
      query: Operations.GetGuaranteesReportDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetGuaranteesReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetGuaranteesReportQuery,
    OperationTypes.GetGuaranteesReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetGuaranteesReportDocument, options);
};
export type PageGetGuaranteesReportComp = React.FC<{
  data?: OperationTypes.GetGuaranteesReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetGuaranteesReport = {
  getServerPage: getServerPageGetGuaranteesReport,

  usePage: useGetGuaranteesReport
};
export async function getServerPageGetProductsReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProductsReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetProductsReportQuery>({
    ...options,
    query: Operations.GetProductsReportDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProductsReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProductsReportQuery,
    OperationTypes.GetProductsReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProductsReportDocument, options);
};
export type PageGetProductsReportComp = React.FC<{
  data?: OperationTypes.GetProductsReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProductsReport = {
  getServerPage: getServerPageGetProductsReport,

  usePage: useGetProductsReport
};
export async function getServerPageGetProjectsReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProjectsReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetProjectsReportQuery>({
    ...options,
    query: Operations.GetProjectsReportDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProjectsReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProjectsReportQuery,
    OperationTypes.GetProjectsReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProjectsReportDocument, options);
};
export type PageGetProjectsReportComp = React.FC<{
  data?: OperationTypes.GetProjectsReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProjectsReport = {
  getServerPage: getServerPageGetProjectsReport,

  usePage: useGetProjectsReport
};
export async function getServerPageGetSystemsReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetSystemsReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetSystemsReportQuery>({
    ...options,
    query: Operations.GetSystemsReportDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetSystemsReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetSystemsReportQuery,
    OperationTypes.GetSystemsReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetSystemsReportDocument, options);
};
export type PageGetSystemsReportComp = React.FC<{
  data?: OperationTypes.GetSystemsReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetSystemsReport = {
  getServerPage: getServerPageGetSystemsReport,

  usePage: useGetSystemsReport
};
export async function getServerPageGetTeamsReport(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetTeamsReportQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetTeamsReportQuery>({
    ...options,
    query: Operations.GetTeamsReportDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetTeamsReport = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetTeamsReportQuery,
    OperationTypes.GetTeamsReportQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetTeamsReportDocument, options);
};
export type PageGetTeamsReportComp = React.FC<{
  data?: OperationTypes.GetTeamsReportQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetTeamsReport = {
  getServerPage: getServerPageGetTeamsReport,

  usePage: useGetTeamsReport
};

export async function getServerPageGetProjectCompanyMembers(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProjectCompanyMembersQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetProjectCompanyMembersQuery>({
      ...options,
      query: Operations.GetProjectCompanyMembersDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProjectCompanyMembers = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProjectCompanyMembersQuery,
    OperationTypes.GetProjectCompanyMembersQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProjectCompanyMembersDocument, options);
};
export type PageGetProjectCompanyMembersComp = React.FC<{
  data?: OperationTypes.GetProjectCompanyMembersQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProjectCompanyMembers = {
  getServerPage: getServerPageGetProjectCompanyMembers,

  usePage: useGetProjectCompanyMembers
};

export async function getServerPageContentfulEvidenceCategories(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.ContentfulEvidenceCategoriesQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.ContentfulEvidenceCategoriesQuery>({
      ...options,
      query: Operations.ContentfulEvidenceCategoriesDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useContentfulEvidenceCategories = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.ContentfulEvidenceCategoriesQuery,
    OperationTypes.ContentfulEvidenceCategoriesQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.ContentfulEvidenceCategoriesDocument, options);
};
export type PageContentfulEvidenceCategoriesComp = React.FC<{
  data?: OperationTypes.ContentfulEvidenceCategoriesQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrContentfulEvidenceCategories = {
  getServerPage: getServerPageContentfulEvidenceCategories,

  usePage: useContentfulEvidenceCategories
};

export async function getServerPageGetGuaranteeTemplates(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetGuaranteeTemplatesQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetGuaranteeTemplatesQuery>({
      ...options,
      query: Operations.GetGuaranteeTemplatesDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetGuaranteeTemplates = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetGuaranteeTemplatesQuery,
    OperationTypes.GetGuaranteeTemplatesQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetGuaranteeTemplatesDocument, options);
};
export type PageGetGuaranteeTemplatesComp = React.FC<{
  data?: OperationTypes.GetGuaranteeTemplatesQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetGuaranteeTemplates = {
  getServerPage: getServerPageGetGuaranteeTemplates,

  usePage: useGetGuaranteeTemplates
};
export async function getServerPageSearchProducts(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.SearchProductsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.SearchProductsQuery>({
    ...options,
    query: Operations.SearchProductsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useSearchProducts = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.SearchProductsQuery,
    OperationTypes.SearchProductsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.SearchProductsDocument, options);
};
export type PageSearchProductsComp = React.FC<{
  data?: OperationTypes.SearchProductsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrSearchProducts = {
  getServerPage: getServerPageSearchProducts,

  usePage: useSearchProducts
};
export async function getServerPageSearchSystems(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.SearchSystemsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.SearchSystemsQuery>({
    ...options,
    query: Operations.SearchSystemsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useSearchSystems = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.SearchSystemsQuery,
    OperationTypes.SearchSystemsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.SearchSystemsDocument, options);
};
export type PageSearchSystemsComp = React.FC<{
  data?: OperationTypes.SearchSystemsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrSearchSystems = {
  getServerPage: getServerPageSearchSystems,

  usePage: useSearchSystems
};
export async function getServerPageGetProductGuaranteeTypes(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProductGuaranteeTypesQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetProductGuaranteeTypesQuery>({
      ...options,
      query: Operations.GetProductGuaranteeTypesDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProductGuaranteeTypes = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProductGuaranteeTypesQuery,
    OperationTypes.GetProductGuaranteeTypesQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProductGuaranteeTypesDocument, options);
};
export type PageGetProductGuaranteeTypesComp = React.FC<{
  data?: OperationTypes.GetProductGuaranteeTypesQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProductGuaranteeTypes = {
  getServerPage: getServerPageGetProductGuaranteeTypes,

  usePage: useGetProductGuaranteeTypes
};
export async function getServerPageAccountByEmail(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.AccountByEmailQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.AccountByEmailQuery>({
    ...options,
    query: Operations.AccountByEmailDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useAccountByEmail = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.AccountByEmailQuery,
    OperationTypes.AccountByEmailQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.AccountByEmailDocument, options);
};
export type PageAccountByEmailComp = React.FC<{
  data?: OperationTypes.AccountByEmailQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrAccountByEmail = {
  getServerPage: getServerPageAccountByEmail,

  usePage: useAccountByEmail
};

export async function getServerPageUserByEmail(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.UserByEmailQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.UserByEmailQuery>({
    ...options,
    query: Operations.UserByEmailDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useUserByEmail = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.UserByEmailQuery,
    OperationTypes.UserByEmailQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.UserByEmailDocument, options);
};
export type PageUserByEmailComp = React.FC<{
  data?: OperationTypes.UserByEmailQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrUserByEmail = {
  getServerPage: getServerPageUserByEmail,

  usePage: useUserByEmail
};
export async function getServerPageInvitations(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.InvitationsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.InvitationsQuery>({
    ...options,
    query: Operations.InvitationsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useInvitations = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.InvitationsQuery,
    OperationTypes.InvitationsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.InvitationsDocument, options);
};
export type PageInvitationsComp = React.FC<{
  data?: OperationTypes.InvitationsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrInvitations = {
  getServerPage: getServerPageInvitations,

  usePage: useInvitations
};

export async function getServerPageGetMarketsByDomain(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetMarketsByDomainQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetMarketsByDomainQuery>(
    { ...options, query: Operations.GetMarketsByDomainDocument }
  );

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetMarketsByDomain = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetMarketsByDomainQuery,
    OperationTypes.GetMarketsByDomainQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetMarketsByDomainDocument, options);
};
export type PageGetMarketsByDomainComp = React.FC<{
  data?: OperationTypes.GetMarketsByDomainQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetMarketsByDomain = {
  getServerPage: getServerPageGetMarketsByDomain,

  usePage: useGetMarketsByDomain
};
export async function getServerPageGetMediaFolders(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetMediaFoldersQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetMediaFoldersQuery>({
    ...options,
    query: Operations.GetMediaFoldersDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetMediaFolders = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetMediaFoldersQuery,
    OperationTypes.GetMediaFoldersQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetMediaFoldersDocument, options);
};
export type PageGetMediaFoldersComp = React.FC<{
  data?: OperationTypes.GetMediaFoldersQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetMediaFolders = {
  getServerPage: getServerPageGetMediaFolders,

  usePage: useGetMediaFolders
};
export async function getServerPageGetMediaFolderContents(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetMediaFolderContentsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetMediaFolderContentsQuery>({
      ...options,
      query: Operations.GetMediaFolderContentsDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetMediaFolderContents = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetMediaFolderContentsQuery,
    OperationTypes.GetMediaFolderContentsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetMediaFolderContentsDocument, options);
};
export type PageGetMediaFolderContentsComp = React.FC<{
  data?: OperationTypes.GetMediaFolderContentsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetMediaFolderContents = {
  getServerPage: getServerPageGetMediaFolderContents,

  usePage: useGetMediaFolderContents
};
export async function getServerPageAccountInfoByEmail(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.AccountInfoByEmailQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.AccountInfoByEmailQuery>(
    { ...options, query: Operations.AccountInfoByEmailDocument }
  );

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useAccountInfoByEmail = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.AccountInfoByEmailQuery,
    OperationTypes.AccountInfoByEmailQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.AccountInfoByEmailDocument, options);
};
export type PageAccountInfoByEmailComp = React.FC<{
  data?: OperationTypes.AccountInfoByEmailQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrAccountInfoByEmail = {
  getServerPage: getServerPageAccountInfoByEmail,

  usePage: useAccountInfoByEmail
};
export async function getServerPageGetGlobalDataPublic(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetGlobalDataPublicQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetGlobalDataPublicQuery>({
      ...options,
      query: Operations.GetGlobalDataPublicDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetGlobalDataPublic = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetGlobalDataPublicQuery,
    OperationTypes.GetGlobalDataPublicQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetGlobalDataPublicDocument, options);
};
export type PageGetGlobalDataPublicComp = React.FC<{
  data?: OperationTypes.GetGlobalDataPublicQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetGlobalDataPublic = {
  getServerPage: getServerPageGetGlobalDataPublic,

  usePage: useGetGlobalDataPublic
};
export async function getServerPageGetContentArticleContent(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetContentArticleContentQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetContentArticleContentQuery>({
      ...options,
      query: Operations.GetContentArticleContentDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetContentArticleContent = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetContentArticleContentQuery,
    OperationTypes.GetContentArticleContentQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetContentArticleContentDocument, options);
};
export type PageGetContentArticleContentComp = React.FC<{
  data?: OperationTypes.GetContentArticleContentQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetContentArticleContent = {
  getServerPage: getServerPageGetContentArticleContent,

  usePage: useGetContentArticleContent
};
export async function getServerPageMarkets(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.MarketsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.MarketsQuery>({
    ...options,
    query: Operations.MarketsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useMarkets = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.MarketsQuery,
    OperationTypes.MarketsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.MarketsDocument, options);
};
export type PageMarketsComp = React.FC<{
  data?: OperationTypes.MarketsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrMarkets = {
  getServerPage: getServerPageMarkets,

  usePage: useMarkets
};
export async function getServerPageProductsAndSystems(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.ProductsAndSystemsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.ProductsAndSystemsQuery>(
    { ...options, query: Operations.ProductsAndSystemsDocument }
  );

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useProductsAndSystems = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.ProductsAndSystemsQuery,
    OperationTypes.ProductsAndSystemsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.ProductsAndSystemsDocument, options);
};
export type PageProductsAndSystemsComp = React.FC<{
  data?: OperationTypes.ProductsAndSystemsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrProductsAndSystems = {
  getServerPage: getServerPageProductsAndSystems,

  usePage: useProductsAndSystems
};
export async function getServerPageGetCompaniesByMarket(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCompaniesByMarketQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.GetCompaniesByMarketQuery>({
      ...options,
      query: Operations.GetCompaniesByMarketDocument
    });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetCompaniesByMarket = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetCompaniesByMarketQuery,
    OperationTypes.GetCompaniesByMarketQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetCompaniesByMarketDocument, options);
};
export type PageGetCompaniesByMarketComp = React.FC<{
  data?: OperationTypes.GetCompaniesByMarketQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCompaniesByMarket = {
  getServerPage: getServerPageGetCompaniesByMarket,

  usePage: useGetCompaniesByMarket
};
export async function getServerPageGetCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetCompanyQuery>({
    ...options,
    query: Operations.GetCompanyDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetCompany = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetCompanyQuery,
    OperationTypes.GetCompanyQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetCompanyDocument, options);
};
export type PageGetCompanyComp = React.FC<{
  data?: OperationTypes.GetCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCompany = {
  getServerPage: getServerPageGetCompany,

  usePage: useGetCompany
};
export async function getServerPageGetPartnerBrands(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetPartnerBrandsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetPartnerBrandsQuery>({
    ...options,
    query: Operations.GetPartnerBrandsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetPartnerBrands = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetPartnerBrandsQuery,
    OperationTypes.GetPartnerBrandsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetPartnerBrandsDocument, options);
};
export type PageGetPartnerBrandsComp = React.FC<{
  data?: OperationTypes.GetPartnerBrandsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetPartnerBrands = {
  getServerPage: getServerPageGetPartnerBrands,

  usePage: useGetPartnerBrands
};
export async function getServerPageGetUserProfile(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetUserProfileQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetUserProfileQuery>({
    ...options,
    query: Operations.GetUserProfileDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetUserProfile = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetUserProfileQuery,
    OperationTypes.GetUserProfileQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetUserProfileDocument, options);
};
export type PageGetUserProfileComp = React.FC<{
  data?: OperationTypes.GetUserProfileQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetUserProfile = {
  getServerPage: getServerPageGetUserProfile,

  usePage: useGetUserProfile
};
export async function getServerPageGetProjects(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetProjectsQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetProjectsQuery>({
    ...options,
    query: Operations.GetProjectsDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useGetProjects = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetProjectsQuery,
    OperationTypes.GetProjectsQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetProjectsDocument, options);
};
export type PageGetProjectsComp = React.FC<{
  data?: OperationTypes.GetProjectsQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetProjects = {
  getServerPage: getServerPageGetProjects,

  usePage: useGetProjects
};
export async function getServerPageTeamMembers(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.TeamMembersQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.TeamMembersQuery>({
    ...options,
    query: Operations.TeamMembersDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useTeamMembers = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.TeamMembersQuery,
    OperationTypes.TeamMembersQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.TeamMembersDocument, options);
};
export type PageTeamMembersComp = React.FC<{
  data?: OperationTypes.TeamMembersQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrTeamMembers = {
  getServerPage: getServerPageTeamMembers,

  usePage: useTeamMembers
};

export async function getServerPageTraining(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.TrainingQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.TrainingQuery>({
    ...options,
    query: Operations.TrainingDocument
  });

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useTraining = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.TrainingQuery,
    OperationTypes.TrainingQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.TrainingDocument, options);
};
export type PageTrainingComp = React.FC<{
  data?: OperationTypes.TrainingQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrTraining = {
  getServerPage: getServerPageTraining,

  usePage: useTraining
};
export async function getServerPageDoceboCatalogIdByMarketDomain(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data =
    await apolloClient.query<OperationTypes.DoceboCatalogIdByMarketDomainQuery>(
      { ...options, query: Operations.DoceboCatalogIdByMarketDomainDocument }
    );

  const apolloState = apolloClient.cache.extract();

  return {
    props: {
      apolloState: apolloState,
      data: data?.data,
      error: data?.error ?? data?.errors ?? null
    }
  };
}
export const useDoceboCatalogIdByMarketDomain = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.DoceboCatalogIdByMarketDomainQuery,
    OperationTypes.DoceboCatalogIdByMarketDomainQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.DoceboCatalogIdByMarketDomainDocument, options);
};
export type PageDoceboCatalogIdByMarketDomainComp = React.FC<{
  data?: OperationTypes.DoceboCatalogIdByMarketDomainQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrDoceboCatalogIdByMarketDomain = {
  getServerPage: getServerPageDoceboCatalogIdByMarketDomain,

  usePage: useDoceboCatalogIdByMarketDomain
};
