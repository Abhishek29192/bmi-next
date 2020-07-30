import React, { useContext } from "react";
import MaterialBreadcrumbs, {
  BreadcrumbsProps
} from "@material-ui/core/Breadcrumbs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ArrowBack } from "@material-ui/icons";
import { useTheme } from "@material-ui/core/styles";
import Button from "@bmi/button";
import Icon from "@bmi/icon";
import styles from "./Breadcrumbs.module.scss";
import classnames from "classnames";

type BreadcrumbsItemProps = {
  children: React.ReactNode;
  isLightThemed?: boolean;
  linkComponent?: React.ElementType<any>;
  // TODO: The following types should depend on the ElementType
  href?: string;
  to?: string;
};

const BreadcrumbsItem = ({
  isLightThemed,
  children,
  linkComponent: LinkComponent,
  ...linkProps
}: Partial<BreadcrumbsItemProps>) => {
  const isDarkThemed = useContext(ThemeContext);

  const BreadcrumbButton = ({ isDisabled }: { isDisabled?: boolean }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));

    return (
      <Button
        hasDarkBackground={isDarkThemed}
        className={styles["button"]}
        variant="text"
        disabled={isDisabled}
        startIcon={
          matches ? null : (
            <Icon className={styles["icon"]} source={ArrowBack} />
          )
        }
      >
        <span className={styles["label"]}>{children}</span>
      </Button>
    );
  };

  if (!LinkComponent) {
    return <BreadcrumbButton isDisabled />;
  }

  return (
    <LinkComponent {...linkProps} className={styles["link"]}>
      <BreadcrumbButton />
    </LinkComponent>
  );
};

type Props = {
  isDarkThemed?: boolean;
} & Omit<
  BreadcrumbsProps,
  "itemsBeforeCollapse" | "itemsAfterCollapse" | "maxItems"
>;

const ThemeContext = React.createContext<boolean>(false);

const getLastLinkedNode = (children: React.ReactNode) => {
  return React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.props.linkComponent)
    .slice(-1);
};

const Breadcrumbs = ({ isDarkThemed, className, children, ...rest }: Props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <ThemeContext.Provider value={isDarkThemed}>
      <MaterialBreadcrumbs
        {...rest}
        className={classnames(styles["Breadcrumbs"], className, {
          [styles["Breadcrumbs--dark-themed"]]: isDarkThemed
        })}
        aria-label="breadcrumbs"
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        maxItems={5}
      >
        {matches ? children : getLastLinkedNode(children)}
      </MaterialBreadcrumbs>
    </ThemeContext.Provider>
  );
};

Breadcrumbs.Item = BreadcrumbsItem;

export default Breadcrumbs;
