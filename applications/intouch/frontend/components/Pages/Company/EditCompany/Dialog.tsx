import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import {
  CompanyRegisteredAddressIdFkeyInput,
  CompanyTradingAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import { useUpdateCompanyDetailsMutation } from "../../../../graphql/generated/hooks";
import log from "../../../../lib/logger";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { SetCompanyDetailsDialog } from "../../../SetCompanyDetailsDialog";

export type OnCompanyUpdateSuccess = (
  company: GetCompanyQuery["company"]
) => void;

export type EditCompanyDialogProps = {
  company: GetCompanyQuery["company"];
  isOpen: boolean;
  onCloseClick?: () => void;
  onCompanyUpdateSuccess?: OnCompanyUpdateSuccess;
};

export const EditCompanyDialog = ({
  company,
  isOpen,
  onCloseClick,
  onCompanyUpdateSuccess
}: EditCompanyDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [updateCompany] = useUpdateCompanyDetailsMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating the company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ updateCompany: { company } }) => {
      log({
        severity: "INFO",
        message: `Updated company - id: ${company.id}`
      });
      onCompanyUpdateSuccess && onCompanyUpdateSuccess(company);
      onCloseClick && onCloseClick();
    }
  });

  const onSubmit = useCallback(
    (values) => {
      const { registeredAddress, tradingAddress, ...editCompanyValues } =
        values;

      const addressToRegisteredAddressId: CompanyRegisteredAddressIdFkeyInput =
        // address already exists?
        company.registeredAddress?.id
          ? {
              // updates the address (already linked to the company)
              updateById: {
                id: company.registeredAddress.id,
                patch: values.registeredAddress
              }
            }
          : {
              // creates the address and links it to the company
              create: values.registeredAddress
            };

      const addressToTradingAddressId: CompanyTradingAddressIdFkeyInput =
        // address already exists?
        company.tradingAddress?.id
          ? {
              // updates the address (already linked to the company)
              updateById: {
                id: company?.tradingAddress.id,
                patch: values.tradingAddress
              }
            }
          : {
              // creates the address and links it to the company
              create: values.tradingAddress
            };

      updateCompany({
        variables: {
          input: {
            id: company.id,
            patch: {
              ...editCompanyValues,
              addressToRegisteredAddressId,
              addressToTradingAddressId
            }
          }
        }
      });
    },
    [company, updateCompany]
  );

  return (
    <SetCompanyDetailsDialog
      title={t("company-page:edit_dialog.title")}
      company={company}
      isOpen={isOpen}
      onCloseClick={onCloseClick}
      onSubmit={onSubmit}
    />
  );
};

export const UPDATE_COMPANY = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyPageDetailsFragment
      }
    }
  }
`;
