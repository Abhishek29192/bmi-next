import React from "react";
import ColorPair, { Colors } from "@bmi-digital/components/color-pair";
import Typography, {
  Props as TypographyProps
} from "@bmi-digital/components/typography";
import styles from "./PostItCard.module.scss";

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
  return <div className={styles["section"]}>{children}</div>;
};

const PostItCardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["content"]}>{children}</div>;
};

const PostItCardAction = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["action"]}>{children}</div>;
};

const PostItCard = ({ theme = "pearl", children }: Props) => {
  return (
    <ColorPair theme={theme}>
      <div className={styles["PostItCard"]}>{children}</div>
    </ColorPair>
  );
};

PostItCard.Section = PostItCardSection;
PostItCard.Heading = PostItCardHeading;
PostItCard.Content = PostItCardContent;
PostItCard.Action = PostItCardAction;

export default PostItCard;
