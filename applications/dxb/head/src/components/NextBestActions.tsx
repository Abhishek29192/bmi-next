import {
  AnchorLink,
  Colors,
  Grid,
  NBACard,
  Section,
  transformHyphens,
  withClickable
} from "@bmi-digital/components";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import { graphql } from "gatsby";
import React from "react";
import { Data as PageInfoData } from "../components/PageInfo";
import { Data as PromoData } from "../components/Promo";
import { microCopy } from "../constants/microCopies";
import { getCTA } from "./Link";
import { useSiteContext } from "./Site";

export type Data = (PromoData | PageInfoData)[];

const indexToBackgroundMap: Colors[] = [
  "secondary1",
  "secondary2",
  "secondary3",
  "secondary4"
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
            <Grid xs={12} md={4} lg={3} key={`nba-${index}`}>
              <NBACard
                // eslint-disable-next-line security/detect-object-injection
                color={indexToBackgroundMap[index]}
                title={title || name}
                footer={
                  cta && cta.label ? (
                    <div style={{ fontSize: "1rem" }}>
                      <AnchorLink component="span" iconStart>
                        {transformHyphens(cta.label)}
                      </AnchorLink>
                    </div>
                  ) : undefined
                }
                buttonComponent={buttonComponent}
                isClickable={!!buttonComponent}
              >
                {transformHyphens(subtitle)}
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
