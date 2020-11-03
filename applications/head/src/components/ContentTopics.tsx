import React from "react";
import { graphql } from "gatsby";
import BuildIcon from "@material-ui/icons/Build";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import InfoIcon from "@material-ui/icons/Info";
import FindReplaceIcon from "@material-ui/icons/FindReplace";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import HelpIcon from "@material-ui/icons/Help";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";

import ExpandableCard from "@bmi/expandable-card";
import Typography from "@bmi/typography";
import IconList from "@bmi/icon-list";
import { Data as TitleWithContentData } from "./TitleWithContent";
import RichText from "./RichText";

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
  bodyTitle?: string;
  bodyList?: readonly TitleWithContentData[];
};

type FooterProps = {
  footerTitle?: string;
  footerList?: readonly TitleWithContentData[];
};

export type Data = {
  icon?: IconName | null;
  title?: string;
} & BodyProps &
  FooterProps;

const Body = ({ bodyTitle, bodyList }: BodyProps) => {
  return (
    <>
      <Typography component="h4" variant="h6">
        {bodyTitle}
      </Typography>
      {bodyList && (
        <IconList>
          {bodyList.map(({ title, content }: TitleWithContentData, index) => (
            <IconList.Item
              key={index}
              icon={<EmojiObjectsOutlinedIcon style={{ color: "#009FE3" }} />}
              title={title}
              component="h5"
            >
              <RichText document={content.json} />
            </IconList.Item>
          ))}
        </IconList>
      )}
    </>
  );
};
const Footer = ({ footerTitle, footerList }: FooterProps) => {
  return (
    <>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        {footerTitle}
      </Typography>

      {footerList &&
        footerList.map(({ title, content }: TitleWithContentData, index) => (
          <div key={index}>
            <Typography>{title}</Typography>
            <RichText document={content.json} />
          </div>
        ))}
    </>
  );
};

const ContentTopics = ({ topics }: { topics: Data[] }) => {
  const items = topics.map((item) => {
    return {
      icon: iconMap[item.icon],
      title: item.title,
      body: <Body bodyTitle={item.bodyTitle} bodyList={item.bodyList} />,
      footer: (
        <Footer footerTitle={item.footerTitle} footerList={item.footerList} />
      )
    };
  });

  return <ExpandableCard.List items={items} />;
};

export default ContentTopics;

export const query = graphql`
  fragment ContentTopicsFragment on ContentfulContentTopic {
    icon
    title
    bodyTitle
    bodyList {
      ...TitleWithContentFragment
    }
    footerTitle
    footerList {
      __typename
      ... on ContentfulTitleWithContent {
        ...TitleWithContentFragment
      }
    }
  }
`;
