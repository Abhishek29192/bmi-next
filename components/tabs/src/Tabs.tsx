import {
  AppBarProps,
  Box,
  Tab,
  Tabs as MaterialTabs,
  TabsProps as MaterialTabsProps
} from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import styles from "./Tabs.module.scss";

type TabPanelProps = {
  children?: React.ReactNode;
  heading: String;
  index: any;
  value?: any;
};

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    aria-labelledby={`tab-${index}`}
    hidden={value !== index}
    id={`tabpanel-${index}`}
    role="tabpanel"
    {...other}
  >
    {value === index && (
      <Box className={styles["TabPanelBox"]} p={3}>
        {children}
      </Box>
    )}
  </div>
);

type TabsProps = MaterialTabsProps &
  Pick<AppBarProps, "color"> & {
    children: React.ReactElement[];
    initialValue?: any;
    theme?: "primary" | "secondary";
    // NOTE: This is necessary until we upgrade to @material-ui/core@^5.0.0
    // see: https://github.com/mui-org/material-ui/issues/22452#issuecomment-685756045
    component?: React.ElementType;
  };

const Tabs = ({
  children,
  initialValue = 0,
  theme = "primary",
  ...other
}: TabsProps) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) =>
    setValue(newValue);

  return (
    <div className={classnames(styles.Tabs, styles[`Tabs--${theme}`])}>
      <div className={styles.TabsBar}>
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
          {children.map(({ props: { heading, index } }) => (
            <Tab
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
              key={index}
              label={heading}
              value={index}
            />
          ))}
        </MaterialTabs>
      </div>
      {children.map((child) => {
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
