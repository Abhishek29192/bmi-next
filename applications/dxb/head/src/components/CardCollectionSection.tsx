import React, { useContext, useState, useMemo, memo } from "react";
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
import { withClickable } from "@bmi/clickable";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import { useSiteContext } from "./Site";
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
  sortOrder:
    | "Default (Contentful)"
    | "Date (Newest first)"
    | "Date (Oldest first)"
    | null;
  link: LinkData | null;
  justifyCenter: boolean | null;
};

const CardCollectionItem = ({
  card,
  label,
  type,
  date
}: {
  card: Card;
  label: string;
  type: Data["cardType"];
  date?: string;
}) => {
  const {
    name,
    title,
    subtitle,
    link,
    featuredMedia,
    brandLogo,
    featuredVideo
  } = transformCard(card);

  const transformedCardLabel = label
    ? label.replace(/{{title}}/g, title || name)
    : link?.label;

  const GTMButton = withGTM<ButtonProps>(Button);
  const GTMButtonBase = withGTM<ButtonBaseProps>(withClickable(ButtonBase));

  const CardButton = (props) => (
    <Link
      component={GTMButtonBase}
      data={link}
      gtm={{
        id: "cta-click1",
        label: transformedCardLabel,
        action: link.linkedPage?.path || link.url
      }}
      {...props}
    />
  );

  const isFlat = type === "Story Card";

  return (
    <OverviewCard
      title={title || name}
      media={
        type !== "Text Card"
          ? featuredVideo
            ? renderVideo(featuredVideo)
            : renderImage(featuredMedia)
          : undefined
      }
      isFlat={isFlat}
      brandImageSource={type !== "Text Card" ? iconMap[brandLogo] : undefined}
      clickableArea={
        link
          ? type !== "Text Card" && featuredVideo
            ? "body"
            : "full"
          : "none"
      }
      buttonComponent={link ? CardButton : "div"}
      footer={
        <>
          {date ? (
            <Typography variant="h6" className={styles["date"]}>
              {date}
            </Typography>
          ) : null}
          {link && transformedCardLabel ? (
            isFlat ? (
              <CardButton
                data-testid={"card-link"}
                component={GTMButton}
                variant="outlined"
                startIcon={<ArrowForwardIcon />}
              >
                {transformedCardLabel}
              </CardButton>
            ) : (
              <Button
                data-testid={"card-link"}
                component="span"
                variant="outlined"
              >
                {transformedCardLabel}
              </Button>
            )
          ) : undefined}
        </>
      }
    >
      {subtitle}
    </OverviewCard>
  );
};

const MemoedCardCollectionItem = memo(CardCollectionItem);

// TODO: Reuse the getCTA function here.
const transformCard = ({
  title,
  subtitle,
  featuredMedia,
  brandLogo,
  featuredVideo,
  ...rest
}: Card) => {
  let name = null;
  let link = null;
  let date = null;

  if (rest.__typename === "ContentfulPromo") {
    link = rest.cta;
    name = rest.name;
  } else {
    link = {
      linkedPage: {
        path: rest.path
      }
    };
  }

  if (rest.__typename === "ContentfulSimplePage") {
    date = rest.date;
  }

  return {
    name,
    title,
    subtitle,
    link,
    featuredMedia,
    brandLogo,
    featuredVideo,
    date
  };
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
    justifyCenter,
    sortOrder
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
  const { getMicroCopy, countryCode, node_locale } = useSiteContext();
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

  const formatDate = (date: string): string =>
    new Intl.DateTimeFormat(
      // Required until Norway's locale is fixed in V8 https://bugs.chromium.org/p/v8/issues/detail?id=11897
      node_locale === "nb-NO" ? "no" : node_locale || undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    ).format(new Date(date));

  const iteratableCards =
    shouldDisplayGroups && activeCards.length ? activeCards : cards;

  const noDateSortWeight = sortOrder === "Date (Newest first)" ? 0 : Infinity;

  const sortedIterableCards = useMemo(
    () =>
      sortOrder
        ? [...iteratableCards].sort((first, second) => {
            const firstWeight =
              "date" in first && first.date
                ? new Date(first.date).getTime()
                : noDateSortWeight;
            const secondWeight =
              "date" in second && second.date
                ? new Date(second.date).getTime()
                : noDateSortWeight;

            switch (sortOrder) {
              case "Date (Oldest first)":
                return firstWeight - secondWeight;
              case "Date (Newest first)":
                return secondWeight - firstWeight;
              case "Default (Contentful)":
              default:
                return 0;
            }
          })
        : iteratableCards,
    [sortOrder, iteratableCards]
  );

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
            {sortedIterableCards.map((card, i) => {
              const { id } = card;
              return (
                <Carousel.Slide key={`${id}-${i}`}>
                  <MemoedCardCollectionItem
                    card={card}
                    label={cardLabel}
                    type={cardType}
                    date={
                      "date" in card && card.date
                        ? formatDate(card.date)
                        : undefined
                    }
                  />
                </Carousel.Slide>
              );
            })}
            <Carousel.Controls type="arrows" />
          </Carousel>
        ) : (
          <Grid container justify={justifyCenter ? "center" : undefined}>
            {sortedIterableCards.map((card, i) => {
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
                    date={
                      "date" in card && card.date
                        ? formatDate(card.date)
                        : undefined
                    }
                  />
                </Grid>
              );
            })}
            {sortedIterableCards.length > numberOfCardsToShow && (
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
      ...PromoCardFragment
      ...PageInfoCardFragment
    }
    justifyCenter
    sortOrder
  }
`;
