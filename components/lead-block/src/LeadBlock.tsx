import React from "react";
import classnames from "classnames";
import { Colors } from "@bmi/color-pair";
import Grid from "@bmi/grid";
import PostItCard from "@bmi/post-it-card";
import Typography, { Props as TypographyProps } from "@bmi/typography";
import { GridProps } from "@material-ui/core/Grid";
import styles from "./LeadBlock.module.scss";

type Props = {
  className?: string;
  children: React.ReactNode;
};

type CardProps = {
  children: React.ReactNode;
  theme?: Colors;
  className?: string;
};

const LeadBlockContent = ({ className, children }: Props) => {
  return (
    <Grid
      className={classnames(className, styles["LeadBlockContent"])}
      item
      lg={8}
      xs={12}
    >
      {children}
    </Grid>
  );
};

const LeadBlockContentSection = ({ className, children }: Props) => {
  return (
    <div className={classnames(className, styles["LeadBlockContentSection"])}>
      {children}
    </div>
  );
};

const LeadBlockContentHeading = ({ children, ...rest }: TypographyProps) => {
  return (
    <Typography
      className={styles["LeadBlockContentHeading"]}
      variant="h5"
      {...rest}
    >
      {children}
    </Typography>
  );
};

const LeadBlockCard = ({ children, theme = "pearl", ...rest }: CardProps) => {
  return (
    <Grid item lg={4} xs={12} {...rest}>
      <PostItCard theme={theme}>{children}</PostItCard>
    </Grid>
  );
};

const LeadBlock = ({ className, children, ...rest }: Props & GridProps) => {
  return (
    <Grid
      className={classnames(className, styles["LeadBlock"])}
      container
      spacing={3}
      {...rest}
    >
      {children}
    </Grid>
  );
};

LeadBlock.Content = LeadBlockContent;
LeadBlockContent.Section = LeadBlockContentSection;
LeadBlockContent.Heading = LeadBlockContentHeading;
LeadBlock.Card = LeadBlockCard;
LeadBlockCard.Section = PostItCard.Section;
LeadBlockCard.Heading = PostItCard.Heading;
LeadBlockCard.Content = PostItCard.Content;
LeadBlockCard.Action = PostItCard.Action;

export default LeadBlock;
