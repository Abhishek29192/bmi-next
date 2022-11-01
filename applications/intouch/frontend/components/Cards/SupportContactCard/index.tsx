import { Typography } from "@bmi-digital/components";
import UserIcon from "@material-ui/icons/Person";
import { useTranslation } from "next-i18next";
import React from "react";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { EmailLink, PhoneNumberLink } from "../../IconLink";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

type BmiContactDetailsProps = {
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
};

export const SupportContactCard = ({
  contactDetailsCollection
}: BmiContactDetailsProps) => {
  const { t } = useTranslation("company-page");

  return (
    <SimpleCard>
      <Typography variant="h4" hasUnderline className={styles.title}>
        {t("supportTitle")}
      </Typography>

      {contactDetailsCollection.items.map(
        ({ email, fullName, phoneNumber, subHeading }) => (
          <div
            className={styles.contact}
            key={email}
            data-testid="support-contact"
          >
            {fullName ? (
              <div className={styles.row}>
                <UserIcon className={styles.icon} color="action" />
                <Typography variant="h6">{fullName}</Typography>
              </div>
            ) : null}

            {subHeading ? (
              <div className={styles.row}>
                <span className={styles.icon} />
                <Typography variant="default" className={styles.subtitle}>
                  {subHeading}
                </Typography>
              </div>
            ) : null}

            {phoneNumber ? (
              <div className={styles.row}>
                <PhoneNumberLink phoneNumber={phoneNumber} />
              </div>
            ) : null}

            {email ? (
              <div className={styles.row}>
                <EmailLink emailAddress={email} />
              </div>
            ) : null}
          </div>
        )
      )}
    </SimpleCard>
  );
};
