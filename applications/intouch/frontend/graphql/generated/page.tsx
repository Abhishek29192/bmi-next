import * as OperationTypes from "./operations";

import * as Operations from "./hooks";
import { NextRouter, useRouter } from "next/router";
import { QueryHookOptions, useQuery } from "@apollo/client";
import * as Apollo from "@apollo/client";
import type React from "react";
import type { NormalizedCacheObject } from "@apollo/client";

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

export async function getServerPageCurrentCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.CurrentCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.CurrentCompanyQuery>({
    ...options,
    query: Operations.CurrentCompanyDocument
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
export const useCurrentCompany = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.CurrentCompanyQuery,
    OperationTypes.CurrentCompanyQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.CurrentCompanyDocument, options);
};
export type PageCurrentCompanyComp = React.FC<{
  data?: OperationTypes.CurrentCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrCurrentCompany = {
  getServerPage: getServerPageCurrentCompany,

  usePage: useCurrentCompany
};
export async function getServerPageGetCurrentCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCurrentCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetCurrentCompanyQuery>({
    ...options,
    query: Operations.GetCurrentCompanyDocument
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
export const useGetCurrentCompany = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.GetCurrentCompanyQuery,
    OperationTypes.GetCurrentCompanyQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.GetCurrentCompanyDocument, options);
};
export type PageGetCurrentCompanyComp = React.FC<{
  data?: OperationTypes.GetCurrentCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCurrentCompany = {
  getServerPage: getServerPageGetCurrentCompany,

  usePage: useGetCurrentCompany
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
export async function getServerPageCompanyMembers(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.CompanyMembersQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.CompanyMembersQuery>({
    ...options,
    query: Operations.CompanyMembersDocument
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
export const useCompanyMembers = (
  optionsFunc?: (
    router: NextRouter
  ) => QueryHookOptions<
    OperationTypes.CompanyMembersQuery,
    OperationTypes.CompanyMembersQueryVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return useQuery(Operations.CompanyMembersDocument, options);
};
export type PageCompanyMembersComp = React.FC<{
  data?: OperationTypes.CompanyMembersQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrCompanyMembers = {
  getServerPage: getServerPageCompanyMembers,

  usePage: useCompanyMembers
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
  const data = await apolloClient.query<OperationTypes.DoceboCatalogIdByMarketDomainQuery>(
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
