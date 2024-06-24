import CTACard from "@bmi-digital/components/cta-card";
import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import React from "react";
import { DefaultImage } from "@bmi-digital/components";
import { getCTA } from "../../../components/link/utils";
import {
  CTACardPageInfoData,
  CTACardPromoData
} from "../../../components/types/CTACardTypes";
import createImageProps from "../../../components/image/createImageProps";
import createVideoProps from "../../../components/video/createVideoProps";
import type { Data as SiteData } from "../../../components/Site";
import type { Data as ResourcesData } from "../../../components/Resources";

export type PdpCardsProps = {
  resources: {
    pdpCards: (CTACardPromoData | CTACardPageInfoData)[];
    pdpCardsTitle: NonNullable<ResourcesData["pdpCardsTitle"]>;
  };
  countryCode: SiteData["countryCode"];
};

const PdpCardsSection = ({
  resources: { pdpCards, pdpCardsTitle },
  countryCode
}: PdpCardsProps) => (
  <Section
    backgroundColor="alabaster"
    className="PdpCardsSection"
    data-testid="pdp-cards-section"
  >
    <Section.Title>{pdpCardsTitle}</Section.Title>
    <Grid container spacing={3}>
      {pdpCards.map(
        ({ title, featuredVideo, featuredMedia, ...data }, index, cards) => {
          const cardTitle = title || ""; // TODO: DXB-7055 title can't be null
          const cta = getCTA(data, countryCode, cardTitle);
          return (
            <Grid
              key={`card-${index}`}
              xs={12}
              sm={6}
              md={4}
              lg={12 / Math.max(cards.length, 3)}
            >
              <CTACard
                title={cardTitle}
                media={
                  featuredVideo
                    ? createVideoProps(featuredVideo)
                    : featuredMedia
                      ? createImageProps(featuredMedia)
                      : {
                          component: DefaultImage
                        }
                }
                {...cta}
              />
            </Grid>
          );
        }
      )}
    </Grid>
  </Section>
);

export default PdpCardsSection;
