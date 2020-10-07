import React from "react";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import styles from "./styles/OverlapCards.module.scss";
import { graphql } from "gatsby";

type Card = {
  label: string;
  URL: string | null;
  page: {
    slug: string;
  } | null;
  image: {
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
      <Grid spacing={3} container justify="center">
        {data.map(({ label, image }, key) => {
          return (
            <Grid item key={key} xs={12} sm={6} md={3}>
              <CTACard title={label} imageSource={image.resize.src} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default IntegratedOverlapCards;

export const query = graphql`
  fragment OverlapCardFragment on ContentfulLinkWithImage {
    label
    linkedPage {
      slug
    }
    image {
      resize(width: 350) {
        src
      }
    }
  }
`;
