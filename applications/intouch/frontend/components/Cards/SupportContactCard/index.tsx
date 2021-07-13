import React from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import UserIcon from "@material-ui/icons/Person";
import Typography from "@bmi/typography";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { SimpleCard } from "../SimpleCard";
import { EmailLink, PhoneNumberLink } from "../../IconLink";
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
        {t("support.title")}
      </Typography>

      {contactDetailsCollection.items.map(
        ({ email, fullName, phoneNumber, subHeading }) => (
          <div
            className={styles.contact}
            key={email}
            data-testid="support-contact"
          >
            <div className={styles.row}>
              <UserIcon className={styles.icon} color="action" />
              <Typography variant="h6">{fullName}</Typography>
            </div>

            <div className={styles.row}>
              <span className={styles.icon} />
              <Typography variant="default" className={styles.subtitle}>
                {subHeading}
              </Typography>
            </div>

            <div className={styles.row}>
              <PhoneNumberLink phoneNumber={phoneNumber} />
            </div>

            <div className={styles.row}>
              <EmailLink emailAddress={email} />
            </div>
          </div>
        )
      )}
    </SimpleCard>
  );
};

export const ContactDetailsCollectionFragment = gql`
  fragment ContactDetailsCollectionFragment on ContactDetailsCollection {
    items {
      fullName
      subHeading
      email
      phoneNumber
    }
  }
`;
