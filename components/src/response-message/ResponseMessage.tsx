import React from "react";
import { SVGImport } from "@bmi-digital/svg-import";
import classnames from "classnames";
import Icon from "../icon";
import Typography from "../typography/Typography";
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