import React, { useContext } from "react";
import { graphql } from "gatsby";
import AnchorLink from "@bmi/anchor-link";
import Button from "@bmi/button";
import { Colors } from "@bmi/color-pair";
import Section from "@bmi/section";
import OverviewCard from "@bmi/overview-card";
import CTACard from "@bmi/cta-card";
import NBACard from "@bmi/nba-card";
import Grid from "@bmi/grid";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { Data as PromoData } from "./Promo";
import Typography from "@bmi/typography";
import styles from "./styles/CardCollectionSection.module.scss";

type FeaturedImage = {
  resize: {
    src: string;
  };
};

type PageContent = {
  __typename: "ContentfulSimplePage";
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  featuredImage: FeaturedImage | null;
};

type Card = PageContent | (PromoData & { id: string });

export type Data = {
  __typename: "ContentfulCardCollectionSection";
  title: string;
  cardType: "Product Overview Card" | "Next Best Action Card" | "CTA Card";
  cardLabel: string | null;
  cards: Card[];
};

const transformCard = (
  card: Card
): {
  title: string;
  subtitle: string;
  link: LinkData | null;
  featuredImage: FeaturedImage | null;
} => {
  let title;
  let subtitle;
  let link = null;
  let featuredImage = null;

  if (card.__typename === "ContentfulSimplePage") {
    link = {
      linkedPage: {
        slug: card.slug
      }
    };
    title = card.title;
    subtitle = card.subtitle;
    featuredImage = card.featuredImage;
  }

  if (card.__typename === "ContentfulPromo") {
    link = card.cta;
    title = card.title;
    subtitle = card.subtitle;
    featuredImage = card.featuredImage;
  }

  return { title, subtitle, link, featuredImage };
};

const CardCollectionSection = ({
  data: { title, cardType, cardLabel, cards },
  backgroundColor
}: {
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const { countryCode } = useContext(SiteContext);
  const themes: Colors[] = ["blue-900", "teal-400", "charcoal", "blue-800"];

  return (
    <div className={styles["CardCollectionSection"]}>
      <Section backgroundColor={backgroundColor}>
        {title && (
          <Typography className={styles["title"]} variant="h2" hasUnderline>
            {title}
          </Typography>
        )}
        <Grid container spacing={3}>
          {cards.map((card, i) => {
            const { id } = card;
            const { title, subtitle, link, featuredImage } = transformCard(
              card
            );

            if (!link) {
              return null;
            }

            const transformedCardLabel = cardLabel
              ? cardLabel.replace(/{{title}}/g, title)
              : cardLabel;

            return (
              <Grid key={id} item xs={12} sm={6} md={3}>
                {cardType === "Product Overview Card" && (
                  <OverviewCard
                    hasTitleUnderline
                    title={title}
                    imageSource={featuredImage?.resize.src}
                    footer={
                      <Button
                        variant="outlined"
                        action={getClickableActionFromUrl(
                          link.linkedPage,
                          link.url,
                          countryCode
                        )}
                      >
                        {transformedCardLabel}
                      </Button>
                    }
                  >
                    {subtitle}
                  </OverviewCard>
                )}
                {cardType === "Next Best Action Card" && (
                  <NBACard
                    theme={themes[i % 4]}
                    title={title}
                    footer={
                      <AnchorLink
                        iconStart
                        action={getClickableActionFromUrl(
                          link.linkedPage,
                          link.url,
                          countryCode
                        )}
                      >
                        {transformedCardLabel}
                      </AnchorLink>
                    }
                  >
                    {subtitle}
                  </NBACard>
                )}
                {cardType === "CTA Card" && (
                  <CTACard
                    title={title}
                    imageSource={featuredImage?.resize.src}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </div>
  );
};

export default CardCollectionSection;

export const query = graphql`
  fragment CardCollectionSectionFragment on ContentfulCardCollectionSection {
    title
    cardType
    cardLabel
    cards {
      __typename
      ...PromoFragment
      ... on ContentfulPromo {
        id
        featuredImage: image {
          resize(width: 350) {
            src
          }
        }
      }
      ... on ContentfulSimplePage {
        id
        slug
        title
        subtitle
        featuredImage {
          resize(width: 350) {
            src
          }
        }
      }
    }
  }
`;
