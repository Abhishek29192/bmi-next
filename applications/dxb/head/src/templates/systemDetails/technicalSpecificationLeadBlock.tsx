import React from "react";
import { LeadBlock } from "@bmi-digital/components";
import { Table } from "@bmi-digital/components";
import { Accordion, AccordionSummaryProps } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import withGTM from "../../utils/google-tag-manager";
import ProductFeaturesTable from "../../components/ProductFeaturesTable";
import { Classification } from "../../components/types/pim";
import styles from "./styles/technicalSpecificationLeadBlock.module.scss";

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

type Props = {
  technicalSpecClassifications: Classification[];
};

const TechnicalSpecificationLeadBlock = ({
  technicalSpecClassifications
}: Props) => {
  const technicalSpecification = () => {
    if (technicalSpecClassifications.length === 1) {
      const classification = technicalSpecClassifications[0];
      return (
        <div className={styles["SystemDetailsTechnicalSpec"]}>
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

    if (technicalSpecClassifications.length > 1) {
      return (
        <div className={styles["SystemDetailsTechnicalSpec"]}>
          <Accordion noInnerPadding>
            {technicalSpecClassifications.map(({ name, features }, id) => {
              return (
                <Accordion.Item key={`tech-spec-${id}`} defaultExpanded={true}>
                  <GTMAccordionSummary
                    gtm={{
                      id: "selector-accordion1",
                      label: name,
                      action: "Selector – Accordion"
                    }}
                  >
                    <Typography variant="h6">{name}</Typography>
                  </GTMAccordionSummary>
                  <Accordion.Details className={styles["accordion-details"]}>
                    <ProductFeaturesTable
                      features={features}
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

    return null;
  };

  return (
    <LeadBlock>
      <LeadBlock.Content>
        <LeadBlock.Content.Section>
          {technicalSpecification()}
        </LeadBlock.Content.Section>
      </LeadBlock.Content>
    </LeadBlock>
  );
};

export default TechnicalSpecificationLeadBlock;
