import type { GridProps } from "@material-ui/core";
import {
  AppBarProps,
  Box,
  makeStyles,
  Tab as MaterialTab,
  TabProps as MaterialTabProps,
  Tabs as MaterialTabs,
  TabsProps as MaterialTabsProps,
  Theme
} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import Container, { Props as ContainerProps } from "../container/Container";
import Grid from "../grid/Grid";
import { transformHyphens } from "../utils/commonUtils";
import styles from "./Tabs.module.scss";

export const useGlobalTabStyles = makeStyles(
  (theme: Theme) => ({
    ContainerRoot: {
      fontSize: "1rem",
      paddingLeft: "0px",
      paddingRight: "0px"
    },
    TabsRoot: {
      fontSize: "1rem",
      marginBottom: "2px",
      "& .tabsScrollBtn": {
        position: "absolute",
        height: "100%",
        zIndex: 2,
        background: theme.palette.common.white,
        transition: "all 0.2s ease-out",
        "&:first-child": {
          left: 0,
          opacity: 1
        },
        "&:last-child": {
          right: 0,
          opacity: 1
        },
        "&.Mui-disabled": {
          opacity: 0,
          transition: "all 0.2s ease-out"
        }
      }
    },
    TabRoot: {
      fontSize: "1rem",
      minWidth: "initial",
      padding: "6px 15px",
      "& .Mui-selected": {
        fontFamily: "Effra Medium"
      }
    }
  }),
  { classNamePrefix: "tabStyles" }
);

type TabPanelProps = GridProps & {
  className?: string;
  children?: React.ReactNode;
  heading: string;
  index: any;
  value?: any;
};

const TabPanel = ({
  children,
  className,
  value,
  index,
  ...other
}: TabPanelProps) => {
  const formattedIndex =
    typeof index === "string" ? index.replace(/ /g, "-") : index;
  return (
    <Grid
      item
      className={classnames(styles["TabPanel"], className)}
      aria-labelledby={`tab-${formattedIndex}`}
      hidden={value !== formattedIndex}
      id={`tabpanel-${formattedIndex}`}
      key={`tabpanel-${formattedIndex}`}
      role="tabpanel"
      data-testid={`tabpanel-${formattedIndex}`}
      {...other}
    >
      <Box className={styles["TabPanelBox"]} p={3}>
        {children}
      </Box>
    </Grid>
  );
};

type TabsProps = MaterialTabsProps &
  Pick<AppBarProps, "color"> & {
    children:
      | (React.ReactElement<TabPanelProps> | React.ReactNode)
      | (React.ReactElement<TabPanelProps> | React.ReactNode)[];
    initialValue?: any;
    tabComponent?: React.ComponentType<any>; // TODO
    visibleUntil?: "sm" | "md";
    theme?: "primary" | "secondary";
    // NOTE: This is necessary until we upgrade to @material-ui/core@^5.0.0
    // see: https://github.com/mui-org/material-ui/issues/22452#issuecomment-685756045
    component?: React.ElementType;
    onChange?: (index: string) => void;
    maxWidth?: ContainerProps["maxWidth"];
  };

export type TabProps = { index?: number } & MaterialTabProps;

export const Tab = ({ index, label, ...rest }: TabProps) => {
  const globalClasses = useGlobalTabStyles();
  return (
    <MaterialTab
      aria-controls={`tabpanel-${index}`}
      id={`tab-${index}`}
      key={index}
      label={label}
      value={index}
      className={globalClasses.TabRoot}
      {...rest}
    />
  );
};

const Tabs = ({
  children,
  className,
  initialValue = 0,
  tabComponent: Tab = MaterialTab,
  visibleUntil,
  theme = "primary",
  onChange,
  maxWidth,
  ...other
}: TabsProps) => {
  const globalClasses = useGlobalTabStyles();
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: any
  ) => {
    onChange && onChange(newValue);
    setValue(newValue);
  };

  const tabs = React.Children.toArray(children).filter(
    Boolean
  ) as React.ReactElement[];

  return (
    <div
      className={classnames(
        styles["Tabs"],
        styles[`Tabs--${theme}`],
        visibleUntil && styles[`Tabs--visible-until-${visibleUntil}`],
        className
      )}
    >
      <div className={classnames(styles["TabsBar"])}>
        <Container maxWidth={maxWidth} className={globalClasses.ContainerRoot}>
          <MaterialTabs
            aria-label="tabs"
            indicatorColor="primary"
            onChange={handleChange}
            scrollButtons="on"
            TabScrollButtonProps={{ className: "tabsScrollBtn" }}
            textColor="primary"
            variant="scrollable"
            value={value}
            className={globalClasses.TabsRoot}
            {...other}
          >
            {tabs.map(({ props: { heading, index } }) => {
              const formattedIndex =
                typeof index === "string" ? index.replace(/ /g, "-") : index;
              return (
                <Tab
                  aria-controls={`tabpanel-${formattedIndex}`}
                  id={`tab-${formattedIndex}`}
                  key={formattedIndex}
                  label={transformHyphens(heading)}
                  value={index}
                  className={globalClasses.TabRoot}
                  data-testid={`tab-${formattedIndex}`}
                />
              );
            })}
          </MaterialTabs>
        </Container>
      </div>
      {tabs.map((child) => {
        const { index, ...other } = child.props;
        return React.cloneElement(child, {
          index,
          key: index,
          value,
          ...other
        });
      })}
    </div>
  );
};

Tabs.TabPanel = TabPanel;

export default Tabs;
