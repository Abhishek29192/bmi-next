import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import React from "react";
import { Card } from "@bmi-digital/components";
import ContactDetails from "../../components/ContactDetails";
import type { ServiceSupportSectionProps } from "./types";

const ServiceSupportSection = ({
  titleForServiceSupportSection,
  serviceSupportCards
}: ServiceSupportSectionProps) => {
  return (
    <Section data-testid="account-page-service-support-section">
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
              style={{ display: "grid" }}
            >
              <Card>
                <ContactDetails data={data} gtmLabel={data.title} />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default ServiceSupportSection;
