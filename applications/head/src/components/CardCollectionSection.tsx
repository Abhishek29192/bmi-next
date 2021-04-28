import React, { useContext, useState, useMemo } from "react";
import { graphql } from "gatsby";
import AnchorLink from "@bmi/anchor-link";
import Button, { ButtonProps } from "@bmi/button";
import Section from "@bmi/section";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { uniq, flatten, groupBy, find } from "lodash";
import Chip, { Props as ChipProps } from "@bmi/chip";
import Carousel from "@bmi/carousel";
import Grid from "@bmi/grid";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/CardCollectionSection.module.scss";
import { Data as PageInfoData } from "./PageInfo";
import { iconMap } from "./Icon";
import { VisualiserContext } from "./Visualiser";

type Card = PageInfoData | PromoData;

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
  const { open } = useContext(VisualiserContext);
  const {
    title,
    subtitle,
    link,
    featuredMedia,
    brandLogo,
    featuredVideo
  } = transformCard(card);

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
          <GTMButton
            variant="outlined"
            action={getClickableActionFromUrl(
              link.linkedPage,
              link.url,
              countryCode,
              null,
              transformedCardLabel,
              link?.type,
              () => {
                open(link?.parameters);
              }
            )}
            startIcon={<ArrowForwardIcon />}
            gtm={{
              id: "cta-click1",
              label: transformedCardLabel,
              action: link.linkedPage?.path || link.url
            }}
          >
            {transformedCardLabel}
          </GTMButton>
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
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({});
  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const { open } = useContext(VisualiserContext);
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

  const GTMChip = withGTM<ChipProps>(Chip);

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
                isDisabled={!Object.keys(activeGroups).length}
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
              countryCode,
              null,
              link?.label,
              link?.type,
              () => {
                open(link?.parameters);
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
  }
`;
