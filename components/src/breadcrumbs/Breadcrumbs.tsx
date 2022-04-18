import React, { useContext } from "react";
import {
  Breadcrumbs as MaterialBreadcrumbs,
  BreadcrumbsProps,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import classnames from "classnames";
import Button from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { transformHyphens } from "../utils/commonUtils";
import styles from "./Breadcrumbs.module.scss";

type BreadcrumbsItemProps = {
  children: React.ReactNode;
  action?: ClickableAction;
};

const BreadcrumbsItem = ({
  children,
  action
}: Partial<BreadcrumbsItemProps>) => {
  const isDarkThemed = useContext(ThemeContext);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Button
      hasDarkBackground={isDarkThemed}
      className={classnames(styles["button"], {
        [styles["link"]!]: action
      })}
      variant="text"
      disabled={!action}
      startIcon={
        matches ? null : <Icon className={styles["icon"]} source={ArrowBack} />
      }
      action={action}
    >
      {action ? (
        <span className={styles["label"]}>{transformHyphens(children)}</span>
      ) : (
        <span>{transformHyphens(children)}</span>
      )}
    </Button>
  );
};

export type Props = {
  isDarkThemed?: boolean;
} & Omit<
  BreadcrumbsProps,
  "itemsBeforeCollapse" | "itemsAfterCollapse" | "maxItems"
>;

const ThemeContext = React.createContext<boolean>(false);

const removeDeadLinks = (children: React.ReactNode) => {
  const allItems = React.Children.toArray(children);

  return allItems.filter(
    (child, iterator) =>
      (React.isValidElement(child) && child.props.action) ||
      iterator === allItems.length - 1
  );
};

const truncateChildren = (children: React.ReactNodeArray) =>
  children.length > 5
    ? [
        ...children.slice(0, 1),
        <Typography className={styles["ellipsis"]} key={Math.random()}>
          ...
        </Typography>,
        ...children.slice(children.length - 2, children.length)
      ]
    : children;

const Breadcrumbs = ({
  isDarkThemed = false,
  className,
  children,
  ...rest
}: Props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const activeLinkList = removeDeadLinks(children);

  return (
    <ThemeContext.Provider value={isDarkThemed}>
      <MaterialBreadcrumbs
        {...rest}
        className={classnames(styles["Breadcrumbs"], className, {
          [styles["Breadcrumbs--dark-themed"]!]: isDarkThemed
        })}
        aria-label="breadcrumbs"
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        maxItems={5}
      >
        {matches
          ? truncateChildren(activeLinkList)
          : activeLinkList[activeLinkList.length - 2]}
      </MaterialBreadcrumbs>
    </ThemeContext.Provider>
  );
};

Breadcrumbs.Item = BreadcrumbsItem;

export default Breadcrumbs;
