import React, { useContext, useState, useMemo } from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import Section from "@bmi/section";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { uniq, flatten, groupBy, find } from "lodash";
import Chip from "@bmi/chip";
import Carousel from "@bmi/carousel";
import Grid from "@bmi/grid";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/CardCollectionSection.module.scss";
import { Data as PageInfoData } from "./PageInfo";
import { iconMap } from "./Icon";

type FeaturedImage = {
  resized: {
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
  description: RichTextData | null;
  cardType: "Highlight Card" | "Story Card" | "Text Card";
  cardLabel: string | null;
  groupCards: boolean;
  cards: Card[];
  link: LinkData | null;
};

const CardCollectionItem = ({
  card,
  label,
  type
}: {
  card: Card;
  label: string;
  type: Data["cardType"];
}) => {
  const { countryCode } = useContext(SiteContext);
  const { title, subtitle, link, featuredImage, brandLogo } = transformCard(
    card
  );

  const transformedCardLabel = label
    ? label.replace(/{{title}}/g, title)
    : link?.label || `Go to ${title}`;
  return (
    <OverviewCard
      hasTitleUnderline
      title={title}
      imageSource={
        type !== "Text Card" ? featuredImage?.resized.src : undefined
      }
      isFlat={type === "Story Card"}
      brandImageSource={type !== "Text Card" ? iconMap[brandLogo] : undefined}
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
  );
};

// TODO: Reuse the getCTA function here.
const transformCard = ({
  title,
  subtitle,
  featuredImage,
  brandLogo,
  ...rest
}: Card): {
  title: Card["title"];
  subtitle: Card["subtitle"];
  link: LinkData | null;
  featuredImage: Card["featuredImage"];
  brandLogo: Card["brandLogo"];
} => {
  let link = null;

  if (rest.__typename === "ContentfulPromo") {
    link = rest.cta;
  } else {
    link = {
      linkedPage: {
        path: rest.path
      }
    };
  }

  return { title, subtitle, link, featuredImage, brandLogo };
};

const moveRestKeyLast = (arr) => {
  return [...arr.sort((a, b) => (a === "undefined" ? 1 : -1))];
};

const CardCollectionSection = ({
  data: { title, description, cardType, cardLabel, groupCards, cards, link },
  theme
}: {
  data: Data;
  // TODO: Type me.
  theme: any;
}) => {
  const cardsByTag = useMemo(
    () => groupBy(cards, ({ tags }) => find(tags, { type: "Group" })?.title),
    [cards]
  );
  const groupKeys = moveRestKeyLast(Object.keys(cardsByTag));
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>(
    groupKeys.length ? { [groupKeys[0]]: true } : {}
  );
  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const shouldDisplayGroups = groupCards && groupKeys.length > 1;
  const activeCards = uniq(
    flatten(
      Object.entries(activeGroups).map(([title, isSelected]) =>
        isSelected ? cardsByTag[title] : []
      )
    )
  );
  const iteratableCards =
    shouldDisplayGroups && activeCards.length ? activeCards : cards;

  return (
    <div className={styles["CardCollectionSection"]}>
      <Section backgroundColor={cardType === "Story Card" ? "white" : "pearl"}>
        <Typography className={styles["title"]} variant="h2" hasUnderline>
          {title}
        </Typography>
        {description && <RichText document={description} />}
        {shouldDisplayGroups && (
          <>
            <Typography variant="h4" component="h3">
              {getMicroCopy("cardCollection.groupTitle")}
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
                    {tagTitle === "undefined"
                      ? getMicroCopy("cardCollection.restLabel")
                      : tagTitle}
                  </Chip>
                );
              })}
            </div>
          </>
        )}
        {theme?.cardCollectionRowType === "single-row" ? (
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
            {iteratableCards.map((card, i) => {
              const { id } = card;

              return (
                <Carousel.Slide key={`${id}-${i}`}>
                  <CardCollectionItem
                    card={card}
                    label={cardLabel}
                    type={cardType}
                  />
                </Carousel.Slide>
              );
            })}
            <Carousel.Controls type="arrows" />
          </Carousel>
        ) : (
          <Grid container>
            {iteratableCards.map((card, i) => {
              const { id } = card;
              return (
                <Grid item key={`${id}-${i}`} xs={12} md={6} xl={3}>
                  <CardCollectionItem
                    card={card}
                    label={cardLabel}
                    type={cardType}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
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
      ...RichTextFragment
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
        tags {
          title
          type
        }
        featuredImage {
          resized: resize(width: 350, toFormat: WEBP, jpegProgressive: false) {
            src
          }
        }
      }
      ... on ContentfulPage {
        id
        tags {
          title
          type
        }
        featuredImage {
          resized: resize(width: 350, toFormat: WEBP, jpegProgressive: false) {
            src
          }
        }
      }
    }
  }
`;
