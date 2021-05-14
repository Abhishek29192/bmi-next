import React from "react";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { getValidFeatures } from "../utils/product-details-transforms";
import { Classification } from "./ProductBaseTypes";
import ProductFeaturesTable from "./ProductFeaturesTable";
import styles from "./styles/ProductTechnicalSpec.module.scss";

type ProductTechnicalSpecProps = {
  classifications: readonly Classification[];
  classificationNamespace: string;
};

const ProductTechnicalSpec = ({
  classifications,
  classificationNamespace
}: ProductTechnicalSpecProps) => {
  if (classifications.length === 0) {
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        No technical specifications found for this product.
      </div>
    );
  }

  if (classifications.length === 1) {
    const classification = classifications[0];
    const validFeatures = getValidFeatures(
      classificationNamespace,
      classification.features
    );
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        <ProductFeaturesTable
          key={`tech-spec-${classification.name}`}
          features={validFeatures}
          rowBgColorPattern="odd"
        />
      </div>
    );
  }

  if (classifications.length > 1) {
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        <Accordion noInnerPadding>
          {classifications.map((classification) => {
            const validFeatures = getValidFeatures(
              classificationNamespace,
              classification.features
            );
            return (
              <Accordion.Item
                isExpanded
                key={`tech-spec-${classification.name}`}
              >
                <Accordion.Summary>
                  <Typography variant="h6">{classification.name}</Typography>
                </Accordion.Summary>
                <Accordion.Details className={styles["accordion-details"]}>
                  <ProductFeaturesTable
                    features={validFeatures}
                    rowBgColorPattern="even"
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
