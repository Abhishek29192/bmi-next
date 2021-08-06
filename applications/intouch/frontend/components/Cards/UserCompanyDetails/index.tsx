import React, { useState } from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import Grid from "@bmi/grid";
import { Phone, Email, Facebook, LinkedIn, Public } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetUserProfileQuery } from "../../../graphql/generated/operations";
import { IconLink } from "../../IconLink";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import logger from "../../../lib/logger";
import { useLeaveCompanyMutation } from "../../../graphql/generated/hooks";
import { useAccountContext } from "../../../context/AccountContext";
import { findAccountCompany } from "../../../lib/account";
import styles from "./styles.module.scss";

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
    }
  }
`;

export type UserCompanyDetailsProps = {
  company: GetUserProfileQuery["account"]["companyMembers"]["nodes"][0]["company"];
};

export const UserCompanyDetails = ({ company }: UserCompanyDetailsProps) => {
  const { t } = useTranslation(["common", "profile-page"]);
  const { account } = useAccountContext();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [leaveCurrentCompany] = useLeaveCompanyMutation({
    onError: (error) => {
      logger({
        severity: "ERROR",
        message: `There was an error leaving a company: ${error.toString()}`
      });
      setIsLeaveDialogOpen(false);
    },
    onCompleted: () => {
      setIsLeaveDialogOpen(false);
      window.location.reload();
    }
  });

  const handleLeaveCompany = () => {
    leaveCurrentCompany({
      variables: {
        accountId: account.id,
        companyId: findAccountCompany(account).id,
        marketId: account.marketId
      }
    });
  };

  return (
    <div className={styles.main}>
      <Typography variant="h4" className={styles.heading} hasUnderline>
        {t("common:Company Details")}
      </Typography>
      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3}>
            <img src={company.logo} alt="" className={styles.logo} />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            <div>
              <InfoPair title={t("common:Company description")}>
                {company.aboutUs}
              </InfoPair>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                <InfoPair title={t("common:Registered address")}>
                  <Address address={company.registeredAddress} />
                </InfoPair>
              </Grid>

              <Grid item xs={12} xl={6}>
                <InfoPair title={t("common:Contact information")}>
                  {company.phone ? (
                    <IconLink
                      href={"tel:" + company.phone}
                      icon={Phone}
                      label={company.phone}
                    />
                  ) : null}

                  {company.publicEmail ? (
                    <IconLink
                      href={"mailto:" + company.publicEmail}
                      icon={Email}
                      label={company.publicEmail}
                    />
                  ) : null}

                  {company.website ? (
                    <IconLink
                      href={company.website}
                      icon={Public}
                      label={company.website}
                      isExternal
                    />
                  ) : null}

                  {company.facebook ? (
                    <IconLink
                      href={company.facebook}
                      icon={Facebook}
                      label={company.facebook}
                      isExternal
                    />
                  ) : null}

                  {company.linkedIn ? (
                    <IconLink
                      href={company.linkedIn}
                      icon={LinkedIn}
                      label={company.linkedIn}
                      isExternal
                    />
                  ) : null}
                </InfoPair>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={styles.cardFooter}>
        <Button variant="outlined" onClick={() => setIsLeaveDialogOpen(true)}>
          {t("profile-page:leaveCompany.cta")}
        </Button>
        <Dialog open={isLeaveDialogOpen}>
          <Dialog.Title hasUnderline>
            {t("profile-page:leaveCompany.dialog.title")}
          </Dialog.Title>
          <Dialog.Content>
            {/* Test seems big, can I put it in a different typography? */}
            {t("profile-page:leaveCompany.dialog.content")}
          </Dialog.Content>
          <Dialog.Actions
            cancelLabel={t("profile-page:leaveCompany.dialog.cta.cancel")}
            onCancelClick={() => setIsLeaveDialogOpen(false)}
            confirmLabel={t("profile-page:leaveCompany.dialog.cta.confirm")}
            onConfirmClick={() => handleLeaveCompany()}
          />
        </Dialog>
      </div>
    </div>
  );
};
