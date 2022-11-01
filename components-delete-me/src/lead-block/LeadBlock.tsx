import { GridProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { Colors } from "../color-pair/ColorPair";
import Grid from "../grid/Grid";
import PostItCard from "../post-it-card/PostItCard";
import Typography, { Props as TypographyProps } from "../typography/Typography";
import { useStyles } from "./styles";

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
    <Grid className={className} item lg={8} xs={12}>
      {children}
    </Grid>
  );
};

const LeadBlockContentSection = ({ className, children }: Props) => {
  const classes = useStyles();
  return (
    <div className={classnames(className, classes.leadBlockContentSection)}>
      {children}
    </div>
  );
};

const LeadBlockContentHeading = ({ children, ...rest }: TypographyProps) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.leadBlockContentHeading}
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
  const classes = useStyles();
  return (
    <Grid
      className={classnames(className, classes.root)}
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
