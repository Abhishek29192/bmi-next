import React, { useContext } from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import NBACard from "@bmi/nba-card";
import AnchorLink from "@bmi/anchor-link";
import { Colors } from "@bmi/color-pair";
import { Data as PromoData } from "../components/Promo";
import { Data as PageInfoData } from "../components/PageInfo";
import { getCTA } from "./Link";
import { SiteContext } from "./Site";

export type Data = (PromoData | PageInfoData)[];

const indexToBackgroundMap: Colors[] = [
  "blue-900",
  "teal-500",
  "slate",
  "blue-800"
];

const NextBestActions = ({ data }: { data: Data }) => {
  const { getMicroCopy, countryCode } = useContext(SiteContext);

  return (
    <Section backgroundColor="alabaster">
      <Section.Title>{getMicroCopy("nba.title")}</Section.Title>
      <Grid container spacing={3}>
        {data.map(({ title, subtitle, ...rest }, index) => {
          const cta = getCTA(rest, countryCode, getMicroCopy("page.linkLabel"));

          return (
            <Grid item xs={12} md={4} lg={3} key={`nba-${index}`}>
              <NBACard
                theme={indexToBackgroundMap[index]}
                title={title}
                footer={
                  cta ? (
                    <div style={{ fontSize: "1rem" }}>
                      <AnchorLink action={cta.action} iconStart>
                        {cta.label}
                      </AnchorLink>
                    </div>
                  ) : undefined
                }
              >
                {subtitle}
              </NBACard>
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
    ...PromoFragment
    ...PageInfoFragment
  }
`;
