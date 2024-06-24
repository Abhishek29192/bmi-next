import Grid from "@bmi-digital/components/grid";
import NBACard from "@bmi-digital/components/nba-card";
import Section from "@bmi-digital/components/section";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import { useSiteContext } from "../Site";
import { getCTA } from "../link/utils";
import type { Data as PageInfoData } from "../PageInfo";
import type { Data as PromoData } from "../Promo";
import type { DarkColor } from "@bmi-digital/components/color-pair";

export type Data = (PromoData | PageInfoData)[];

const indexToBackgroundMap: DarkColor[] = [
  "secondary1",
  "secondary2",
  "secondary3",
  "secondary4"
];

const getTitle = (data: PromoData | PageInfoData) => {
  if (data.__typename === "ContentfulPromo") {
    return transformHyphens(data.title || data.name);
  }
  return transformHyphens(data.title);
};

const NextBestActions = ({ data }: { data: Data }) => {
  const { getMicroCopy, countryCode } = useSiteContext();
  return (
    <Section
      backgroundColor="alabaster"
      data-testid="next-best-actions-section"
    >
      <Section.Title>{getMicroCopy(microCopy.NBA_TITLE)}</Section.Title>
      <Grid container spacing={3}>
        {data.map((cardData, index) => {
          const transformedTitle = getTitle(cardData);
          const cta = getCTA(cardData, countryCode, transformedTitle);

          return (
            <Grid xs={12} md={4} lg={3} key={`nba-${index}`}>
              <NBACard
                // eslint-disable-next-line security/detect-object-injection
                color={indexToBackgroundMap[index]}
                title={transformedTitle}
                description={transformHyphens(cardData.subtitle)} // TODO: DXB-7055 Description can't be null
                ctaLabel={cardData.cta?.label}
                data-testid={`nba-card-${replaceSpaces(transformedTitle)}`}
                {...cta} // TODO: DXB-7055 CTA can't be null
              />
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default NextBestActions;

export const query = graphql`
  fragment NextBestActionsFragment on ContentfulPromoOrPage {
    ...PromoCardFragment
    ...PageInfoCardFragment
  }
`;
