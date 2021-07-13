import React from "react";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Phone, Email, Facebook, LinkedIn, Public } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { IconLink } from "../../IconLink";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import styles from "./styles.module.scss";

export type CompanyHeaderProps = {
  company: GetCompanyQuery["company"];
};

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {t("Company Details")}
      </Typography>
      <Typography className={styles.businessType} variant="h5">
        {t(company.businessType)}
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
                  <Address address={company.registeredAddress} />
                </InfoPair>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InfoPair title="Company Owner">
                    <Typography>{company.ownerFullname}</Typography>
                    {company.ownerPhone ? (
                      <IconLink
                        href={"tel:" + company.ownerPhone}
                        icon={Phone}
                        label={company.ownerPhone}
                      />
                    ) : null}

                    {company.ownerEmail ? (
                      <IconLink
                        href={"mailto:" + company.ownerEmail}
                        icon={Email}
                        label={company.ownerEmail}
                      />
                    ) : null}
                  </InfoPair>
                </div>
              </Grid>

              <Grid item xs={12} xl={6}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InfoPair title="Contact information">
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
                      />
                    ) : null}

                    {company.facebook ? (
                      <IconLink
                        href={company.facebook}
                        icon={Facebook}
                        label={company.facebook}
                      />
                    ) : null}

                    {company.linkedIn ? (
                      <IconLink
                        href={company.linkedIn}
                        icon={LinkedIn}
                        label={company.linkedIn}
                      />
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
