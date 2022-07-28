import { Accordion, Table, Typography } from "@bmi/components";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { Product } from "../types/pim";
import ProductFeaturesTable from "./ProductFeaturesTable";
import { useSiteContext } from "./Site";
import styles from "./styles/ProductTechnicalSpec.module.scss";

type ProductTechnicalSpecProps = {
  product: Product;
};

//TODO: will this component may need to update and use
// `product.measurements` property to display measurements??
const ProductTechnicalSpec = ({ product }: ProductTechnicalSpecProps) => {
  const { getMicroCopy } = useSiteContext();
  const NoTechSpecMessage = () => (
    <div className={styles["ProductTechnicalSpec"]}>
      {getMicroCopy(microCopy.PDP_NO_TECH_SPEC_MESSAGE)}
    </div>
  );
  const classifications = product.classifications;
  if (classifications.length === 0) {
    return <NoTechSpecMessage />;
  }

  if (classifications.length === 1) {
    const classification = classifications[0];
    return (
      <div className={styles["ProductTechnicalSpec"]}>
        <ProductFeaturesTable
          key={`tech-spec-${classification.name}`}
          features={classification.features}
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
          {[...classifications]
            .sort((a, b) => (a.name > b.name ? -1 : 1))
            .map((classification) => {
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
                      features={classification.features}
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
