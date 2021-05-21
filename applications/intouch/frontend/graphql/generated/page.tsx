import gql from "graphql-tag";
import { NextRouter, useRouter } from "next/router";
import { QueryHookOptions, useQuery } from "@apollo/client";
import * as Apollo from "@apollo/client";
import type React from "react";
import type { NormalizedCacheObject } from "@apollo/client";
import * as OperationTypes from "./operations";

export const UpdateCompanyDocument = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        name
      }
    }
  }
`;
export const CurrentCompanyDocument = gql`
  query currentCompany {
    currentCompany
  }
`;
export async function getServerPageCurrentCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.CurrentCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.CurrentCompanyQuery>({
    ...options,
    query: CurrentCompanyDocument
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
  return useQuery(CurrentCompanyDocument, options);
};
export type PageCurrentCompanyComp = React.FC<{
  data?: OperationTypes.CurrentCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrCurrentCompany = {
  getServerPage: getServerPageCurrentCompany,

  usePage: useCurrentCompany
};
export const GetCurrentCompanyDocument = gql`
  query GetCurrentCompany {
    currentCompany
  }
`;
export async function getServerPageGetCurrentCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCurrentCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetCurrentCompanyQuery>({
    ...options,
    query: GetCurrentCompanyDocument
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
  return useQuery(GetCurrentCompanyDocument, options);
};
export type PageGetCurrentCompanyComp = React.FC<{
  data?: OperationTypes.GetCurrentCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCurrentCompany = {
  getServerPage: getServerPageGetCurrentCompany,

  usePage: useGetCurrentCompany
};
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
export async function getServerPageGetCompany(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.GetCompanyQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.GetCompanyQuery>({
    ...options,
    query: GetCompanyDocument
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
  return useQuery(GetCompanyDocument, options);
};
export type PageGetCompanyComp = React.FC<{
  data?: OperationTypes.GetCompanyQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrGetCompany = {
  getServerPage: getServerPageGetCompany,

  usePage: useGetCompany
};
export const TrainingDocument = gql`
  query training {
    trainingContentCollection {
      items {
        lmsCtaLabel
      }
    }
    courses {
      nodes {
        id
        name
        technology
        image
        promoted
        trainingType
        description
        courseEnrollments {
          nodes {
            id
            status
            url
            courseId
          }
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
export async function getServerPageTraining(
  options: Omit<
    Apollo.QueryOptions<OperationTypes.TrainingQueryVariables>,
    "query"
  >,
  apolloClient: Apollo.ApolloClient<NormalizedCacheObject>
) {
  const data = await apolloClient.query<OperationTypes.TrainingQuery>({
    ...options,
    query: TrainingDocument
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
  return useQuery(TrainingDocument, options);
};
export type PageTrainingComp = React.FC<{
  data?: OperationTypes.TrainingQuery;
  error?: Apollo.ApolloError;
}>;
export const ssrTraining = {
  getServerPage: getServerPageTraining,

  usePage: useTraining
};
