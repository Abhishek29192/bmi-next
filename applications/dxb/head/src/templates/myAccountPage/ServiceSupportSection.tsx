import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import React from "react";
import ContactDetails from "../../components/ContactDetails";
import type { Data as ContactDetailsData } from "../../components/ContactDetails";

export type ServiceSupportSectionProps = {
  titleForServiceSupportSection: string;
  serviceSupportCards: ContactDetailsData[];
};

const ServiceSupportSection = ({
  titleForServiceSupportSection,
  serviceSupportCards
}: ServiceSupportSectionProps) => {
  return (
    <Section>
      <Section.Title>{titleForServiceSupportSection}</Section.Title>
      <Grid container={serviceSupportCards.length > 1} spacing={3}>
        {serviceSupportCards.map((data) => {
          const serviceSupportKey = `service-support-card-${replaceSpaces(
            data.title
          )}`;
          return (
            <Grid
              key={serviceSupportKey}
              xs={12}
              lg={6}
              data-testid={serviceSupportKey}
            >
              <ContactDetails data={data} gtmLabel={data.title} />
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default ServiceSupportSection;
