import Card from "@bmi-digital/components/card";
import ExpandableCard from "@bmi-digital/components/expandable-card";
import Grid from "@bmi-digital/components/grid";
import IconList from "@bmi-digital/components/icon-list";
import AddShoppingCartIcon from "@bmi-digital/components/icon/AddShoppingCart";
import BuildIcon from "@bmi-digital/components/icon/Build";
import EmojiObjectsOutlinedIcon from "@bmi-digital/components/icon/EmojiObjectsOutlined";
import FindReplaceIcon from "@bmi-digital/components/icon/FindReplace";
import InfoIcon from "@bmi-digital/components/icon/Info";
import LocalShippingIcon from "@bmi-digital/components/icon/LocalShipping";
import HelpIcon from "@bmi-digital/components/icon/QuestionMark";
import ReportProblemIcon from "@bmi-digital/components/icon/ReportProblem";
import VerifiedUserIcon from "@bmi-digital/components/icon/VerifiedUser";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import ContactDetails from "./ContactDetails";
import RichText from "./RichText";
import { BorderItemElement } from "./styles/BorderedItemStyles";
import { BodyTitle, FooterTitle } from "./styles/ContactTopicsStyles";
import type { GridProps } from "@bmi-digital/components/grid";
import type { CardProps } from "@bmi-digital/components/card";
import type { Data as ContactDetailsData } from "./ContactDetails";
import type { Data as TitleWithContentData } from "./TitleWithContent";

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
        <BodyTitle component="h4" variant="h6">
          {bodyTitle}
        </BodyTitle>
      )}
      {bodyList && (
        <IconList>
          {bodyList.map(({ title, content }, index) => (
            <IconList.Item
              key={index}
              icon={<StyledEmojiOutlinedIcon />}
              title={title || ""}
              component="h5"
            >
              <RichText document={content} hasNoBottomMargin />
            </IconList.Item>
          ))}
        </IconList>
      )}
    </>
  );
};

// TODO: Component for HR?
const BorderedItem = () => {
  return <BorderItemElement />;
};

const Footer = ({
  footerTitle,
  footerList,
  parentSectionTitle
}: FooterProps) => {
  return (
    <div>
      {footerTitle && (
        <Typography variant="h6" style={{ marginBottom: "24px" }}>
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
                  <FooterTitle variant="h5">{title}</FooterTitle>
                  <RichText document={content} gtmLabel={gtmLabel} />
                </Grid>
              );
            }

            return (
              <Grid key={key} {...gridItemProps}>
                <BorderedItem />
                <ContactDetails gtmLabel={gtmLabel} data={item} />
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
      cardComponent={(props) => <GTMCard {...props} />}
      data-testid={"contact-topics"}
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
