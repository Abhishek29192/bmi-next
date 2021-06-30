import * as OperationTypes from "./operations";

import * as Operations from "./hooks";
import { NextRouter, useRouter } from "next/router";
import { QueryHookOptions, useQuery } from "@apollo/client";
import * as Apollo from "@apollo/client";
import type React from "react";
import type { NormalizedCacheObject } from "@apollo/client";

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
