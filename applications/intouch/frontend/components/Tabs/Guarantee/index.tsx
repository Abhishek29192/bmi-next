import React, { useState } from "react";
import Button from "@bmi/button";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { guaranteeApplicationValidate } from "../../../lib/utils/guarantee";
import styles from "./styles.module.scss";
import { ApplyGuaranteeDialog } from "./ApplyGuaranteeDialog";
import { ProjectGuarantee } from "./ProjectGuarantee";
import SolutionGuaranteeReviewDialog from "./SolutionGuaranteeReviewDialog";

export type GuaranteeTabProps = {
  project: GetProjectQuery["project"];
  isApplyGuarantee: boolean;
};

export const GuaranteeTab = ({
  project,
  isApplyGuarantee
}: GuaranteeTabProps) => {
  const { t } = useTranslation("project-page");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isReviewOpen, setReviewOpen] = useState(false);

  const guaranteeApplicationValidateResult =
    guaranteeApplicationValidate(project);

  const ApplyGuaranteeDialogToggle = () =>
    isApplyGuarantee ? (
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={!guaranteeApplicationValidateResult.isValid}
      >
        {t("guarantee_tab.header")}
      </Button>
    ) : null;

  return (
    <div className={styles.main}>
      {isApplyGuarantee && (
        <div>
          {!guaranteeApplicationValidateResult.isValid && (
            <div className={styles.alert}>
              <AlertBanner severity={"warning"}>
                <AlertBanner.Title>
                  {t("guaranteeApplyAlert.title")}
                </AlertBanner.Title>
                {t(guaranteeApplicationValidateResult.validationError)}
              </AlertBanner>
            </div>
          )}
        </div>
      )}

      <div className={styles.body}>
        <ProjectGuarantee
          project={project}
          onReviewClick={() => setReviewOpen(true)}
          applyGuaranteeToggle={() => <ApplyGuaranteeDialogToggle />}
        />
      </div>
      <ApplyGuaranteeDialog
        isOpen={isDialogOpen}
        project={project}
        onCloseClick={() => setDialogOpen(false)}
      />
      <SolutionGuaranteeReviewDialog
        isOpen={isReviewOpen}
        project={project}
        onCloseClick={() => setReviewOpen(false)}
      />
    </div>
  );
};
