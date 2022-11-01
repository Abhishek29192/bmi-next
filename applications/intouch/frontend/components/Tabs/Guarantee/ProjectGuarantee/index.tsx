import { AlertBanner, Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";
import { NoContent } from "../../../../components/NoContent";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import {
  solutionGuaranteeValidate,
  SolutionGuaranteeValidationError,
  SolutionGuaranteeValidationErrorMessage
} from "../../../../lib/utils/guarantee";
import { ProductGuarantee } from "../ProductGuarantee";
import { SolutionGuarantee } from "../SolutionGuarantee";
import { SystemGuarantee } from "../SystemGuarantee";
import styles from "./styles.module.scss";

type ProjectGuaranteeProps = {
  project: GetProjectQuery["project"];
  onReviewClick: () => void;
  applyGuaranteeToggle: () => React.ReactElement;
};

export const ProjectGuarantee = ({
  project,
  onReviewClick,
  applyGuaranteeToggle: ApplyGuaranteeToggle
}: ProjectGuaranteeProps) => {
  const { t } = useTranslation("project-page");

  const { guarantees } = project;

  if (guarantees.nodes.length === 0) {
    return (
      <>
        <div className={styles.header}>
          <div className={styles["header__grid--alignRight"]}>
            <ApplyGuaranteeToggle />
          </div>
        </div>
        <NoContent message={t("guarantee_tab.nocontent_message")} />
      </>
    );
  }
  // NOTE: if has multiple guarantees they must ALL be PRODUCT, so ok look at first one
  const guarantee = guarantees.nodes[0];

  const guaranteeSubmitValidateResult = solutionGuaranteeValidate(project);
  const showSolutionAlert =
    !guaranteeSubmitValidateResult.isValid &&
    ["NEW", "REJECTED"].includes(guarantee.status);

  return (
    <>
      {showSolutionAlert && (
        <SolutionGuaranteeAlert
          isNewGuarantee={guarantee.status === "NEW"}
          validationError={guaranteeSubmitValidateResult.validationError}
        />
      )}
      <div className={styles.header}>
        <div className={styles.header__grid}>
          <Typography component="h1" variant="h6">
            {t(`guarantee.type.${guarantee.coverage}`)}
          </Typography>
        </div>
        <div className={styles.header__grid}>
          <ApplyGuaranteeToggle />
        </div>
      </div>
      <div className={styles.body}>
        {guarantee.coverage === "PRODUCT" ? (
          <ProductGuarantee guarantees={guarantees.nodes} />
        ) : guarantee.coverage === "SYSTEM" ? (
          <SystemGuarantee guarantee={guarantee} />
        ) : (
          <SolutionGuarantee
            project={project}
            guarantee={guarantee}
            onReviewClick={onReviewClick}
            canGuaranteeBeSubmitted={guaranteeSubmitValidateResult.isValid}
          />
        )}
      </div>
    </>
  );
};

type SolutionGuaranteeAlertProps = {
  isNewGuarantee: boolean;
  validationError: SolutionGuaranteeValidationError;
};
const SolutionGuaranteeAlert = ({
  isNewGuarantee,
  validationError
}: SolutionGuaranteeAlertProps) => {
  const { t } = useTranslation("project-page");
  return (
    <AlertBanner severity={"warning"}>
      <AlertBanner.Title>
        {t("project-page:guarantee.incompleteGuaranteeAlert.title")}
      </AlertBanner.Title>
      {isNewGuarantee && (
        <Typography variant="body1">
          {t("project-page:guarantee.incompleteGuaranteeAlert.description")}
        </Typography>
      )}
      <Typography variant="body1">
        {/* eslint-disable-next-line security/detect-object-injection */}
        {t(`${SolutionGuaranteeValidationErrorMessage[validationError]}`)}
      </Typography>
    </AlertBanner>
  );
};
