import React from "react";
import { graphql } from "gatsby";
import { ExpandableCard } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Grid, GridProps } from "@bmi/components";
import { IconList } from "@bmi/components";
import { Card, CardProps } from "@bmi/components";
import BuildIcon from "@material-ui/icons/Build";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import InfoIcon from "@material-ui/icons/Info";
import FindReplaceIcon from "@material-ui/icons/FindReplace";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import HelpIcon from "@material-ui/icons/Help";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import withGTM from "../utils/google-tag-manager";
import { Data as TitleWithContentData } from "./TitleWithContent";
import RichText from "./RichText";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";
import borderedItemStyles from "./styles/BorderedItem.module.scss";
import styles from "./styles/ContactTopics.module.scss";

export const iconMap = {
  build: BuildIcon,
  shoppingCart: AddShoppingCartIcon,
  localShipping: LocalShippingIcon,
  reportProblem: ReportProblemIcon,
  info: InfoIcon,
  findReplace: FindReplaceIcon,
  verifiedUser: VerifiedUserIcon,
  help: HelpIcon
};

export type IconName = keyof typeof iconMap;

type BodyProps = {
  bodyTitle: string | null;
  bodyList: readonly TitleWithContentData[] | null;
};

type FooterProps = {
  footerTitle: string | null;
  parentSectionTitle?: string;
  footerList: readonly (TitleWithContentData | ContactDetailsData)[] | null;
};

export type Data = {
  icon: IconName;
  title: string;
} & BodyProps &
  FooterProps;

const GTMCard = withGTM<CardProps>(Card);

const Body = ({ bodyTitle, bodyList }: BodyProps) => {
  return (
    <>
      {bodyTitle && (
        <Typography component="h4" variant="h6">
          {bodyTitle}
        </Typography>
      )}
      {bodyList && (
        <IconList>
          {bodyList.map(({ title, content }, index) => (
            <IconList.Item
              key={index}
              icon={
                <EmojiObjectsOutlinedIcon
                  style={{ color: "var(--color-theme-accent)" }}
                />
              }
              title={title}
              component="h5"
            >
              <RichText document={content} />
            </IconList.Item>
          ))}
        </IconList>
      )}
    </>
  );
};

// TODO: Component for HR?
const BorderedItem = () => {
  return <div className={borderedItemStyles["BorderedItem"]} />;
};

const Footer = ({
  footerTitle,
  footerList,
  parentSectionTitle
}: FooterProps) => {
  return (
    <div>
      {footerTitle && (
        <Typography variant="h6" style={{ marginBottom: "42px" }}>
          {footerTitle}
        </Typography>
      )}
      {footerList && (
        <Grid container spacing={3}>
          {footerList.map((item, index) => {
            const key = `footer-item-${index}`;
            const gridItemProps: GridProps = {
              xs: 12,
              sm: 6,
              lg: 4,
              item: true
            };

            const gtmLabel = `${parentSectionTitle}${
              item.title ? ` - ${item.title}` : ""
            }`;

            if (item.__typename === "ContentfulTitleWithContent") {
              const { title, content } = item;
              return (
                <Grid key={key} {...gridItemProps}>
                  <BorderedItem />
                  <Typography variant="h5" className={styles["heading"]}>
                    {title}
                  </Typography>
                  <RichText document={content} gtmLabel={gtmLabel} />
                </Grid>
              );
            }

            return (
              <Grid key={key} {...gridItemProps}>
                <BorderedItem />
                <ContactDetails gtmLabel={gtmLabel} data={item} isFlat />
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

const ContactTopics = ({ topics }: { topics: Data[] }) => {
  const items = topics.map((item) => {
    return {
      icon: iconMap[item.icon],
      title: item.title,
      ...(item.bodyTitle || item.bodyList
        ? { body: <Body bodyTitle={item.bodyTitle} bodyList={item.bodyList} /> }
        : []),
      ...(item.footerTitle || item.footerList
        ? {
            footer: (
              <Footer
                parentSectionTitle={item.title}
                footerTitle={item.footerTitle}
                footerList={item.footerList}
              />
            )
          }
        : []),
      gtm: {
        id: "selector-cards2",
        label: item.title,
        action: "Selector - Cards"
      }
    };
  });

  return (
    <ExpandableCard.List
      items={items}
      className={styles["ContactTopics"]}
      cardComponent={(props) => <GTMCard {...props} />}
    />
  );
};

export default ContactTopics;

export const query = graphql`
  fragment ContactTopicsFragment on ContentfulContactTopic {
    icon
    title
    bodyTitle
    bodyList {
      ...TitleWithContentFragment
    }
    footerTitle
    footerList {
      __typename
      ...TitleWithContentFragment
      ...ContactDetailsFragment
    }
  }
`;
