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

export type Data = (NextBestActionsPromoData | NextBestActionsPageInfoData)[];

export type NextBestActionsPromoData = {
  title: NonNullable<PromoData["title"]>;
  subtitle: NonNullable<PromoData["subtitle"]>;
  cta: NonNullable<PromoData["cta"]>;
};

export type NextBestActionsPageInfoData = {
  title: PageInfoData["title"];
  subtitle: NonNullable<PageInfoData["subtitle"]>;
  path: NonNullable<PageInfoData["path"]>;
};

const indexToBackgroundMap: DarkColor[] = [
  "secondary1",
  "secondary2",
  "secondary3",
  "secondary4"
];

const NextBestActions = ({ data }: { data: Data }) => {
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <Section
      backgroundColor="alabaster"
      data-testid="next-best-actions-section"
    >
      <Section.Title>{getMicroCopy(microCopy.NBA_TITLE)}</Section.Title>
      <Grid container spacing={3}>
        {data.map(({ title, subtitle, ...rest }, index) => {
          const cta = getCTA(rest, countryCode, title);
          const transformHyphensTitle = transformHyphens(title);

          return (
            <Grid xs={12} md={4} lg={3} key={`nba-${index}`}>
              <NBACard
                // eslint-disable-next-line security/detect-object-injection
                color={indexToBackgroundMap[index]}
                title={transformHyphensTitle}
                description={transformHyphens(subtitle)}
                ctaLabel={transformHyphensTitle}
                data-testid={`nba-card-${replaceSpaces(transformHyphensTitle)}`}
                {...cta}
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
