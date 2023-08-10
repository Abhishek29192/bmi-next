import {
  Card,
  CardProps,
  ExpandableCard,
  Grid,
  GridProps,
  IconList,
  Typography
} from "@bmi-digital/components";
import { QuestionMark as HelpIcon } from "@bmi-digital/components/icon";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Build as BuildIcon,
  EmojiObjectsOutlined as EmojiObjectsOutlinedIcon,
  FindReplace as FindReplaceIcon,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon,
  ReportProblem as ReportProblemIcon,
  VerifiedUser as VerifiedUserIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import ContactDetails, { Data as ContactDetailsData } from "./ContactDetails";
import RichText from "./RichText";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { BorderItemElement } from "./styles/BorderedItemStyles";
import { BodyTitle, FooterTitle } from "./styles/ContactTopicsStyles";

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
