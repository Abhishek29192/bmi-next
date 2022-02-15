import React from "react";
import { Table } from "@bmi-digital/components";
import {
  Icon,
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi-digital/components";
import { formatDate } from "../../../lib/utils/date";
import { GetUserProfileQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

export type CertificationRowProps = {
  certification: GetUserProfileQuery["account"]["certificationsByDoceboUserId"]["nodes"][0];
};

const isDateInPast = function (date) {
  const today = new Date();
  const expiryDate = new Date(date);

  if (expiryDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
    return "certificateExpired";
  }
};

const getCertificationIcon = function (techtype) {
  switch (techtype) {
    case "FLAT":
      return CertificationFlatRoof;
    case "PITCHED":
      return CertificationPitchedRoof;
    case "OTHER":
      return CertificationOtherTraining;
    default:
      return null;
  }
};

export const CertificationRow = ({ certification }: CertificationRowProps) => {
  return (
    <Table.Row className={isDateInPast(certification.expiryDate)}>
      <Table.Cell>
        <Icon
          source={getCertificationIcon(certification.technology)}
          className={styles.certificationsItemIcon}
        />
      </Table.Cell>
      <Table.Cell>{certification.name}</Table.Cell>
      <Table.Cell className={styles.date}>
        {formatDate(certification.expiryDate)}
      </Table.Cell>
    </Table.Row>
  );
};
