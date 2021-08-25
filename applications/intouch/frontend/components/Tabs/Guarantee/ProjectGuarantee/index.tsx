import React from "react";
import groupBy from "lodash.groupby";
import { useTranslation } from "next-i18next";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { ProductGuarantee } from "../ProductGuarantee";
import { SolutionGuarantee } from "../SolutionGuarantee";
import { NoContent } from "../../../../components/NoContent";
import { GetProjectQuery } from "../../../../graphql/generated/operations";

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

  const projectGuarantees = groupBy(guarantees, "guaranteeType.coverage");
  return (
    <>
      {guarantees.length === 0 ? (
        <NoContent message={t("guarantee_tab.nocontent_message")} />
      ) : (
        <Accordion>
          {Object.entries(projectGuarantees).map(([key, guarantees]) => {
            return (
              <Accordion.Item key={key} defaultExpanded={true}>
                <Accordion.Summary>
                  <Typography variant="h6">
                    {guarantees?.[0]?.guaranteeType?.displayName ||
                      t("guarantee.notRequested")}
                  </Typography>
                </Accordion.Summary>
                <Accordion.Details>
                  <div>
                    {key === "PRODUCT" ? (
                      <ProductGuarantee guarantees={guarantees} />
                    ) : (
                      // System and solution guarantee have  same view...
                      <SolutionGuarantee
                        guarantees={guarantees}
                        onReviewClick={onReviewClick}
                        canGuaranteeBeSubmitted={canGuaranteeBeSubmitted}
                      />
                    )}
                  </div>
                </Accordion.Details>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </>
  );
};
