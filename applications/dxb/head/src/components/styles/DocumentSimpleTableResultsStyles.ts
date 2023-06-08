import { Table } from "@bmi-digital/components";
import { ApprovalStatus } from "@bmi/pim-types";
import { alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "documentSimpleTableResultsStyles";
export const classes = {
  tableHeader: `${PREFIX}-tableHeader`,
  tableHeaderCentered: `${PREFIX}-tableHeaderCentered`,
  checked: `${PREFIX}-checked`
};

export const StyledSimpleTableResults = styled("div")(({ theme }) => ({
  [`& .${classes.tableHeader}`]: {
    width: "92px",
    whiteSpace: "nowrap"
  },
  [`& .${classes.tableHeaderCentered}`]: {
    textAlign: "center",
    label: {
      margin: 0
    }
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

export const StyledTableCell = styled(Table.Cell)(({ theme }) => ({
  verticalAlign: "middle !important",
  whiteSpace: "nowrap",
  color: theme.colours.slate
}));

export const StyledTitleTableCell = styled(Table.Cell)({
  verticalAlign: "middle !important"
});

export const ActionsContainer = styled("div")({
  display: "flex",
  width: "64px",
  justifyContent: "space-between"
});

export const DocumentStatus = styled("p")<{ status: ApprovalStatus }>(
  ({ theme, status }) => ({
    margin: 0,
    color: status === "approved" ? theme.colours.success : theme.colours.blue300
  })
);
