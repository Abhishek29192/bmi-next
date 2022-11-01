import { CTACard, Grid, GridSize, Section } from "@bmi-digital/components";
import React from "react";
import { renderImage } from "../../../components/Image";
import { getCTA } from "../../../components/Link";
import { Data as SiteData } from "../../../components/Site";
import { renderVideo } from "../../../components/Video";

interface PdpCardsProps {
  resources: {
    pdpCards: SiteData["resources"]["pdpCards"];
    pdpCardsTitle: SiteData["resources"]["pdpCardsTitle"];
  };
  countryCode: string;
}
export const PdpCardsSection = ({
  resources: { pdpCards, pdpCardsTitle },
  countryCode
}: PdpCardsProps) => (
  <Section backgroundColor="alabaster" className="PdpCardsSection">
    <Section.Title>{pdpCardsTitle}</Section.Title>
    <Grid container spacing={3}>
      {pdpCards.map(
        ({ title, featuredVideo, featuredMedia, ...data }, index, cards) => {
          const cta = getCTA(data, countryCode, title);
          return (
            <Grid
              item
              key={`card-${index}`}
              xs={12}
              sm={6}
              md={4}
              lg={(12 / Math.max(cards.length, 3)) as GridSize}
            >
              <CTACard
                title={title}
                media={
                  featuredVideo
                    ? renderVideo(featuredVideo)
                    : renderImage(featuredMedia)
                }
                clickableArea={featuredVideo ? "heading" : "full"}
                action={cta?.action}
              />
            </Grid>
          );
        }
      )}
    </Grid>
  </Section>
);
