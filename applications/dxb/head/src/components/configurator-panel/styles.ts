import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses
} from "@mui/material";

const PREFIX = "configuratorPanelStyles";
export const classes = {
  selectedTitle: `${PREFIX}-selectedTitle`,
  title: `${PREFIX}-title`,
  summary: `${PREFIX}-summary`
};

export const Root = styled("div")(({ theme }) => ({
  "& + &": {
    marginTop: "16px"
  }
}));

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.colours.alabaster,
  [`&.Mui-disabled`]: {
    backgroundColor: theme.colours.alabaster
  }
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  paddingLeft: "32px",
  paddingRight: "42px",
  color: theme.colours.slate,
  opacity: 1,
  "&:hover": {
    color: theme.colours.charcoal,
    [`& .${classes.title}`]: {
      [`& > .${classes.selectedTitle}`]: {
        color: theme.colours.focus
      }
    }
  },
  [`& .${classes.title}`]: {
    [`& > .${classes.selectedTitle}`]: {
      color: theme.colours.inter,
      [theme.breakpoints!.up!("sm")]: {
        fontSize: "1.6875rem"
      }
    }
  },
  [`&.Mui-disabled`]: {
    opacity: 1,
    [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
      display: "none"
    }
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginTop: "32px",
    marginBottom: "32px"
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}`]: {
    fontSize: "1.33rem"
  }
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: theme.colours.alabaster,
  padding: "0 32px 32px",
  flexFlow: "column"
}));

export const Content = styled("div")({
  marginBottom: "20px"
});
