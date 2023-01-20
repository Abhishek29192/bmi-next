import {
  Card,
  CardProps,
  ExpandableCard,
  Grid,
  GridProps,
  IconList,
  Typography
} from "@bmi-digital/components";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { styled } from "@mui/material/styles";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";
import RichText from "./RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";
import borderedItemStyles from "./styles/BorderedItem.module.scss";
import styles from "./styles/ContactTopics.module.scss";

const StyledEmojiOutlinedIcon = styled(EmojiObjectsOutlinedIcon)(
  ({ theme }) => ({
    color: theme.colours.accent
  })
);

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
              icon={<StyledEmojiOutlinedIcon />}
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
              lg: 4
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
