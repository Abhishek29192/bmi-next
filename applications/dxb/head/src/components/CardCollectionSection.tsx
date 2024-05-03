import Button from "@bmi-digital/components/button";
import Carousel from "@bmi-digital/components/carousel";
import Chip from "@bmi-digital/components/chip";
import Grid from "@bmi-digital/components/grid";
import HighlightCard from "@bmi-digital/components/highlight-card";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import Section from "@bmi-digital/components/section";
import StoryCard from "@bmi-digital/components/story-card";
import TextCard from "@bmi-digital/components/text-card";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import { memo, useMemo, useState } from "react";
import { isDefined } from "@bmi/utils";
import withGTM from "../utils/google-tag-manager";
import { stringifyToObject } from "../utils/createActionLabelForAnalytics";
import BrandLogo from "./BrandLogo";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import ButtonLink from "./link/ButtonLink";
import { getCTA } from "./link/utils";
import {
  CardCollectionSectionContainer,
  classes,
  StyledChips,
  StyledClearAllButton,
  StyledGroupChips,
  StyledShowMoreGrid,
  StyledTitle
} from "./styles/CardCollectionSectionStyles";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { Data as LinkData } from "./link/types";
import type { TagData } from "./Tag";
import type { RichTextData } from "./RichText";
import type { Data as PromoData } from "./Promo";
import type { Data as PageInfoData } from "./PageInfo";
import type { ChipProps } from "@bmi-digital/components/chip";
import type { ImageWidths } from "./image/types";

type Card = PageInfoData | PromoData;

export type Data = {
  __typename: "ContentfulCardCollectionSection";
  title: string | null;
  description: RichTextData | null;
  cardType: "Highlight Card" | "Story Card" | "Text Card";
  cardLabel: string | null;
  groupCards: boolean | null;
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

type CardCollectionItemProps = {
  card: Card;
  label: string | null;
  type: Data["cardType"];
};

const mediaWidths: ImageWidths = [561, 321, 381, 446, 330];

const CardCollectionItem = (props: CardCollectionItemProps) => {
  const { card, label, type } = props;
  const { countryCode } = useSiteContext();
  const {
    title,
    subtitle,
    link,
    featuredMedia,
    brandLogo,
    featuredVideo,
    date
  } = transformCard(card, countryCode);

  const transformedCardLabel = transformHyphens(
    label
      ? label.replace(/{{title}}/g, title)
      : card.__typename === "ContentfulPromo"
        ? card.cta?.label
        : undefined
  );

  if (type === "Text Card") {
    return (
      <TextCard
        {...link}
        title={title}
        description={subtitle}
        ctaLabel={transformedCardLabel}
        date={date}
        data-testid={`card-collection-section-item-${replaceSpaces(title)}`}
        gtm={{
          id: "cta-click1",
          label: `${title}${
            transformedCardLabel ? ` - ${transformedCardLabel}` : ""
          }`,
          action: stringifyToObject(link?.to) || link?.href
        }}
      />
    );
  }

  const Component = type === "Story Card" ? StoryCard : HighlightCard;
  return (
    <Component
      {...link}
      title={title}
      description={subtitle}
      media={
        featuredVideo
          ? createVideoProps({
              ...featuredVideo,
              previewMediaWidths: mediaWidths
            })
          : featuredMedia
            ? createImageProps({
                ...featuredMedia,
                previewMediaWidths: mediaWidths
              })
            : undefined
      }
      brandLogo={brandLogo ? <BrandLogo brandName={brandLogo} /> : undefined}
      ctaLabel={transformedCardLabel}
      date={date}
      data-testid={`card-collection-section-item-${replaceSpaces(title)}`}
      gtm={{
        id: "cta-click1",
        label: `${title}${
          transformedCardLabel ? ` - ${transformedCardLabel}` : ""
        }`,
        action: stringifyToObject(link?.to) || link?.href
      }}
    />
  );
};

const MemoedCardCollectionItem = memo(CardCollectionItem);

const transformCard = (card: Card, countryCode: string) => ({
  title:
    card.__typename === "ContentfulPromo"
      ? card.title || card.name
      : card.title,
  subtitle: card.subtitle ? card.subtitle : undefined,
  link: getCTA(card, countryCode),
  featuredMedia: card.featuredMedia,
  brandLogo: card.brandLogo,
  featuredVideo: card.featuredVideo,
  date:
    card.__typename === "ContentfulSimplePage" && card.date
      ? card.date
      : undefined
});

const moveRestKeyLast = (arr: string[]) => {
  return [...arr.sort((a) => (a === "undefined" ? 1 : -1))];
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
  const allKeysGrouped: TagData[] = [];
  Array.from(allKeys.values())
    .filter(isDefined)
    .forEach((x: TagData) => {
      if (!allKeysGrouped.find((y) => y.title == x.title)) {
        allKeysGrouped.push(x);
      }
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
    if (isNaN(Number(b))) {
      return -1;
    } else if (isNaN(Number(a))) {
      return 1;
    }
    return Number(a) - Number(b);
  });

  return (
    <CardCollectionSectionContainer
      data-testid={`card-collection-section-${replaceSpaces(title)}`}
    >
      <Section backgroundColor={cardType === "Story Card" ? "white" : "pearl"}>
        {title && (
          <StyledTitle
            variant="h2"
            hasUnderline
            data-testid="card-collection-section-title"
          >
            {title}
          </StyledTitle>
        )}
        {description && <RichText document={description} />}
        {shouldDisplayGroups && (
          <>
            <Typography
              variant="h4"
              component="h3"
              data-testid="card-collection-section-card-group-title"
            >
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
                onClick={() => {
                  setActiveGroups({});
                }}
                disabled={
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
              const combinedTestId = `card-collection-grid-item-${
                cardIsVisible ? "hidden" : "visible"
              }-${card.id}`;
              return (
                <Grid
                  key={`${id}-${i}`}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  className={cardIsVisible ? classes.hidden : ""}
                  data-testid={combinedTestId}
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
          <ButtonLink
            data={link}
            className={classes.link}
            endIcon={<ArrowForwardIcon />}
          >
            {link.label}
          </ButtonLink>
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
