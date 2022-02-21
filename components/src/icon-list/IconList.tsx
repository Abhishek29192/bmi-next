import React from "react";
import { ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import Typography from "../typography/Typography";
import styles from "./IconList.module.scss";

type ListItemProps = {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  component?: React.ElementType;
  isCompact?: boolean;
};

const ListItem = ({
  icon,
  title,
  children,
  component,
  isCompact
}: ListItemProps) => (
  <li
    className={classnames(
      styles["ListItem"],
      isCompact && styles["ListItem--isCompact"]
    )}
  >
    <div className={styles["icon"]}>{icon || <ChevronRight />}</div>
    <div className={styles["content"]}>
      <Typography
        className={styles["title"]}
        component={component}
        variant={isCompact ? "body1" : "h6"}
      >
        {title}
      </Typography>
      {children && <span className={styles["description"]}>{children}</span>}
    </div>
  </li>
);

type Props = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[];
};

const IconList = ({ children }: Props) => {
  return <ul className={styles["IconList"]}>{children}</ul>;
};

IconList.Item = ListItem;

export default IconList;
