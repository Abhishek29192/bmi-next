import React from "react";
import { graphql, Link } from "gatsby";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import Container from "@bmi/container";
import styles from "./styles/OverlapCards.module.scss";

type Card = {
  title: string;
  slug: string | null;
  featuredImage: {
    resize: {
      src: string;
    };
  } | null;
};

// NOTE: Minimum two cards required.
export type Data = [Card, Card, ...Card[]];

const IntegratedOverlapCards = ({ data }: { data?: Data }) => {
  return (
    <div className={styles["OverlapCards"]}>
      <Container>
        <Grid spacing={3} container justify="center">
          {data.map(({ title, featuredImage, slug }, key) => {
            return (
              <Grid item key={key} xs={12} sm={6} md={5} lg={3}>
                <CTACard
                  title={title}
                  imageSource={featuredImage?.resize?.src}
                  action={{
                    model: "routerLink",
                    to: slug,
                    linkComponent: Link
                  }}
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
    ...PromoFragment
    ... on ContentfulPage {
      title
      slug
      featuredImage {
        resize(width: 350) {
          src
        }
      }
    }
  }
`;
