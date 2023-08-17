import { Accordion } from "@bmi-digital/components";
import {
  accordionSummaryClasses,
  alpha,
  formControlLabelClasses
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DocumentTitle } from "../../../components/DocumentSimpleTableResultCommon";

const PREFIX = "DocumentTechnicalTableResults";
export const classes = {
  accordionDetails: `${PREFIX}-accordionDetails`,
  selected: `${PREFIX}-selected`
};

export const Root = styled("div")(({ theme }) => ({
  [`.${formControlLabelClasses.root}`]: {
    marginRight: 0
  },
  [`.${classes.accordionDetails}`]: {
    padding: "16px 12px 4px 16px",
    backgroundColor: theme.colours.white,
    borderTop: 0,
    borderBottom: `1px solid ${theme.colours.storm}`,
    "&:last-child": {
      borderBottom: "none"
    },
    "&:first-of-type": {
      borderTop: `1px solid ${theme.colours.storm}`,
      [theme.breakpoints.down("lg")]: {
        borderTop: 0
      }
    },
    "&:nth-of-type(2n + 1)": {
      backgroundColor: theme.colours.pearl
    }
  },
  [theme.breakpoints.down("lg")]: {
    margin: "0 -12px"
  },
  [theme.breakpoints.down("sm")]: {
    margin: "0 -8px"
  }
}));

export const AccordionItem = styled(Accordion.Item)(({ theme }) => ({
  boxShadow: "none",

  [`&.${classes.selected}`]: {
    borderColor: theme.colours.accent,
    [`.${accordionSummaryClasses.root}`]: {
      backgroundColor: alpha(theme.colours.inter, 0.04)
    }
  },

  [`&:not(.${classes.selected}) + .${classes.selected}`]: {
    borderTop: `1px solid ${theme.colours.accent}`
  },

  ["&:first-of-type"]: {
    borderTopLeftRadius: "3px",
    borderTopRightRadius: "3px"
  },

  ["&:last-of-type"]: {
    borderBottomLeftRadius: "3px",
    borderBottomRightRadius: "3px"
  },

  [theme.breakpoints.down("lg")]: {
    borderRight: 0,
    borderLeft: 0
  }
}));

export const Title = styled("span")(({ theme }) => ({
  marginLeft: "16px",
  fontFamily: "Effra Medium"
}));

export const StyledAccordionSummary = styled(Accordion.Summary)(
  ({ theme }) => ({
    lineHeight: "24px",
    fontSize: "20px",
    backgroundColor: theme.colours.white,
    padding: "9px 16px 9px 6px",
    color: theme.colours.slate,

    [`.${accordionSummaryClasses.expanded}`]: {
      color: theme.colours.inter,
      fontWeight: 500
    },

    [`.${accordionSummaryClasses.content}`]: {
      display: "flex",
      alignItems: "center",
      margin: 0
    },

    [theme.breakpoints.down("lg")]: {
      padding: "15px 16px"
    }
  })
);

export const Divider = styled("span")(({ theme }) => ({
  backgroundColor: theme.colours.storm,
  width: "1px",
  height: "30px",
  marginLeft: "6px",

  [theme.breakpoints.down("lg")]: {
    marginLeft: "16px"
  }
}));

export const ActionsContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end"
});

export const StyledDocumentTitle = styled(DocumentTitle)({
  paddingLeft: "4px",
  paddingRight: "4px"
});

export const SizeContainer = styled("div")({
  marginLeft: "40px",
  marginTop: "8px",
  display: "flex",
  padding: "3px 0",
  lineHeight: "19px"
});

export const SizeLabel = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.colours.charcoal,
  fontFamily: "Effra Medium",
  marginRight: "6px",
  fontSize: "16px"
}));

export const SizeValue = styled("span")(({ theme }) => ({
  color: theme.colours.slate,
  fontSize: "16px"
}));
