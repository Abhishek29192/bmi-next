import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import NBACard from "@bmi/nba-card";
import AnchorLink from "@bmi/anchor-link";
import { Colors } from "@bmi/color-pair";
import { withClickable } from "@bmi/clickable";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { Data as PromoData } from "../components/Promo";
import { Data as PageInfoData } from "../components/PageInfo";
import { getCTA } from "./Link";
import { useSiteContext } from "./Site";

export type Data = (PromoData | PageInfoData)[];

const indexToBackgroundMap: Colors[] = [
  "color-theme-secondary-1",
  "color-theme-secondary-2",
  "color-theme-secondary-3",
  "color-theme-secondary-4"
];

const NextBestActions = ({ data }: { data: Data }) => {
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <Section backgroundColor="alabaster">
      <Section.Title>{getMicroCopy("nba.title")}</Section.Title>
      <Grid container spacing={3}>
        {data.map(({ title, subtitle, ...rest }, index) => {
          const cta = getCTA(rest, countryCode, getMicroCopy("page.linkLabel"));
          const name = rest.__typename === "ContentfulPromo" ? rest.name : null;

          const ClickableButtonBase =
            withClickable<ButtonBaseProps>(ButtonBase);

          const buttonComponent =
            cta && cta.action
              ? (props) => (
                  <ClickableButtonBase {...props} action={cta.action} />
                )
              : undefined;

          return (
            <Grid item xs={12} md={4} lg={3} key={`nba-${index}`}>
              <NBACard
                // eslint-disable-next-line security/detect-object-injection
                theme={indexToBackgroundMap[index]}
                title={title || name}
                footer={
                  cta && cta.label ? (
                    <div style={{ fontSize: "1rem" }}>
                      <AnchorLink component="span" iconStart>
                        {cta.label}
                      </AnchorLink>
                    </div>
                  ) : undefined
                }
                buttonComponent={buttonComponent}
                isClickable={!!buttonComponent}
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
