import React, { useContext, useState } from "react";
import { graphql } from "gatsby";
import AnchorLink from "@bmi/anchor-link";
import Button, { ButtonProps } from "@bmi/button";
import Section from "@bmi/section";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { uniq, flatten } from "lodash";
import Chip, { Props as ChipProps } from "@bmi/chip";
import Carousel from "@bmi/carousel";
import Grid from "@bmi/grid";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import { SiteContext } from "./Site";
import Link, { getClickableActionFromUrl, Data as LinkData } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/CardCollectionSection.module.scss";
import { Data as PageInfoData } from "./PageInfo";
import { iconMap } from "./Icon";
import { VisualiserContext } from "./Visualiser";
import { TagData } from "./Tag";
import { CalculatorContext } from "./PitchedRoofCalcualtor";

type Card = PageInfoData | PromoData;

export type Data = {
  __typename: "ContentfulCardCollectionSection";
  title: string | null;
  description: RichTextData | null;
  cardType: "Highlight Card" | "Story Card" | "Text Card";
  cardLabel: string | null;
  groupCards: boolean;
  cards: Card[];
  link: LinkData | null;
  justifyCenter: boolean | null;
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
  const { title, subtitle, link, featuredMedia, brandLogo, featuredVideo } =
    transformCard(card);

  const transformedCardLabel = label
    ? label.replace(/{{title}}/g, title)
    : link?.label || `Go to ${title}`;

  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <OverviewCard
      hasTitleUnderline
      title={title}
      media={
        type !== "Text Card"
          ? featuredVideo
            ? renderVideo(featuredVideo)
            : renderImage(featuredMedia)
          : undefined
      }
      isFlat={type === "Story Card"}
      brandImageSource={type !== "Text Card" ? iconMap[brandLogo] : undefined}
      footer={
        link ? (
          <Link
            data-testid={"card-link"}
            component={GTMButton}
            data={link}
            variant="outlined"
            startIcon={<ArrowForwardIcon />}
            gtm={{
              id: "cta-click1",
              label: transformedCardLabel,
              action: link.linkedPage?.path || link.url
            }}
          >
            {transformedCardLabel}
          </Link>
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
  featuredMedia,
  brandLogo,
  featuredVideo,
  ...rest
}: Card): {
  title: Card["title"];
  subtitle: Card["subtitle"];
  link: LinkData | null;
  featuredMedia: Card["featuredMedia"];
  brandLogo: Card["brandLogo"];
  featuredVideo: Card["featuredVideo"];
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

  return { title, subtitle, link, featuredMedia, brandLogo, featuredVideo };
};

const moveRestKeyLast = (arr) => {
  return [...arr.sort((a, b) => (a === "undefined" ? 1 : -1))];
};

const CardCollectionSection = ({
  data: {
    title,
    description,
    cardType,
    cardLabel,
    groupCards,
    cards,
    link,
    justifyCenter
  },
  theme
}: {
  data: Data;
  // TODO: Type me.
  theme: any;
}) => {
  const allKeys = [].concat.apply(
    [],
    cards.map((x) => x.tags)
  );
  const allKeysGrouped = [];
  Array.from(allKeys.values()).forEach((x: TagData) => {
    if (x && !allKeysGrouped.find((y) => y.title == x.title))
      allKeysGrouped.push(x);
  });

  const groupKeys = moveRestKeyLast(allKeysGrouped.map((c) => c.title));
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({});
  const [showMoreIterator, setShowMoreIterator] = useState(1);
  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);

  const shouldDisplayGroups = groupCards && groupKeys.length > 1;

  const getCards = (title: string) => {
    const cardsBySection = cards.filter((x) =>
      x.tags?.find((tag) => tag.title == title)
    );
    return cardsBySection;
  };

  const activeCards = uniq(
    flatten(
      Object.entries(activeGroups).map(([title, isSelected]) =>
        isSelected ? getCards(title) : []
      )
    )
  );
  const iteratableCards =
    shouldDisplayGroups && activeCards.length ? activeCards : cards;

  const cardsPerLoad = 8;
  const numberOfCardsToShow = cardsPerLoad * showMoreIterator;

  const handleShowMoreClick = () => {
    setShowMoreIterator((prevValue) => prevValue + 1);
  };

  const GTMChip = withGTM<ChipProps>(Chip);

  const activeGroupValues = Object.values(activeGroups);

  return (
    <div className={styles["CardCollectionSection"]}>
      <Section backgroundColor={cardType === "Story Card" ? "white" : "pearl"}>
        {title && (
          <Typography className={styles["title"]} variant="h2" hasUnderline>
            {title}
          </Typography>
        )}
        {description && <RichText document={description} />}
        {shouldDisplayGroups && (
          <>
            <Typography variant="h4" component="h3">
              {getMicroCopy("cardCollection.groupTitle")}
            </Typography>
            <div className={styles["group-chips"]}>
              <div className={styles["chips"]}>
                {groupKeys.map((tagTitle, index) => {
                  const label =
                    tagTitle === "undefined"
                      ? getMicroCopy("cardCollection.restLabel")
                      : tagTitle;

                  return (
                    <GTMChip
                      key={`${tagTitle}-${index}`}
                      type="selectable"
                      isSelected={activeGroups[tagTitle]}
                      theme={cardType === "Story Card" ? "pearl" : "white"}
                      gtm={{
                        id: "selector-cards1",
                        label,
                        action: "Selector – Cards Filter"
                      }}
                      onClick={() => {
                        setActiveGroups((activeGroups) => ({
                          ...activeGroups,
                          [tagTitle]: !activeGroups[tagTitle]
                        }));
                      }}
                    >
                      {label}
                    </GTMChip>
                  );
                })}
              </div>
              <AnchorLink
                className={styles["clear-all"]}
                onClick={() => {
                  setActiveGroups({});
                }}
                isDisabled={
                  !activeGroupValues.length || !activeGroupValues.some(Boolean)
                }
              >
                {getMicroCopy("global.clearAll")}
              </AnchorLink>
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
          <Grid container justify={justifyCenter ? "center" : undefined}>
            {iteratableCards.map((card, i) => {
              const { id } = card;
              const cardIsVisible = i >= numberOfCardsToShow;
              return (
                <Grid
                  item
                  key={`${id}-${i}`}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  className={cardIsVisible ? styles["hidden"] : ""}
                >
                  <CardCollectionItem
                    card={card}
                    label={cardLabel}
                    type={cardType}
                  />
                </Grid>
              );
            })}
            {iteratableCards.length > numberOfCardsToShow && (
              <Grid item xs={12} className={styles["show-more-block"]}>
                <Button variant="outlined" onClick={handleShowMoreClick}>
                  {getMicroCopy("global.showMore")}
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        {link && (
          <Button
            action={getClickableActionFromUrl(
              link?.linkedPage,
              link?.url,
              countryCode,
              null,
              link?.label,
              link?.type,
              () => {
                if (link?.type === "Visualiser" && openVisualiser) {
                  openVisualiser(link?.parameters);
                } else if (link?.type === "Calculator" && openCalculator) {
                  openCalculator(link?.parameters);
                }
              }
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
      ...PromoFragment
      ...PageInfoFragment
    }
    justifyCenter
  }
`;