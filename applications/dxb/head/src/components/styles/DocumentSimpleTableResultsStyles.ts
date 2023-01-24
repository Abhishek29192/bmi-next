import { Icon, Table } from "@bmi-digital/components";
import { alpha, formControlLabelClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "documentSimpleTableResultsStyles";
export const classes = {
  tableHeader: `${PREFIX}-tableHeader`,
  checked: `${PREFIX}-checked`
};

export const StyledSimpleTableResults = styled("div")(({ theme }) => ({
  [`& .${classes.tableHeader}`]: {
    width: "92px",
    whiteSpace: "nowrap"
  },
  [`& .${formControlLabelClasses.root}`]: {
    marginRight: 0
  },
  "abbr[title]::after": {
    content: "''",
    [theme.breakpoints!.up!("lg")]: {
      content: "''"
    }
  }
}));

export const DocumentRow = styled(Table.Row)(({ theme }) => ({
  [`&.${classes.checked}`]: {
    "&:first-of-type": {
      boxShadow: `inset 0px 0px 0px ${theme.colours.accent}`
    },
    "& .Mui-selected": {
      // Hack for position relative for tr
      // See https://github.com/w3c/csswg-drafts/issues/1899
      transform: "scale(1)",
      // Replace with `alpha` when converting to material ui
      backgroundColor: `${alpha(theme.colours.accent, 0.1)}`,
      border: `1.2px solid ${theme.colours.accent}`
    }
  }
}));

export const StyledTableCell = styled(Table.Cell)({
  verticalAlign: "middle !important",
  whiteSpace: "nowrap"
});

export const ExternalLinkIcon = styled(Icon)(({ theme }) => ({
  fill: theme.colours.inter,
  width: "24px",
  height: "24px"
}));

export const DownloadIcon = styled(Icon)({
  width: "32px",
  height: "32px"
});

export const NoDocumentIcon = styled("span")(({ theme }) => ({
  width: "16px",
  height: "16px",
  color: theme.colours.charcoal,
  opacity: 0.24
}));
