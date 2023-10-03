import {
  Accordion,
  AccordionSummaryProps,
  Button,
  ButtonProps,
  Grid,
  LeadBlock,
  PostItCard,
  Table,
  Typography
} from "@bmi-digital/components";
import React from "react";
import { Data as SDPSpecificationNotesData } from "../../components/ContentfulSpecificationNotes";
import Link from "../../components/Link";
import ProductFeaturesTable from "../../components/ProductFeaturesTable";
import RichText from "../../components/RichText";
import { Classification } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import { StyledAccordionDetails } from "./styles/technicalSpecificationLeadBlock.styles";

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
      const featureAttr = classification.features.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      return (
        <div data-testid="technical-specification-classifications-table-wrapper">
          <ProductFeaturesTable
            key={`tech-spec-${classification.name}`}
            features={featureAttr}
            rowBgColorPattern="even"
            HeadRow={
              <Table.Row>
                <Table.Cell>{classification.name}</Table.Cell>
                <Table.Cell />
              </Table.Row>
            }
            hasNoBorder={false}
            data-testid="technical-specification-classifications-table"
          />
        </div>
      );
    }

    if (technicalSpecClassifications.length > 1) {
      return (
        <div data-testid="technical-specification-classifications-accordion-wrapper">
          <Accordion
            noInnerPadding
            data-testid="technical-specification-classifications-accordion"
          >
            {[...technicalSpecClassifications]
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map(({ name, features }, id) => {
                features.sort((a, b) => (a.name > b.name ? 1 : -1));
                return (
                  <Accordion.Item
                    key={`tech-spec-${id}`}
                    defaultExpanded={true}
                  >
                    <GTMAccordionSummary
                      gtm={{
                        id: "selector-accordion1",
                        label: name,
                        action: "Selector – Accordion"
                      }}
                    >
                      <Typography variant="h6">{name}</Typography>
                    </GTMAccordionSummary>
                    <StyledAccordionDetails>
                      <ProductFeaturesTable
                        features={features}
                        rowBgColorPattern="even"
                        hasNoBorder={true}
                      />
                    </StyledAccordionDetails>
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
        <Grid lg={4} xs={12} data-testid="specificationNotes">
          <PostItCard color="pearl">
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
                        label:
                          `${specificationNotes.title} - ${specificationNotes.cta?.label}` ||
                          "",
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
