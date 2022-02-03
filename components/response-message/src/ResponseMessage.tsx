import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { SVGImport } from "@bmi/svg-import";
import classnames from "classnames";
import styles from "./ResponseMessage.module.scss";

type Props = {
  icon: SVGImport;
  title: string;
  children?: React.ReactNode;
  error?: boolean;
};
const ResponseMessage = ({ icon, title, children, error }: Props) => (
  <div className={styles["ResponseMessage"]}>
    <Icon
      className={classnames(styles["icon"], error && styles["icon--error"])}
      source={icon}
    />
    <Typography className={styles["title"]} variant="h2">
      {title}
    </Typography>
    {children}
  </div>
);

export default ResponseMessage;
