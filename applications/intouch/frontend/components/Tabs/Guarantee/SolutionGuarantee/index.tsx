import {
  Arrow,
  Button,
  FilePDF,
  Icon,
  Typography
} from "@bmi-digital/components";
import React from "react";
import { useTranslation } from "react-i18next";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { ProductCard } from "../ProductCard";
import styles from "./styles.module.scss";

type SolutionGuaranteesProps = {
  project: GetProjectQuery["project"];
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
};

export const SolutionGuarantee = ({
  project,
  guarantee,
  onReviewClick,
  canGuaranteeBeSubmitted
}: SolutionGuaranteesProps) => {
  return (
    <SolutionGuaranteeCard
      project={project}
      guarantee={guarantee}
      onReviewClick={onReviewClick}
      canGuaranteeBeSubmitted={canGuaranteeBeSubmitted}
    />
  );
};

type SolutionGuaranteeCardProps = {
  project: GetProjectQuery["project"];
  guarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
};

const SolutionGuaranteeCard = ({
  project,
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

  const canGuaranteePdfDownload = signedFileStorageUrl && status === "ISSUED";
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
        {["NEW", "REJECTED"].includes(status) && (
          <div className={styles.footer__buttonContainer}>
            <AccessControl
              dataModel="project"
              action="submitSolutionGuarantee"
              extraData={{ isArchived: project.hidden }}
            >
              <Button
                onClick={onReviewClick}
                variant="outlined"
                startIcon={
                  <Icon className={styles.body__logo} source={Arrow} />
                }
                disabled={!canGuaranteeBeSubmitted}
              >
                {t("project-page:guarantee_tab.submit_solution")}
              </Button>
            </AccessControl>
          </div>
        )}
      </div>
      <ProductCard products={products} />
    </div>
  );
};
