import React from "react";
import LeadBlock from "@bmi/lead-block";
import Table from "@bmi/table";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import ProductFeaturesTable from "../../components/ProductFeaturesTable";
import { Classification } from "../../components/types/pim";
import styles from "./styles/technicalSpecificationLeadBlock.module.scss";

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
                  <Accordion.Summary>
                    <Typography variant="h6">{name}</Typography>
                  </Accordion.Summary>
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
