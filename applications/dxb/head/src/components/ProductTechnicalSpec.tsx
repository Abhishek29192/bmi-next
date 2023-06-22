import { Accordion, Table, Typography } from "@bmi-digital/components";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { Product } from "../types/pim";
import ProductFeaturesTable from "./ProductFeaturesTable";
import { useSiteContext } from "./Site";
import { ProdTecSpecAccordianDetails } from "./styles/ProductTechnicalSpecStyles";

type ProductTechnicalSpecProps = {
  product: Product;
};

//TODO: will this component may need to update and use
// `product.measurements` property to display measurements??
const ProductTechnicalSpec = ({ product }: ProductTechnicalSpecProps) => {
  const { getMicroCopy } = useSiteContext();
  const NoTechSpecMessage = () => (
    <div>{getMicroCopy(microCopy.PDP_NO_TECH_SPEC_MESSAGE)}</div>
  );
  const classifications = product.classifications;

  if (classifications.length === 1) {
    const classification = classifications[0];
    return (
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
    );
  }

  if (classifications.length > 1) {
    return (
      <Accordion noInnerPadding>
        {[...classifications]
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((classification) => {
            return (
              <Accordion.Item
                key={`tech-spec-${classification.name}`}
                defaultExpanded={true}
              >
                <Accordion.Summary>
                  <Typography variant="h6">{classification.name}</Typography>
                </Accordion.Summary>
                <ProdTecSpecAccordianDetails>
                  <ProductFeaturesTable
                    features={classification.features}
                    rowBgColorPattern="even"
                    hasNoBorder={true}
                  />
                </ProdTecSpecAccordianDetails>
              </Accordion.Item>
            );
          })}
      </Accordion>
    );
  }
  return <NoTechSpecMessage />;
};

export default ProductTechnicalSpec;
