import {
  Breadcrumbs as MaterialBreadcrumbs,
  BreadcrumbsProps,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import classnames from "classnames";
import React, { useContext } from "react";
import Button from "../button";
import { ClickableAction } from "../clickable";
import Icon from "../icon";
import Typography from "../typography";
import { transformHyphens } from "../utils/hyphenUtils";
import { useStyles } from "./styles";

type BreadcrumbsItemProps = {
  children: React.ReactNode;
  action?: ClickableAction;
};

const BreadcrumbsItem = ({
  children,
  action
}: Partial<BreadcrumbsItemProps>) => {
  const isDarkThemed = useContext(ThemeContext);
  const classes = useStyles();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Button
      hasDarkBackground={isDarkThemed}
      className={classnames(classes.button, action && classes.link)}
      variant="text"
      disabled={!action}
      startIcon={
        matches ? null : <Icon className={classes.icon} source={ArrowBack} />
      }
      action={action}
    >
      {action ? (
        <span className={classes.label}>{transformHyphens(children)}</span>
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

const truncateChildren = (
  children: React.ReactNodeArray,
  classes: ReturnType<typeof useStyles>
) =>
  children.length > 5
    ? [
        ...children.slice(0, 1),
        <Typography className={classes.ellipsis} key={Math.random()}>
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
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const activeLinkList = removeDeadLinks(children);

  return (
    <ThemeContext.Provider value={isDarkThemed}>
      <MaterialBreadcrumbs
        {...rest}
        classes={{ separator: classes.separator }}
        className={classnames(
          classes.root,
          className,
          isDarkThemed && classes.darkThemed
        )}
        aria-label="breadcrumbs"
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        maxItems={5}
      >
        {matches
          ? truncateChildren(activeLinkList, classes)
          : activeLinkList[activeLinkList.length - 2]}
      </MaterialBreadcrumbs>
    </ThemeContext.Provider>
  );
};

Breadcrumbs.Item = BreadcrumbsItem;

export default Breadcrumbs;
