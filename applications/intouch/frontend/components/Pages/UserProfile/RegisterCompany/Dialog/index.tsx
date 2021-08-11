import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import {
  CompanyRegisteredAddressIdFkeyInput,
  CompanyTradingAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import {
  useCreateCompanyMutation,
  useUpdateCompanyDetailsMutation
} from "../../../../../graphql/generated/hooks";
import log from "../../../../../lib/logger";
import { SetCompanyDetailsDialog } from "../../../../SetCompanyDetailsDialog";

export type RegisterCompanyDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
};

export const RegisterCompanyDialog = ({
  isOpen,
  onCloseClick
}: RegisterCompanyDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [registerCompany] = useCreateCompanyMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ createCompany: { company } }) => {
      log({
        severity: "INFO",
        message: `Registered company - id: ${company.id}`
      });

      return company;
    }
  });

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
        message: `Update company details for company id: ${company.id}`
      });
    }
  });

  const onSubmit = useCallback(
    async (values) => {
      const {
        registeredAddress,
        tradingAddress,
        logoUpload,
        shouldRemoveLogo,
        ...newCompanyDetails
      } = values;

      // creates company without addresses & logo,
      // which are created in 2nd step
      const {
        data: {
          createCompany: {
            company: { id: newCompanyId }
          }
        }
      } = await registerCompany({
        variables: { input: newCompanyDetails }
      });

      const addressToRegisteredAddressId: CompanyRegisteredAddressIdFkeyInput =
        { create: values.registeredAddress };

      const addressToTradingAddressId: CompanyTradingAddressIdFkeyInput = {
        create: values.tradingAddress
      };

      // add addresses & logo successively
      updateCompany({
        variables: {
          input: {
            id: newCompanyId,
            patch: {
              logoUpload,
              shouldRemoveLogo,
              addressToRegisteredAddressId,
              addressToTradingAddressId
            }
          }
        }
      });

      // TODO: update page state without reloading
      window.location.reload();
      onCloseClick();
    },
    [registerCompany, updateCompany]
  );

  return (
    <SetCompanyDetailsDialog
      title={t("company-page:register_dialog.title")}
      isOpen={isOpen}
      onSubmit={onSubmit}
      onCloseClick={onCloseClick}
    />
  );
};

export const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      company {
        id
      }
    }
  }
`;
