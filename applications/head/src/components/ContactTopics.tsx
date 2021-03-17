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
import Card, { CardProps } from "@bmi/card";
import Typography from "@bmi/typography";
import Grid, { GridProps } from "@bmi/grid";
import IconList from "@bmi/icon-list";
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
  bodyTitle?: string;
  bodyList?: readonly TitleWithContentData[];
};

type FooterProps = {
  footerTitle?: string;
  footerList?: readonly (TitleWithContentData | ContactDetailsData)[];
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
          {bodyList.map(({ title, content }, index) => (
            <IconList.Item
              key={index}
              icon={<EmojiObjectsOutlinedIcon style={{ color: "#009FE3" }} />}
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

const Footer = ({ footerTitle, footerList }: FooterProps) => {
  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: "42px" }}>
        {footerTitle}
      </Typography>

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

            if (item.__typename === "ContentfulTitleWithContent") {
              const { title, content } = item;
              return (
                <Grid key={key} {...gridItemProps}>
                  <BorderedItem />
                  <Typography variant="h5" className={styles["heading"]}>
                    {title}
                  </Typography>
                  <RichText document={content} />
                </Grid>
              );
            }

            return (
              <Grid key={key} {...gridItemProps}>
                <BorderedItem />
                <ContactDetails data={item} isFlat />
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

const ContactTopics = ({ topics }: { topics: Data[] }) => {
  const GTMCard = withGTM<CardProps>(Card, { label: "aria-label" });
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

  return (
    <ExpandableCard.List
      items={items}
      className={styles["ContactTopics"]}
      cardComponent={(props) => (
        <GTMCard
          gtm={{
            id: "selector-cards2",
            action: "Selector – Cards"
          }}
          {...props}
        />
      )}
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
