import React from "react";
import { graphql, Link } from "gatsby";
import Grid from "@bmi/grid";
import CTACard from "@bmi/cta-card";
import styles from "./styles/OverlapCards.module.scss";

type Card = {
  title: string;
  slug: string | null;
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
        {data.map(({ title, image, slug }, key) => {
          return (
            <Grid item key={key} xs={12} sm={6} md={3}>
              <CTACard
                title={title}
                imageSource={image?.resize?.src}
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
    </div>
  );
};

export default IntegratedOverlapCards;

export const query = graphql`
  fragment OverlapCardFragment on ContentfulContactUsPageContentfulSimplePageContentfulTeamPageUnion {
    ... on ContentfulContactUsPage {
      title
      slug
      image: featuredImage {
        resize(width: 350) {
          src
        }
      }
    }
    ... on ContentfulSimplePage {
      title
      slug
      image: featuredImage {
        resize(width: 350) {
          src
        }
      }
    }
  }
`;
