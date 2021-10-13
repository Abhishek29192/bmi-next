import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Icon, { FilePDF, Arrow } from "@bmi/icon";
import { ProductRow } from "../ProductRow";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import styles from "./styles.module.scss";

type SolutionGuaranteesProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
};

export const SolutionGuarantee = ({
  guarantee,
  onReviewClick,
  canGuaranteeBeSubmitted
}: SolutionGuaranteesProps) => {
  return (
    <SolutionGuaranteeCard
      guarantee={guarantee}
      onReviewClick={onReviewClick}
      canGuaranteeBeSubmitted={canGuaranteeBeSubmitted}
    />
  );
};

type SolutionGuaranteeCardProps = {
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
};
const SolutionGuaranteeCard = ({
  guarantee,
  onReviewClick,
  canGuaranteeBeSubmitted
}: SolutionGuaranteeCardProps) => {
  const { t } = useTranslation(["common", "project-page"]);

  const {
    systemBySystemBmiRef: system,
    signedFileStorageUrl,
    status
  } = guarantee;

  const products = system.systemMembersBySystemBmiRef.nodes.map(
    (member) => member.productByProductBmiRef
  );

  const canGuaranteePdfDownload = signedFileStorageUrl && status === "APPROVED";
  return (
    <div className={styles.body}>
      <div className={styles.body__title}>
        <Typography component="h2" variant="h6">
          {system.name}
        </Typography>
      </div>
      <div className={styles.body__description}>
        <Typography variant="subtitle2">{system.description}</Typography>
      </div>
      <div className={styles.body__footer}>
        {canGuaranteePdfDownload && (
          <div className={styles.footer__buttonContainer}>
            <Button
              variant="outlined"
              action={{
                model: "htmlLink",
                href: signedFileStorageUrl,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              startIcon={
                <Icon className={styles.body__logo} source={FilePDF} />
              }
              disabled={!canGuaranteePdfDownload}
            >
              {t("common:SavePdf")}
            </Button>
          </div>
        )}
        <div className={styles.footer__buttonContainer}>
          <AccessControl dataModel="project" action="submitSolutionGuarantee">
            <Button
              onClick={onReviewClick}
              variant="outlined"
              startIcon={<Icon className={styles.body__logo} source={Arrow} />}
              disabled={!canGuaranteeBeSubmitted}
            >
              {t("project-page:guarantee_tab.submit_solution")}
            </Button>
          </AccessControl>
        </div>
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
  );
};
