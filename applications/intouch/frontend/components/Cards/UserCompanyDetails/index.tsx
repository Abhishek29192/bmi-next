import React from "react";
import Typography from "@bmi/typography";
import Grid from "@bmi/grid";
import { Phone, Email, Facebook, LinkedIn, Public } from "@material-ui/icons";
import { useTranslation } from "next-i18next";
import { GetUserProfileQuery } from "../../../graphql/generated/operations";
import { IconLink } from "../../IconLink";
import { InfoPair } from "../../InfoPair";
import { Address } from "../../Address";
import styles from "./styles.module.scss";

export type UserCompanyDetailsProps = {
  company: GetUserProfileQuery["account"]["companyMembers"]["nodes"][0]["company"];
};

export const UserCompanyDetails = ({ company }: UserCompanyDetailsProps) => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.main}>
      <Typography variant="h4" className={styles.heading} hasUnderline>
        {t("Company Details")}
      </Typography>
      <div className={styles.body}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} xl={3}>
            <img src={company.logo} alt="" className={styles.logo} />
          </Grid>
          <Grid item xs={12} lg={9} xl={9}>
            <div>
              <InfoPair title={t("Company description")}>
                {company.aboutUs}
              </InfoPair>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                <InfoPair title={t("Registered address")}>
                  <Address address={company.registeredAddress} />
                </InfoPair>
              </Grid>

              <Grid item xs={12} xl={6}>
                <InfoPair title={t("Contact information")}>
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
    </div>
  );
};
