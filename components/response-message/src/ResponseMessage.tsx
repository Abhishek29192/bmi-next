import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import styles from "./ResponseMessage.module.scss";
import classnames from "classnames";

type Props = {
  icon: SVGImport;
  title: string;
  children?: React.ReactNode;
  error?: boolean;
};
const ResponseMessage = ({ icon, title, children, error }: Props) => (
  <div className={styles["ResponseMessage"]}>
    <Icon
      className={classnames(styles["icon"], {
        [styles["icon--error"]]: error
      })}
      source={icon}
    />
    <Typography className={styles["title"]} variant="h2">
      {title}
    </Typography>
    {children}
  </div>
);

export default ResponseMessage;
