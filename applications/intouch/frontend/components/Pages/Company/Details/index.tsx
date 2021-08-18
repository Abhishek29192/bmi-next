import React from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Facebook, LinkedIn } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { EmailLink, PhoneNumberLink, WebsiteLink } from "../../../IconLink";
import { InfoPair } from "../../../InfoPair";
import { Address } from "../../../Address";
import styles from "./styles.module.scss";

export type CompanyHeaderProps = {
  company: Partial<GetCompanyQuery["company"]>;
  actions: JSX.Element;
  showName?: boolean;
  showBusinessType?: boolean;
  showLogo?: boolean;
  showAboutUs?: boolean;
  showCompanyOwner?: boolean;
};

export const CompanyDetails = ({
  company,
  actions,
  showName = true,
  showBusinessType = true,
  showLogo = true,
  showAboutUs = true,
  showCompanyOwner = true
}: CompanyHeaderProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {t("company-page:details.title")}
      </Typography>

      {showBusinessType ? (
        <Typography className={styles.businessType} variant="h5">
          {t(`company-page:businessType.${company.businessType}`)}
        </Typography>
      ) : null}

      <div className={styles.body}>
        <Grid container spacing={3}>
          {showLogo ? (
            <Grid item xs={12} lg={3} xl={3}>
              {/* TODO: Placeholder logo */}
              <img src={company.logo} alt="" style={{ maxWidth: "100%" }} />
            </Grid>
          ) : null}
          <Grid item xs={12} lg={9} xl={9}>
            {showAboutUs && company.aboutUs ? (
              <div>
                <InfoPair title={t("company-page:details.aboutUs")}>
                  {company.aboutUs}
                </InfoPair>
              </div>
            ) : null}

            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                {showName ? (
                  <InfoPair title={t("company-page:details.name")}>
                    {company.name}
                  </InfoPair>
                ) : null}

                {company.tradingAddress ? (
                  <InfoPair title={t("company-page:details.tradingAddress")}>
                    <Address address={company.tradingAddress} />
                  </InfoPair>
                ) : null}

                {showCompanyOwner && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <InfoPair title={t("company-page:details.owner")}>
                      <Typography>{company.ownerFullname}</Typography>

                      {company.ownerPhone ? (
                        <PhoneNumberLink phoneNumber={company.ownerPhone} />
                      ) : null}

                      {company.ownerEmail ? (
                        <EmailLink emailAddress={company.ownerEmail} />
                      ) : null}
                    </InfoPair>
                  </div>
                )}
              </Grid>

              <Grid item xs={12} xl={6}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InfoPair title={t("company-page:details.contactDetails")}>
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

              {actions}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export const COMPANY_DETAILS_FRAGMENT = gql`
  fragment CompanyDetailsFragment on Company {
    name
    businessType
    logo
    aboutUs
    tradingAddress {
      id
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
