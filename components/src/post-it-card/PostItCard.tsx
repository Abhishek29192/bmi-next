import React from "react";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import Typography, { Props as TypographyProps } from "../typography/Typography";
import { useStyles } from "./styles";

type Props = {
  theme?: Colors;
  children: React.ReactNode;
};

const PostItCardHeading = ({ children, ...rest }: TypographyProps) => {
  return (
    <Typography variant="h4" {...rest}>
      {children}
    </Typography>
  );
};

const PostItCardSection = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return <div className={classes.section}>{children}</div>;
};

const PostItCardContent = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return <div className={classes.content}>{children}</div>;
};

const PostItCardAction = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return <div className={classes.action}>{children}</div>;
};

const PostItCard = ({ theme = "pearl", children }: Props) => {
  const classes = useStyles();
  return (
    <ColorPair theme={theme}>
      <div className={classes.root}>{children}</div>
    </ColorPair>
  );
};

PostItCard.Section = PostItCardSection;
PostItCard.Heading = PostItCardHeading;
PostItCard.Content = PostItCardContent;
PostItCard.Action = PostItCardAction;

export default PostItCard;
