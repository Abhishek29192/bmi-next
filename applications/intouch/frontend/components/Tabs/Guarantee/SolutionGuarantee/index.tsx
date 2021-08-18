import React from "react";
import { useTranslation } from "react-i18next";
import { Guarantee } from "@bmi/intouch-api-types";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import Icon, { FilePDF } from "@bmi/icon";
import { ProductRow } from "../ProductRow";
import { guaranteePrerequsitesMet } from "../../../../lib/utils/guarantee";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import styles from "./styles.module.scss";

type SolutionGuaranteesProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
};

export const SolutionGuarantee = ({ guarantees }: SolutionGuaranteesProps) => {
  const { t } = useTranslation(["common", "project-page"]);
  return (
    <div>
      <Typography component="h1" variant="h6">
        {t("project-page:guarantee.type.solution")}
      </Typography>
      {guarantees.map((guarantee) => (
        <SolutionGuaranteeCard key={guarantee.id} guarantee={guarantee} />
      ))}
    </div>
  );
};

type SolutionGuaranteeCardProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
};
const SolutionGuaranteeCard = ({ guarantee }: SolutionGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  const canGuaranteeBeSubmitted = guaranteePrerequsitesMet(guarantee);

  const { systemBySystemBmiRef: system } = guarantee;

  const products = system.systemMembersBySystemBmiRef.nodes.map(
    (member) => member.productByProductBmiRef
  );

  return (
    <div className={styles.main}>
      {!canGuaranteeBeSubmitted && (
        <AlertBanner severity={"warning"}>
          <AlertBanner.Title>
            {t("project-page:guarantee.incompleteGuaranteeAlert.title")}
          </AlertBanner.Title>
          {t("project-page:guarantee.incompleteGuaranteeAlert.description")}
        </AlertBanner>
      )}
      <div className={styles.body}>
        <div className={styles.body__title}>
          <Typography component="h2" variant="h6">
            {system.name}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" color="textSecondary">
            {system.description}
          </Typography>
        </div>
        <div className={styles.body__footer}>
          <Button
            variant="outlined"
            startIcon={<Icon className={styles.body__logo} source={FilePDF} />}
          >
            {t("common:SavePdf")}
          </Button>
        </div>
        <div>
          <Table>
            <Table.Body>
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};
