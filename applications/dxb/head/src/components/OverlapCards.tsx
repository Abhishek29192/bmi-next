import React from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import Container from "@bmi/container";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import styles from "./styles/OverlapCards.module.scss";
import { Data as PromoData } from "./Promo";
import { Data as PageInfoData } from "./PageInfo";
import { getCTA } from "./Link";
import { useSiteContext } from "./Site";

type Card =
  | Pick<
      PromoData,
      "__typename" | "title" | "cta" | "featuredMedia" | "featuredVideo"
    >
  | Pick<
      PageInfoData,
      "__typename" | "title" | "path" | "featuredMedia" | "featuredVideo"
    >;

// NOTE: Minimum two cards required.
export type Data = [Card, Card, ...Card[]];

const IntegratedOverlapCards = ({ data }: { data?: Data }) => {
  const { countryCode } = useSiteContext();

  const GTMButton = withGTM<ButtonBaseProps>(ButtonBase, { action: "to" });

  return (
    <div className={styles["OverlapCards"]}>
      <Container>
        <Grid spacing={3} container justify="center">
          {data.map(({ title, featuredMedia, featuredVideo, ...rest }, key) => {
            const cta = getCTA(rest, countryCode);
            return (
              <Grid item key={key} xs={12} sm={6} md={5} lg={3}>
                <CTACard
                  title={title}
                  buttonComponent={(props: ButtonBaseProps) => (
                    <GTMButton
                      gtm={{
                        id: "cta-click1",
                        label: title
                      }}
                      {...props}
                    />
                  )}
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
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default IntegratedOverlapCards;

export const query = graphql`
  fragment OverlapCardFragment on ContentfulPromoOrPage {
    ...PromoCardFragment
    ...PageInfoCardFragment
  }
`;
