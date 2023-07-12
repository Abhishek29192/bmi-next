import {
  Button,
  ButtonProps,
  Carousel,
  Chip,
  ChipProps,
  Grid,
  OverviewCard,
  replaceSpaces,
  Section,
  transformHyphens,
  Typography,
  withClickable
} from "@bmi-digital/components";
import { ArrowForward as ArrowForwardIcon } from "@bmi-digital/components/icon";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { graphql } from "gatsby";
import React, { memo, useMemo, useState } from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import BrandLogo from "./BrandLogo";
import Image from "./Image";
import Link, { Data as LinkData } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { Data as PromoData } from "./Promo";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import {
  CardCollectionSectionContainer,
  classes,
  StyledChips,
  StyledClearAllButton,
  StyledGroupChips,
  StyledShowMoreGrid,
  StyledTitle,
  StyledButtonBaseTitle
} from "./styles/CardCollectionSectionStyles";
import { TagData } from "./Tag";
import Video from "./Video";

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
  displaySingleRow: boolean | null;
};

const CardCollectionItem = ({
  card,
  label,
  type
}: {
  card: Card;
  label?: string;
  type: Data["cardType"];
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

  let transformedCardLabel = label
    ? label.replace(/{{title}}/g, title || name)
    : link?.label;
  transformedCardLabel = transformHyphens(transformedCardLabel);
  const GTMButton = withGTM<ButtonProps>(Button);
  const GTMButtonBase = withGTM<ButtonBaseProps>(
    withClickable(StyledButtonBaseTitle)
  );

  const date = "date" in card && card.date ? card.date : undefined;

  const CardButton = (props) => (
    <Link
      component={(props: ButtonBaseProps) => <GTMButtonBase {...props} />}
      data={link}
      gtm={{
        id: "cta-click1",
        label: `${title || name}${
          transformedCardLabel ? ` - ${transformedCardLabel}` : ""
        }`
      }}
      {...props}
    />
  );

  const isFlat = type === "Story Card";
  return (
    <OverviewCard
      title={title || name}
      media={
        type !== "Text Card" ? (
          featuredVideo ? (
            <Video {...featuredVideo} />
          ) : featuredMedia ? (
            <Image {...featuredMedia} />
          ) : undefined
        ) : undefined
      }
      isFlat={isFlat}
      brandImageSource={
        type !== "Text Card" ? <BrandLogo brandName={brandLogo} /> : undefined
      }
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
          {date ? <Typography variant="h6">{date}</Typography> : null}
          {link && transformedCardLabel ? (
            isFlat ? (
              <CardButton
                className="footer-button"
                data-testid={"card-link"}
                component={GTMButton}
                variant="outlined"
                startIcon={<ArrowForwardIcon />}
              >
                {transformedCardLabel}
              </CardButton>
            ) : (
              <Button
                className={classes["footer-button"]}
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
      data-testid={`card-collection-section-item-${replaceSpaces(
        title || name
      )}`}
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
    sortOrder,
    displaySingleRow
  },
  theme
}: {
  data: Data;
  theme?: {
    cardCollectionRowType: "single-row";
  };
}) => {
  const allKeys = cards.flatMap((x) => x.tags);
  const allKeysGrouped = [];
  Array.from(allKeys.values()).forEach((x: TagData) => {
    if (x && !allKeysGrouped.find((y) => y.title == x.title))
      allKeysGrouped.push(x);
  });

  const groupKeys = moveRestKeyLast(allKeysGrouped.map((c) => c.title));
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({});
  const [showMoreIterator, setShowMoreIterator] = useState(1);
  const { getMicroCopy } = useSiteContext();

  const shouldDisplayGroups = groupCards && groupKeys.length > 1;

  const getCards = (title: string) => {
    return cards.filter((x) => x.tags?.find((tag) => tag.title == title));
  };

  const activeCards = [
    ...new Set(
      Object.entries(activeGroups).flatMap(([title, isSelected]) =>
        isSelected ? getCards(title) : []
      )
    )
  ];

  const iterableCards =
    shouldDisplayGroups && activeCards.length ? activeCards : cards;

  const noDateSortWeight = sortOrder === "Date (Newest first)" ? 0 : Infinity;

  const sortedIterableCards = useMemo(
    () =>
      sortOrder
        ? [...iterableCards].sort((first, second) => {
            const firstWeight =
              "rawDate" in first && first.rawDate
                ? new Date(first.rawDate).getTime()
                : noDateSortWeight;
            const secondWeight =
              "rawDate" in second && second.rawDate
                ? new Date(second.rawDate).getTime()
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
        : iterableCards,
    [sortOrder, iterableCards, noDateSortWeight]
  );

  const cardsPerLoad = 8;
  const numberOfCardsToShow = cardsPerLoad * showMoreIterator;

  const handleShowMoreClick = () => {
    setShowMoreIterator((prevValue) => prevValue + 1);
  };

  const GTMChip = withGTM<ChipProps>(Chip);

  const activeGroupValues = Object.values(activeGroups);
  const sortedGroupKeys = groupKeys.sort((a, b) => {
    if (isNaN(b)) {
      return -1;
    } else if (isNaN(a)) {
      return 1;
    }
    return a - b;
  });

  return (
    <CardCollectionSectionContainer
      data-testid={`card-collection-section-${replaceSpaces(title)}`}
    >
      <Section backgroundColor={cardType === "Story Card" ? "white" : "pearl"}>
        {title && (
          <StyledTitle variant="h2" hasUnderline>
            {title}
          </StyledTitle>
        )}
        {description && <RichText document={description} />}
        {shouldDisplayGroups && (
          <>
            <Typography variant="h4" component="h3">
              {getMicroCopy(microCopy.CARD_COLLECTION_GROUP_TITLE)}
            </Typography>
            <StyledGroupChips>
              <StyledChips>
                {sortedGroupKeys.map((tagTitle, index) => {
                  const label =
                    tagTitle === "undefined"
                      ? getMicroCopy(microCopy.CARD_COLLECTION_REST_LABEL)
                      : tagTitle;

                  return (
                    <GTMChip
                      key={`${tagTitle}-${index}`}
                      type="selectable"
                      // eslint-disable-next-line security/detect-object-injection
                      isSelected={activeGroups[tagTitle]}
                      color={cardType === "Story Card" ? "pearl" : "white"}
                      gtm={{
                        id: "selector-cards1",
                        label,
                        action: "Selector – Cards Filter"
                      }}
                      onClick={() => {
                        setActiveGroups((activeGroups) => ({
                          ...activeGroups,
                          // eslint-disable-next-line security/detect-object-injection
                          [tagTitle]: !activeGroups[tagTitle]
                        }));
                      }}
                    >
                      {label}
                    </GTMChip>
                  );
                })}
              </StyledChips>
              <StyledClearAllButton
                component="button"
                onClick={() => {
                  setActiveGroups({});
                }}
                isDisabled={
                  !activeGroupValues.length || !activeGroupValues.some(Boolean)
                }
              >
                {getMicroCopy(microCopy.GLOBAL_CLEAR_ALL)}
              </StyledClearAllButton>
            </StyledGroupChips>
          </>
        )}
        {theme?.cardCollectionRowType === "single-row" || displaySingleRow ? (
          <Carousel
            slidesPerPage={{
              xs: 1,
              md: 2,
              lg: 3,
              xl: 4
            }}
            scroll="finite"
            hasGutter
            enableAnimateHeightMobile={false}
            disableLazyLoading={true}
          >
            {sortedIterableCards.map((card, i) => {
              const { id } = card;
              return (
                <Carousel.Slide key={`${id}-${i}`}>
                  <MemoedCardCollectionItem
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
          <Grid container justifyContent={justifyCenter ? "center" : undefined}>
            {sortedIterableCards.map((card, i) => {
              const { id } = card;
              const cardIsVisible = i >= numberOfCardsToShow;
              return (
                <Grid
                  key={`${id}-${i}`}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  className={cardIsVisible ? classes.hidden : ""}
                  data-testid={`card-collection-grid-item-${card.id}`}
                >
                  <CardCollectionItem
                    card={card}
                    label={cardLabel}
                    type={cardType}
                  />
                </Grid>
              );
            })}
            {sortedIterableCards.length > numberOfCardsToShow && (
              <StyledShowMoreGrid xs={12}>
                <Button variant="outlined" onClick={handleShowMoreClick}>
                  {getMicroCopy(microCopy.GLOBAL_SHOW_MORE)}
                </Button>
              </StyledShowMoreGrid>
            )}
          </Grid>
        )}
        {link && (
          <Link
            component={Button}
            data={link}
            className={classes.link}
            endIcon={<ArrowForwardIcon />}
          >
            {link.label}
          </Link>
        )}
      </Section>
    </CardCollectionSectionContainer>
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
    displaySingleRow
    sortOrder
  }
`;
