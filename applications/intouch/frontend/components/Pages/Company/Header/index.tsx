import React, { useState } from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Facebook, LinkedIn } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { EmailLink, PhoneNumberLink, WebsiteLink } from "../../../IconLink";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import { EditCompanyButton } from "../EditCompany/Button";
import styles from "./styles.module.scss";

export type CompanyHeaderProps = {
  company: GetCompanyQuery["company"];
};

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {t("common:Company Details")}
      </Typography>

      <Typography className={styles.businessType} variant="h5">
        {t(`company-page:business_type.${company.businessType}`)}
      </Typography>

      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3}>
            {/* TODO: Placeholder logo */}
            <img src={company.logo} alt="" style={{ maxWidth: "100%" }} />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            {company.aboutUs ? (
              <div>
                <InfoPair title="Company description">
                  {company.aboutUs}
                </InfoPair>
              </div>
            ) : null}

            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                {company.tradingAddress ? (
                  <InfoPair title="Main office address">
                    <Address address={company.tradingAddress} />
                  </InfoPair>
                ) : null}

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InfoPair title="Company Owner">
                    <Typography>{company.ownerFullname}</Typography>

                    {company.ownerPhone ? (
                      <PhoneNumberLink phoneNumber={company.ownerPhone} />
                    ) : null}

                    {company.ownerEmail ? (
                      <EmailLink emailAddress={company.ownerEmail} />
                    ) : null}
                  </InfoPair>
                </div>
              </Grid>

              <Grid item xs={12} xl={6}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InfoPair title="Contact information">
                    {company.phone ? (
                      <PhoneNumberLink phoneNumber={company.phone} />
                    ) : null}

                    {company.publicEmail ? (
                      <EmailLink emailAddress={company.publicEmail} />
                    ) : null}

                    {company.website ? (
                      <WebsiteLink url={company.website} />
                    ) : null}

                    {company.facebook ? (
                      <WebsiteLink icon={Facebook} url={company.facebook} />
                    ) : null}

                    {company.linkedIn ? (
                      <WebsiteLink icon={LinkedIn} url={company.linkedIn} />
                    ) : null}
                  </InfoPair>
                </div>
              </Grid>

              <EditCompanyButton company={company} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export const CompanyHeaderDetailsFragment = gql`
  fragment CompanyHeaderDetailsFragment on Company {
    businessType
    logo
    aboutUs
    tradingAddress {
      ...AddressLinesFragment
      # These are required for the Alert banner
      coordinates {
        x
        y
      }
    }
    ownerFullname
    ownerPhone
    ownerEmail
    phone
    publicEmail
    website
    facebook
    linkedIn
  }
`;
