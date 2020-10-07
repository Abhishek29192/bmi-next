import React from "react";
import ColorPair, { Colors } from "@bmi/color-pair";
import Typography from "@bmi/typography";
import styles from "./NBACard.module.scss";

type Props = {
  theme: Colors;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const NBACard = ({ theme, title, children, footer }: Props) => {
  return (
    <ColorPair className={styles["NBACard"]} theme={theme}>
      <Typography className={styles["title"]} variant="h4">
        {title}
      </Typography>
      <div className={styles["body"]}>{children}</div>
      {footer}
    </ColorPair>
  );
};

export default NBACard;
