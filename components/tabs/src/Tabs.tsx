import {
  AppBar,
  AppBarProps,
  Box,
  Tab,
  Tabs as MaterialTabs,
  TabsProps as MaterialTabsProps
} from "@material-ui/core";
import React from "react";

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
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

type TabsProps = MaterialTabsProps &
  Pick<AppBarProps, "color"> & {
    children: React.ReactElement[];
    initialValue?: any;
  };

const Tabs = ({
  children,
  color = "transparent",
  initialValue = 0,
  ...other
}: TabsProps) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) =>
    setValue(newValue);

  return (
    <div>
      <AppBar position="static" color={color}>
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
      </AppBar>
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
