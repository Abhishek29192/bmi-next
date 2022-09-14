import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  DoubleAcceptance,
  GuaranteeTemplate,
  Product
} from "@bmi/intouch-api-types";
import { v4 } from "uuid";
import { withPublicPage } from "../../lib/middleware/withPublicPage";
import { getMarketAndEnvFromReq, parseMarketTag } from "../../lib/utils";
import { Layout } from "../../components/Layout/Unauthenticated";
import { FormContainer, Confirmation } from "../../components/DoubleAcceptance";
import { getDoubleAcceptanceByValidTempToken } from "../../lib/doubleAcceptance";
import { initializeApollo } from "../../lib/apolloClient";
import { getServerPageGetGuaranteeTemplates } from "../../graphql/generated/page";

export type Props = {
  doubleAcceptance: Pick<DoubleAcceptance, "id" | "guaranteeId"> &
    Pick<Product, "maximumValidityYears"> & {
      completed: boolean;
      guaranteeTemplate: Partial<GuaranteeTemplate>;
    };
  baseUrl: string;
  environment?: string;
};

const DoubleAcceptancePage = ({
  doubleAcceptance: doubleAcceptanceProp,
  baseUrl,
  environment,
  ...props
}: Props) => {
  const { t } = useTranslation("double-acceptance");
  const [doubleAcceptance, setDoubleAcceptance] =
    useState(doubleAcceptanceProp);
  const onUpdateDoubleAcceptanceCompleted = (
    doubleAcceptance: Props["doubleAcceptance"]
  ) => setDoubleAcceptance(doubleAcceptance);

  return (
    <Layout title={t("title")}>
      {doubleAcceptance.completed ? (
        <Confirmation baseUrl={baseUrl} environment={environment} />
      ) : (
        <FormContainer
          doubleAcceptance={doubleAcceptance}
          onUpdateDoubleAcceptanceCompleted={onUpdateDoubleAcceptanceCompleted}
          {...props}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps = withPublicPage(
  async ({ locale, req, res, query, globalPageData }) => {
    const { currentHost, environment, market } = getMarketAndEnvFromReq(req);
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

    return {
      props: {
        baseUrl: currentHost,
        ...globalPageData,
        ...(await serverSideTranslations(locale, [
          "common",
          "double-acceptance"
        ])),
        environment,
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
