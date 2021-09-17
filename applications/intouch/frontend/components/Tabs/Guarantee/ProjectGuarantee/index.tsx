import React from "react";
import { useTranslation } from "next-i18next";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { ProductGuarantee } from "../ProductGuarantee";
import { SolutionGuarantee } from "../SolutionGuarantee";
import { NoContent } from "../../../../components/NoContent";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { SystemGuarantee } from "../SystemGuarantee";

type ProjectGuaranteeProps = {
  guarantees: GetProjectQuery["project"]["guarantees"]["nodes"];
  onReviewClick: () => void;
  canGuaranteeBeSubmitted: boolean;
};

export const ProjectGuarantee = ({
  guarantees,
  onReviewClick,
  canGuaranteeBeSubmitted
}: ProjectGuaranteeProps) => {
  const { t } = useTranslation("project-page");

  if (guarantees.length === 0) {
    return <NoContent message={t("guarantee_tab.nocontent_message")} />;
  }
  // NOTE: if has multiple guarantees they must ALL be PRODUCT, so ok look at first one
  const guarantee = guarantees[0];

  return (
    <>
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
    </>
  );
};
