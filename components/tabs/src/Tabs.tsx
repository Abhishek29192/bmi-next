import {
  AppBarProps,
  Box,
  Tab as DefaultTab,
  Tabs as MaterialTabs,
  TabsProps as MaterialTabsProps
} from "@material-ui/core";
import Container, { Props as ContainerProps } from "@bmi/container";
import Grid, { GridProps } from "@bmi/grid";
import classnames from "classnames";
import React from "react";
import styles from "./Tabs.module.scss";

type TabPanelProps = GridProps & {
  className?: string;
  children?: React.ReactNode;
  heading: String;
  index: any;
  value?: any;
};

const TabPanel = ({
  children,
  className,
  value,
  index,
  ...other
}: TabPanelProps) => (
  <Grid
    item
    className={classnames(styles["TabPanel"], className)}
    aria-labelledby={`tab-${index}`}
    hidden={value !== index}
    id={`tabpanel-${index}`}
    role="tabpanel"
    {...other}
  >
    <Box className={styles["TabPanelBox"]} p={3}>
      {children}
    </Box>
  </Grid>
);

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

const Tabs = ({
  children,
  className,
  initialValue = 0,
  tabComponent: Tab = DefaultTab,
  visibleUntil,
  theme = "primary",
  onChange,
  maxWidth,
  ...other
}: TabsProps) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) => {
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
      <div className={styles["TabsBar"]}>
        <Container maxWidth={maxWidth}>
          <MaterialTabs
            aria-label="tabs"
            indicatorColor="primary"
            onChange={handleChange}
            scrollButtons="auto"
            textColor="primary"
            variant="scrollable"
            value={value}
            {...other}
          >
            {tabs.map(({ props: { heading, index } }) => (
              <Tab
                aria-controls={`tabpanel-${index}`}
                id={`tab-${index}`}
                key={index}
                label={heading}
                value={index}
              />
            ))}
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
