import { AppBarProps } from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import DefaultTab from "@material-ui/core/Tab";
import MaterialTabs, {
  TabsProps as MaterialTabsProps
} from "@material-ui/core/Tabs";
import Container, {
  Props as ContainerProps
} from "@bmi-digital/components/container";
import Grid, { GridProps } from "@bmi-digital/components/grid";
import classnames from "classnames";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./Tabs.module.scss";

export const useGlobalTabStyles = makeStyles(
  () => ({
    ContainerRoot: {
      fontSize: "1rem",
      paddingLeft: "0px",
      paddingRight: "0px"
    },
    TabsRoot: {
      fontSize: "1rem",
      marginBottom: "2px"
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
            scrollButtons="auto"
            textColor="primary"
            variant="scrollable"
            value={value}
            className={globalClasses.TabsRoot}
            {...other}
          >
            {tabs.map(({ props: { heading, index } }) => (
              <Tab
                aria-controls={`tabpanel-${index}`}
                id={`tab-${index}`}
                key={index}
                label={heading}
                value={index}
                className={globalClasses.TabRoot}
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
