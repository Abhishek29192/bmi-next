import { Section, tabsClasses } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";

export const PREFIX = "TeamSection";

export const classes = {
  white: `${PREFIX}-white`,
  alabaster: `${PREFIX}-alabaster`,
  tabs: `${PREFIX}-tabs`,
  tabPanel: `${PREFIX}-tabPanel`
};

export const StyledSection = styled(Section)(({ theme }) => ({
  [`&.${classes.white}`]: {
    backgroundColor: theme.colours.white,
    [`.${classes.tabs} > .${tabsClasses.tabsBar}`]: {
      backgroundColor: theme.colours.alabaster
    },
    [`.${classes.tabPanel} > div`]: {
      backgroundColor: theme.colours.white
    }
  },
  [`&.${classes.alabaster}`]: {
    backgroundColor: theme.colours.alabaster,
    [`.${classes.tabs} > .${tabsClasses.tabsBar}`]: {
      backgroundColor: theme.colours.white
    },
    [`.${classes.tabPanel} > div`]: {
      backgroundColor: theme.colours.alabaster
    }
  }
}));

export const Title = styled(Section.Title)(({ theme }) => ({
  marginBottom: 30
}));
