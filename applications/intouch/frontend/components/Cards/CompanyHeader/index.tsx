import React, { useMemo } from "react";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Facebook, LinkedIn } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { BUSINESS_TYPES } from "../../../lib/constants";
import { EmailLink, PhoneNumberLink, WebsiteLink } from "../../IconLink";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import styles from "./styles.module.scss";

export type CompanyHeaderProps = {
  company: GetCompanyQuery["company"];
};

const businessTypeLabelMap = (t): { [key: string]: string } => ({
  [BUSINESS_TYPES.CONTRACTOR]: t("company-page:business_type.contractor"),
  [BUSINESS_TYPES.ARCHITECT]: t("company-page:business_type.architect"),
  [BUSINESS_TYPES.MERCHANT]: t("company-page:business_type.merchant"),
  [BUSINESS_TYPES.CORP_DEVELOPER]: t(
    "company-page:business_type.corp_developer"
  ),
  [BUSINESS_TYPES.COMPANY_ADMIN]: t("company-page:business_type.company_admin)")
});

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const { t } = useTranslation(["common", "company-page"]);
  const businessTypeLabel = useMemo(
    () => businessTypeLabelMap(t)[company.businessType],
    [company.businessType, t, businessTypeLabelMap]
  );
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {t("common:Company Details")}
      </Typography>

      <Typography className={styles.businessType} variant="h5">
        {businessTypeLabel}
      </Typography>

      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3}>
            <img src={company.logo} alt="" style={{ maxWidth: "100%" }} />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            <div>
              <InfoPair title="Company description">{company.aboutUs}</InfoPair>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                <InfoPair title="Main office address">
                  <Address address={company.tradingAddress} />
                </InfoPair>

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
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
