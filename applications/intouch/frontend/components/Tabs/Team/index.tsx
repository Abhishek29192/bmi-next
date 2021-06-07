import React from "react";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import styles from "./styles.module.scss";

export type TeamTabProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const TeamTab = ({ children }: TeamTabProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined">{t("Upload file")}</Button>
      </div>
      <div className={styles.body}>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{t("Responsible Installer")}</Table.Cell>
              <Table.Cell>{t("Team Member")}</Table.Cell>
              <Table.Cell>{t("Role")}</Table.Cell>
              <Table.Cell>{t("Certification")}</Table.Cell>
              <Table.Cell>{t("Remove")}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {/* TODO: Make this loop over an array */}
            <Table.Row>
              <Table.Cell>&nbsp;</Table.Cell>
              <Table.Cell>Lucy Walsh</Table.Cell>
              <Table.Cell>Company Admin</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
