import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@bmi/table";
import { GetUserProfileQuery } from "../../../../graphql/generated/operations";
import { CertificationRow } from "../../../Tables/CertificationRow";

export const UserCertifications = ({
  certifications
}: {
  certifications: GetUserProfileQuery["account"]["certificationsByDoceboUserId"]["nodes"];
}) => {
  const { t } = useTranslation("common");
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{t("certificationLabels.type")}</Table.Cell>
          <Table.Cell>{t("certificationLabels.certification")}</Table.Cell>
          <Table.Cell>{t("certificationLabels.expiry")}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {certifications.map((certification) => (
          <CertificationRow
            key={certification.id}
            certification={certification}
          />
        ))}
      </Table.Body>
    </Table>
  );
};