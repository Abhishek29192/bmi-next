import React, { useContext, useState, useMemo } from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import Section from "@bmi/section";
import OverviewCard from "@bmi/overview-card";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import Typography from "@bmi/typography";
import styles from "./styles/CardCollectionSection.module.scss";
import { Data as PageInfoData } from "./PageInfo";
import { Document } from "@contentful/rich-text-types";
import { groupBy, flatten } from "lodash";
import Chip from "@bmi/chip";
import Carousel from "@bmi/carousel";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

type FeaturedImage = {
  resize: {
    src: string;
  };
};

type Card = (
  | Omit<PageInfoData, "featuredImage">
  | Omit<PromoData, "featuredImage">
) & { id: string } & {
  featuredImage: FeaturedImage;
};

export type Data = {
  __typename: "ContentfulCardCollectionSection";
  title: string;
  description: {
    json: Document;
  };
  cardType: "Highlight Card" | "Story Card";
  cardLabel: string | null;
  groupCards: boolean;
  cards: Card[];
  link: LinkData | null;
};

// TODO: Reuse the getCTA function here.
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

  if (
    card.__typename === "ContentfulSimplePage" ||
    card.__typename === "ContentfulProductListerPage"
  ) {
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
  data: { title, description, cardType, cardLabel, groupCards, cards, link }
}: {
  data: Data;
}) => {
  const cardsByTag = useMemo(() => groupBy(cards, "tag.title"), [cards]);
  const groupKeys = Object.keys(cardsByTag);
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>(
    groupKeys.length ? { [groupKeys[0]]: true } : {}
  );
  const { countryCode } = useContext(SiteContext);
  const shouldDisplayGroups = groupCards && groupKeys.length > 1;
  const activeCards = flatten(
    Object.entries(activeGroups).map(([title, isSelected]) =>
      isSelected ? cardsByTag[title] : []
    )
  );

  return (
    <div className={styles["CardCollectionSection"]}>
      <Section backgroundColor={cardType === "Story Card" ? "white" : "pearl"}>
        <Typography className={styles["title"]} variant="h2" hasUnderline>
          {title}
        </Typography>
        {description && <RichText document={description.json} />}
        {shouldDisplayGroups && (
          <>
            <Typography variant="h4" component="h3">
              Show more:
            </Typography>
            <div className={styles["group-chips"]}>
              {groupKeys.map((tagTitle, index) => {
                return (
                  <Chip
                    key={`${tagTitle}-${index}`}
                    type="selectable"
                    isSelected={activeGroups[tagTitle]}
                    theme={cardType === "Story Card" ? "pearl" : "white"}
                    onClick={() => {
                      setActiveGroups((activeGroups) => ({
                        ...activeGroups,
                        [tagTitle]: !activeGroups[tagTitle]
                      }));
                    }}
                  >
                    {tagTitle === "undefined" ? "Rest" : tagTitle}
                  </Chip>
                );
              })}
            </div>
          </>
        )}
        <Carousel
          slidesPerPage={{
            xs: 1,
            md: 2,
            lg: 3,
            xl: 4
          }}
          scroll="finite"
          hasGutter
        >
          {(shouldDisplayGroups && activeCards.length
            ? activeCards
            : cards
          ).map((card, i) => {
            const { id } = card;
            const { title, subtitle, link, featuredImage } = transformCard(
              card
            );

            const transformedCardLabel = cardLabel
              ? cardLabel.replace(/{{title}}/g, title)
              : cardLabel;

            return (
              <Carousel.Slide key={`${id}-${i}`}>
                <OverviewCard
                  hasTitleUnderline
                  title={title}
                  imageSource={featuredImage?.resize.src}
                  isFlat={cardType === "Story Card"}
                  footer={
                    link ? (
                      <Button
                        variant="outlined"
                        action={getClickableActionFromUrl(
                          link.linkedPage,
                          link.url,
                          countryCode
                        )}
                        startIcon={<ArrowForwardIcon />}
                      >
                        {transformedCardLabel}
                      </Button>
                    ) : undefined
                  }
                >
                  {subtitle}
                </OverviewCard>
              </Carousel.Slide>
            );
          })}
          <Carousel.Controls type="arrows" />
        </Carousel>
        {link && (
          <Button
            action={getClickableActionFromUrl(
              link?.linkedPage,
              link?.url,
              countryCode
            )}
            className={styles["link"]}
            endIcon={<ArrowForwardIcon />}
          >
            {link.label}
          </Button>
        )}
      </Section>
    </div>
  );
};

export default CardCollectionSection;

export const query = graphql`
  fragment CardCollectionSectionFragment on ContentfulCardCollectionSection {
    title
    description {
      json
    }
    cardType
    cardLabel
    groupCards
    link {
      ...LinkFragment
    }
    cards {
      __typename
      ...PromoFragment
      ...PageInfoFragment
      ... on ContentfulPromo {
        id
        tag {
          title
        }
        featuredImage {
          resize(width: 350) {
            src
          }
        }
      }
      ... on ContentfulPage {
        id
        tag {
          title
        }
        featuredImage {
          resize(width: 350) {
            src
          }
        }
      }
    }
  }
`;
