import React from "react";
import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { Technology } from "@bmi/intouch-api-types";
import Icon, {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/icon";
import Typography from "@bmi/typography";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

type CertificationsItemProps = {
  label: string;
  iconSource: SVGImport;
};

const CertificationsItem = ({ label, iconSource }: CertificationsItemProps) => (
  <div data-testid="certifications-item" className={styles.certificationsItem}>
    <Icon source={iconSource} className={styles.certificationsItemIcon} />
    <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
      {label}
    </Typography>
  </div>
);

export type CertificationsCardProps = {
  certifications: Technology[];
  title: string;
};

export const CertificationsCard = ({
  certifications,
  title
}: CertificationsCardProps) => {
  const { t } = useTranslation("common");
  const isCertifiedPitched = certifications.indexOf("PITCHED") > -1;
  const isCertifiedFlat = certifications.indexOf("FLAT") > -1;
  const isCertifiedOther = certifications.indexOf("OTHER") > -1;

  return (
    <SimpleCard>
      <Typography
        variant="h4"
        style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}
      >
        {title}
      </Typography>

      <div className={styles.certificationsItemList}>
        {isCertifiedPitched && (
          <CertificationsItem
            iconSource={CertificationPitchedRoof}
            label={t("certifications.pitched")}
          />
        )}

        {isCertifiedFlat && (
          <CertificationsItem
            iconSource={CertificationFlatRoof}
            label={t("certifications.flat")}
          />
        )}

        {isCertifiedOther && (
          <CertificationsItem
            iconSource={CertificationOtherTraining}
            label={t("certifications.other")}
          />
        )}
      </div>
    </SimpleCard>
  );
};

export const CompanyCertifications = gql`
  fragment CompanyCertifications on Company {
    certifications
  }
`;
