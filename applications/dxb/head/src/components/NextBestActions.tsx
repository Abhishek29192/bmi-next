import React from "react";
import { graphql } from "gatsby";
import { Section } from "@bmi/components";
import { Grid } from "@bmi/components";
import { NBACard } from "@bmi/components";
import { AnchorLink } from "@bmi/components";
import { Colors } from "@bmi/components";
import { withClickable } from "@bmi/components";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import { Data as PromoData } from "../components/Promo";
import { Data as PageInfoData } from "../components/PageInfo";
import { microCopy } from "../constants/microCopies";
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
      <Section.Title>{getMicroCopy(microCopy.NBA_TITLE)}</Section.Title>
      <Grid container spacing={3}>
        {data.map(({ title, subtitle, ...rest }, index) => {
          const name = rest.__typename === "ContentfulPromo" ? rest.name : null;
          const cta = getCTA(rest, countryCode, title || name);

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
