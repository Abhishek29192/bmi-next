import React from "react";
import { Button, LeadBlock } from "@bmi/components";
import { Table } from "@bmi/components";
import { Accordion, AccordionSummaryProps } from "@bmi/components";
import { Typography } from "@bmi/components";
import { PostItCard } from "@bmi/components";
import { Grid } from "@bmi/components";
import { ButtonProps } from "@bmi/components/src";
import withGTM from "../../utils/google-tag-manager";
import ProductFeaturesTable from "../../components/ProductFeaturesTable";
import RichText from "../../components/RichText";
import Link from "../../components/Link";
import { Data as SDPSpecificationNotesData } from "../../components/ContentfulSpecificationNotes";
import { Classification } from "../../types/pim";
import styles from "./styles/technicalSpecificationLeadBlock.module.scss";

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);

type Props = {
  technicalSpecClassifications: readonly Classification[];
  specificationNotes?: SDPSpecificationNotesData | null;
};

const TechnicalSpecificationLeadBlock = ({
  technicalSpecClassifications,
  specificationNotes
}: Props) => {
  const GTMButton = withGTM<ButtonProps>(Button);
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
                <Table.Cell />
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
      {specificationNotes && (
        <Grid item lg={4} xs={12} data-testid="specificationNotes">
          <PostItCard theme="pearl">
            <PostItCard.Section>
              <PostItCard.Heading hasUnderline>
                {specificationNotes.title}
              </PostItCard.Heading>
              <PostItCard.Content>
                <RichText
                  document={specificationNotes.description}
                  gtmLabel={specificationNotes.title}
                />
              </PostItCard.Content>
              <PostItCard.Action>
                <Link
                  data={specificationNotes.cta}
                  component={({ children, ...rest }) => (
                    <GTMButton
                      {...rest}
                      gtm={{
                        id: "cta-click1",
                        label: specificationNotes.cta?.label || "",
                        action: specificationNotes.cta?.url || ""
                      }}
                    >
                      {children}
                    </GTMButton>
                  )}
                >
                  {specificationNotes.cta?.label}
                </Link>
              </PostItCard.Action>
            </PostItCard.Section>
          </PostItCard>
        </Grid>
      )}
    </LeadBlock>
  );
};

export default TechnicalSpecificationLeadBlock;
