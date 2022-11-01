import { AlertBanner, Button } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { guaranteeApplicationValidate } from "../../../lib/utils/guarantee";
import { ApplyGuaranteeDialog } from "./ApplyGuaranteeDialog";
import { ProjectGuarantee } from "./ProjectGuarantee";
import SolutionGuaranteeReviewDialog from "./SolutionGuaranteeReviewDialog";
import styles from "./styles.module.scss";

export type GuaranteeTabProps = {
  project: GetProjectQuery["project"];
  isApplyGuarantee: boolean;
  onGuaranteeSubmitted: () => void;
};

export const GuaranteeTab = ({
  project,
  isApplyGuarantee,
  onGuaranteeSubmitted
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
        onGuaranteeSubmitted={onGuaranteeSubmitted}
      />
      <SolutionGuaranteeReviewDialog
        isOpen={isReviewOpen}
        project={project}
        onCloseClick={() => setReviewOpen(false)}
      />
    </div>
  );
};
