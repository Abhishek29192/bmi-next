import Container from "@bmi-digital/components/container";
import CTACard from "@bmi-digital/components/cta-card";
import Grid from "@bmi-digital/components/grid";
import DefaultImage from "@bmi-digital/components/resources/DefaultImage";
import React from "react";
import { useSiteContext } from "./Site";
import { getCTA } from "./link/utils";
import { OverlapCardsSection, StyledGrid } from "./styles/OverlapCardsStyles";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { ImageWidths } from "./image/types";
import type { CTACardPageInfoData } from "./types/CTACardTypes";

export type Card = CTACardPageInfoData;
export type Data = Card[];

const mediaWidths: ImageWidths = [561, 321, 381, 446, 330];

const IntegratedOverlapCards = ({ data }: { data: Data }) => {
  const { countryCode } = useSiteContext();
  return (
    <OverlapCardsSection data-testid="overlap-cards-wrapper">
      <Container>
        <Grid spacing={3} container justifyContent="center">
          {data.map(({ title, featuredMedia, featuredVideo, ...rest }, key) => {
            const cardTitle = title || ""; // TODO: DXB-7055 title can't be null
            const cta = getCTA(rest, countryCode, cardTitle);
            return (
              <StyledGrid key={key} xs={12} sm={6} md={5} lg={3}>
                <CTACard
                  title={cardTitle}
                  media={
                    featuredVideo
                      ? createVideoProps({
                          ...featuredVideo,
                          "data-testid": "overlap-cards-video",
                          previewMediaWidths: mediaWidths
                        })
                      : (featuredMedia &&
                          createImageProps({
                            ...featuredMedia,
                            "data-testid": "overlap-cards-image",
                            widths: mediaWidths
                          })) || { component: DefaultImage }
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
