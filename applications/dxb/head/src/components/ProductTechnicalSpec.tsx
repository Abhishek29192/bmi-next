import React from "react";
import { Accordion } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Table } from "@bmi/components";
import { getValidFeatures } from "../utils/product-details-transforms";
import { microCopy } from "../constants/microCopies";
import { Classification, ClassificationCodeEnum } from "./types/pim";
import ProductFeaturesTable from "./ProductFeaturesTable";
import styles from "./styles/ProductTechnicalSpec.module.scss";
import { useSiteContext } from "./Site";

type ProductTechnicalSpecProps = {
  classifications: readonly Classification[];
  classificationNamespace: string;
  isSingleVariant?: boolean;
};

const ProductTechnicalSpec = ({
  classifications,
  classificationNamespace,
  isSingleVariant
}: ProductTechnicalSpecProps) => {
  const { getMicroCopy } = useSiteContext();
  const NoTechSpechMessage = () => (
    <div className={styles["ProductTechnicalSpec"]}>
      {getMicroCopy(microCopy.PDP_NO_TECH_SPEC_MESSAGE)}
    </div>
  );
  if (classifications.length === 0) {
    return <NoTechSpechMessage />;
  }

  if (classifications.length === 1) {
    const classification = classifications[0];
    const validFeatures = getValidFeatures(
      classificationNamespace,
      classification.features
    );
    if (
      isSingleVariant &&
      classification.code === ClassificationCodeEnum.APPEARANCE_ATTRIBUTE
    ) {
      return <NoTechSpechMessage />;
    }
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        <ProductFeaturesTable
          key={`tech-spec-${classification.name}`}
          features={validFeatures}
          rowBgColorPattern="even"
          HeadRow={
            <Table.Row>
              <Table.Cell>{classification.name}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          }
          hasNoBorder={false}
        />
      </div>
    );
  }

  if (classifications.length > 1) {
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        <Accordion noInnerPadding>
          {classifications.map((classification, index) => {
            const validFeatures = getValidFeatures(
              classificationNamespace,
              classification.features
            );
            if (
              isSingleVariant &&
              classification.code ===
                ClassificationCodeEnum.APPEARANCE_ATTRIBUTE
            ) {
              return <></>;
            }
            return (
              <Accordion.Item
                key={`tech-spec-${classification.name}`}
                defaultExpanded={true}
              >
                <Accordion.Summary>
                  <Typography variant="h6">{classification.name}</Typography>
                </Accordion.Summary>
                <Accordion.Details className={styles["accordion-details"]}>
                  <ProductFeaturesTable
                    features={validFeatures}
                    rowBgColorPattern="even"
                    hasNoBorder={true}
                  />
                </Accordion.Details>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
    );
  }
};

export default ProductTechnicalSpec;
