import React, { useCallback, useState, useEffect } from "react";
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

  const [errorMessage, setErrorMessage] = useState<string>(null);

  const [updateCompany] = useUpdateCompanyDetailsMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating the company: ${error.toString()}`
      });
      setErrorMessage(error.message);
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
  useEffect(() => {
    setErrorMessage(undefined);
  }, [isOpen]);

  const onSubmit = useCallback(
    (values) => {
      const {
        registeredAddress,
        tradingAddress,
        operationTypes,
        ...editCompanyValues
      } = values;

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

      const removedOperations = [];
      const newOperations = [];

      const existingOperations =
        company?.companyOperationsByCompany?.nodes || [];

      if (operationTypes) {
        Object.entries(operationTypes).forEach(([operationType, value]) => {
          const existingOperation = existingOperations.find(
            (o) => o.operation === operationType
          );
          if (existingOperation && value === false) {
            removedOperations.push({ id: existingOperation.id });
          }
          if (!existingOperation && value === true) {
            newOperations.push({ operation: operationType });
          }
        });
      }

      updateCompany({
        variables: {
          input: {
            id: company.id,
            patch: {
              ...editCompanyValues,
              companyOperationsUsingId: {
                create: newOperations,
                deleteById: removedOperations
              },
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
      company={{ ...company }}
      isOpen={isOpen}
      onCloseClick={onCloseClick}
      onSubmit={onSubmit}
      errorMessage={errorMessage}
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
