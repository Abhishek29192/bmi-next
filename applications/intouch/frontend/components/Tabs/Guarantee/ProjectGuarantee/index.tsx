import React from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import AlertBanner from "@bmi/alert-banner";
import { ProductGuarantee } from "../ProductGuarantee";
import { SolutionGuarantee } from "../SolutionGuarantee";
import { NoContent } from "../../../../components/NoContent";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { SystemGuarantee } from "../SystemGuarantee";
import styles from "./styles.module.scss";

type ProjectGuaranteeProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
  applyGuaranteeToggle: () => React.ReactElement;
};

export const ProjectGuarantee = ({
  guarantees,
  onReviewClick,
  canGuaranteeBeSubmitted,
  applyGuaranteeToggle: ApplyGuaranteeToggle
}: ProjectGuaranteeProps) => {
  const { t } = useTranslation("project-page");

  if (guarantees.length === 0) {
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
  const guarantee = guarantees[0];
  const showAlert =
    guarantee.coverage === "SOLUTION" &&
    !canGuaranteeBeSubmitted &&
    guarantee.status === "NEW";

  return (
    <>
      {showAlert && (
        <AlertBanner severity={"warning"}>
          <AlertBanner.Title>
            {t("project-page:guarantee.incompleteGuaranteeAlert.title")}
          </AlertBanner.Title>
          {t("project-page:guarantee.incompleteGuaranteeAlert.description")}
        </AlertBanner>
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
          <ProductGuarantee guarantees={guarantees} />
        ) : guarantee.coverage === "SYSTEM" ? (
          <SystemGuarantee guarantee={guarantee} />
        ) : (
          <SolutionGuarantee
            guarantee={guarantee}
            onReviewClick={onReviewClick}
            canGuaranteeBeSubmitted={canGuaranteeBeSubmitted}
          />
        )}
      </div>
    </>
  );
};
