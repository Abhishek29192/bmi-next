import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  DoubleAcceptance,
  GuaranteeTemplate,
  Product
} from "@bmi/intouch-api-types";
import { v4 } from "uuid";
import { ApolloProvider } from "@apollo/client";
import { withPublicPage } from "../../lib/middleware/withPublicPage";
import { getMarketAndEnvFromReq, parseMarketTag } from "../../lib/utils";
import { Layout } from "../../components/Layout/Unauthenticated";
import { FormContainer, Confirmation } from "../../components/DoubleAcceptance";
import { getDoubleAcceptanceByValidTempToken } from "../../lib/doubleAcceptance";
import { initializeApollo } from "../../lib/apolloClient";
import { getServerPageGetGuaranteeTemplates } from "../../graphql/generated/page";
import { useApollo } from "../../lib/apolloClient";

export type Props = {
  initialApolloState?: any;
  pageProps?: any;
  doubleAcceptance: Pick<DoubleAcceptance, "id" | "guaranteeId"> &
    Pick<Product, "maximumValidityYears"> & {
      completed: boolean;
      guaranteeTemplate: Partial<GuaranteeTemplate>;
    };
};

const DoubleAcceptancePage = ({
  doubleAcceptance: doubleAcceptanceProp,
  ...props
}: Props) => {
  const { t } = useTranslation("double-acceptance");
  const [doubleAcceptance, setDoubleAcceptance] =
    useState(doubleAcceptanceProp);
  const onUpdateDoubleAcceptanceCompleted = (
    doubleAcceptance: Props["doubleAcceptance"]
  ) => setDoubleAcceptance(doubleAcceptance);
  const headers = {
    "x-request-id": v4(),
    "x-authenticated-user-id": props["x-authenticated-user-id"],
    "x-api-key": process.env.GATEWAY_API_KEY,
    authorization: "Bearer undefined"
  };
  const apolloClient = useApollo(props?.initialApolloState, {
    Component: FormContainer,
    pageProps: props?.pageProps,
    ...props,
    headers
  });
  return (
    <Layout title={t("title")}>
      {doubleAcceptance.completed ? (
        <Confirmation />
      ) : (
        <ApolloProvider client={apolloClient}>
          <FormContainer
            doubleAcceptance={doubleAcceptance}
            onUpdateDoubleAcceptanceCompleted={
              onUpdateDoubleAcceptanceCompleted
            }
            {...props}
          />
        </ApolloProvider>
      )}
    </Layout>
  );
};

export const getServerSideProps = withPublicPage(
  async ({ locale, req, res, query, globalPageData }) => {
    const { currentHost, market } = getMarketAndEnvFromReq(req);
    const { tempToken } = query;
    const contentfulTag = parseMarketTag(market);
    const headers = {
      "x-request-id": v4(),
      "x-authenticated-user-id": req.headers["x-authenticated-user-id"],
      "x-api-key": process.env.GATEWAY_API_KEY,
      authorization: "Bearer undefined"
    };
    const apolloClient = initializeApollo(null, {
      req,
      res,
      headers
    });
    const {
      data: {
        getDoubleAcceptanceByValidTempToken: {
          id,
          expiryDate,
          acceptanceDate,
          maximumValidityYears,
          technology,
          languageCode,
          coverage,
          guaranteeId
        }
      }
    } = await apolloClient.mutate({
      mutation: getDoubleAcceptanceByValidTempToken,
      variables: { input: { tempToken } }
    });
    const {
      props: {
        data: {
          guaranteeTemplateCollection: {
            items: [guaranteeTemplate]
          }
        }
      }
    } = await getServerPageGetGuaranteeTemplates(
      {
        variables: {
          technology,
          language: languageCode,
          coverage,
          tag: contentfulTag
        }
      },
      apolloClient
    );
    if (!expiryDate || new Date(expiryDate) < new Date()) {
      return {
        notFound: true
      };
    }
    console.log(globalPageData);
    return {
      props: {
        baseUrl: currentHost,
        ...globalPageData,
        ...(await serverSideTranslations(locale, [
          "common",
          "double-acceptance"
        ])),
        ["x-authenticated-user-id"]:
          req.headers["x-authenticated-user-id"] || null,
        market,
        doubleAcceptance: {
          id: id,
          guaranteeId,
          completed: !!acceptanceDate,
          maximumValidityYears: maximumValidityYears,
          guaranteeTemplate
        }
      }
    };
  }
);

export default DoubleAcceptancePage;
