import Card from "@bmi-digital/components/card";
import Container from "@bmi-digital/components/container";
import CTACard from "@bmi-digital/components/cta-card";
import Grid from "@bmi-digital/components/grid";
import { graphql } from "gatsby";
import React from "react";
import Image from "./Image";
import { useSiteContext } from "./Site";
import Video from "./Video";
import { getCTA } from "./link/utils";
import { OverlapCardsSection, StyledGrid } from "./styles/OverlapCardsStyles";
import { CTACardPageInfoData, CTACardPromoData } from "./types/CTACardTypes";

type Card = CTACardPromoData | CTACardPageInfoData;

// NOTE: Minimum two cards required.
export type Data = [Card, Card, ...Card[]];

const IntegratedOverlapCards = ({ data }: { data: Data }) => {
  const { countryCode } = useSiteContext();
  return (
    <OverlapCardsSection data-testid="overlap-cards-wrapper">
      <Container>
        <Grid spacing={3} container justifyContent="center">
          {data.map(({ title, featuredMedia, featuredVideo, ...rest }, key) => {
            const cta = getCTA(rest, countryCode, title);
            return (
              <StyledGrid key={key} xs={12} sm={6} md={5} lg={3}>
                <CTACard
                  title={title}
                  media={
                    featuredVideo ? (
                      <Video
                        {...featuredVideo}
                        data-testid="overlap-cards-video"
                      />
                    ) : (
                      <Image
                        {...featuredMedia}
                        data-testid="overlap-cards-image"
                      />
                    )
                  }
                  {...cta}
                  data-testid="overlap-card"
                />
              </StyledGrid>
            );
          })}
        </Grid>
      </Container>
    </OverlapCardsSection>
  );
};

export default IntegratedOverlapCards;

export const query = graphql`
  fragment OverlapCardFragment on ContentfulPromoOrPage {
    ...PromoCardFragment
    ...PageInfoCardFragment
  }
`;
