import { Container, CTACard, Grid } from "@bmi-digital/components";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { renderImage } from "./Image";
import { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { Data as PromoData } from "./Promo";
import { useSiteContext } from "./Site";
import styles from "./styles/OverlapCards.module.scss";
import { renderVideo } from "./Video";

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
        <Grid spacing={3} container justifyContent="center">
          {data.map(({ title, featuredMedia, featuredVideo, ...rest }, key) => {
            const cta = getCTA(rest, countryCode);
            return (
              <Grid key={key} xs={12} sm={6} md={5} lg={3}>
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
