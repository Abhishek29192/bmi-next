import React, { useContext } from "react";
import { graphql } from "gatsby";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import Container from "@bmi/container";
import styles from "./styles/OverlapCards.module.scss";
import { Data as PromoData } from "./Promo";
import { Data as PageInfoData } from "./PageInfo";
import { getCTA } from "./Link";
import { SiteContext } from "./Site";

type Card = (
  | Pick<PromoData, "__typename" | "title" | "cta">
  | Pick<PageInfoData, "__typename" | "title" | "path">
) & {
  featuredImage: {
    resized: {
      src: string;
    };
  } | null;
};

// NOTE: Minimum two cards required.
export type Data = [Card, Card, ...Card[]];

const IntegratedOverlapCards = ({ data }: { data?: Data }) => {
  const { countryCode } = useContext(SiteContext);

  return (
    <div className={styles["OverlapCards"]}>
      <Container>
        <Grid spacing={3} container justify="center">
          {data.map(({ title, featuredImage, ...rest }, key) => {
            const { action } = getCTA(rest, countryCode);

            return (
              <Grid item key={key} xs={12} sm={6} md={5} lg={3}>
                <CTACard
                  title={title}
                  imageSource={featuredImage?.resized?.src}
                  action={action}
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
    ... on ContentfulPromo {
      ...PromoFragment
      featuredImage {
        resized: resize(width: 684, toFormat: WEBP, jpegProgressive: false) {
          src
        }
      }
    }
    ... on ContentfulPage {
      title
      path
      featuredImage {
        resized: resize(width: 684, toFormat: WEBP, jpegProgressive: false) {
          src
        }
      }
    }
  }
`;
