import React, { useCallback, useState } from "react";
import { gql } from "@apollo/client";
import Button from "@bmi-digital/components/button";
import Dialog from "@bmi-digital/components/dialog";
import { useTranslation } from "next-i18next";
import { useAccountContext } from "../../../../context/AccountContext";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import logger from "../../../../lib/logger";
import { useLeaveCompanyMutation } from "../../../../graphql/generated/hooks";
import { findAccountCompany } from "../../../../lib/account";
import styles from "./styles.module.scss";

export type LeaveCompanyButtonProps = {
  onLeaveCurrentCompanySuccess: (
    account: GetUserProfileQuery["account"]
  ) => void;
};

export const LeaveCompanyButton = ({
  onLeaveCurrentCompanySuccess
}: LeaveCompanyButtonProps) => {
  const { account } = useAccountContext();
  const { t } = useTranslation(["common", "profile"]);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [leaveCurrentCompany] = useLeaveCompanyMutation({
    onError: (error) => {
      logger({
        severity: "ERROR",
        message: `There was an error leaving a company: ${error.toString()}`
      });
    },
    onCompleted: ({
      deleteCompanyMemberByMarketIdAndAccountIdAndCompanyId: {
        account: updatedAccount
      }
    }) => {
      setIsLeaveDialogOpen(false);
      onLeaveCurrentCompanySuccess(updatedAccount);
    }
  });

  const handleLeaveCompany = useCallback(() => {
    leaveCurrentCompany({
      variables: {
        accountId: account.id,
        companyId: findAccountCompany(account).id,
        marketId: account.marketId
      }
    });
  }, [leaveCurrentCompany, account]);

  return (
    <div className={styles.cardFooter}>
      <Button variant="outlined" onClick={() => setIsLeaveDialogOpen(true)}>
        {t("profile:leaveCompany.cta")}
      </Button>
      <Dialog open={isLeaveDialogOpen} disablePortal={false}>
        <Dialog.Title hasUnderline>
          {t("profile:leaveCompany.dialog.title")}
        </Dialog.Title>
        <Dialog.Content>
          {/* Test seems big, can I put it in a different typography? */}
          {t("profile:leaveCompany.dialog.content")}
        </Dialog.Content>
        <Dialog.Actions
          cancelLabel={t("profile:leaveCompany.dialog.cta.cancel")}
          onCancelClick={() => setIsLeaveDialogOpen(false)}
          confirmLabel={t("profile:leaveCompany.dialog.cta.confirm")}
          onConfirmClick={() => handleLeaveCompany()}
        />
      </Dialog>
    </div>
  );
};

export const LEAVE_COMPANY = gql`
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
`;
