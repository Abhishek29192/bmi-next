import { Accordion, Table } from "@bmi-digital/components";
import {
  accordionClasses,
  accordionSummaryClasses,
  formControlLabelClasses
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DocumentTitle } from "../../../components/DocumentSimpleTableResultCommon";

const PREFIX = "DocumentTechnicalTableResults";
export const classes = {
  accordionDetails: `${PREFIX}-accordionDetails`
};

export const Root = styled("div")(({ theme }) => ({
  [`.${formControlLabelClasses.root}`]: {
    marginRight: 0
  },
  [`.${accordionClasses.root}`]: {
    borderRadius: 0,
    boxShadow: "none",
    "&::before": {
      display: "none"
    },
    [theme.breakpoints.down("lg")]: {
      borderRight: 0,
      borderLeft: 0
    }
  },
  [`.${classes.accordionDetails}`]: {
    padding: "16px 12px 4px 16px",
    backgroundColor: theme.colours.white,
    borderTop: 0,
    borderBottom: `1px solid ${theme.colours.storm}`,
    "&:last-child": {
      borderBottom: "none"
    },
    "&:first-child": {
      borderTop: `1px solid ${theme.colours.storm}`,
      [theme.breakpoints.down("lg")]: {
        borderTop: 0
      }
    },
    "&:nth-child(2n + 1)": {
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

export const Title = styled(Table.Cell)({
  WebkitLineClamp: "3",
  WebkitBoxOrient: "vertical",
  display: "-webkit-box",
  margin: 0,
  overflow: "hidden"
});

export const StyledAccordionSummary = styled(Accordion.Summary)(
  ({ theme }) => ({
    backgroundColor: theme.colours.white,
    fontSize: "20px",
    lineHeight: 1.25,
    fontFamily: "Effra Medium",
    color: theme.colours.slate,

    [`.${accordionSummaryClasses.expanded}`]: {
      color: theme.colours.inter,
      fontWeight: 500
    }
  })
);

export const StyledDocumentTitle = styled(DocumentTitle)({
  paddingLeft: "4px",
  paddingRight: "4px"
});

export const ActionsContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end"
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
