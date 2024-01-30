import LeadBlock from "@bmi-digital/components/lead-block";
import { styled } from "@mui/material/styles";

const PREFIX = "SystemDetailsLeadDocumentsBlockSectionStyles";

export const classes = {
  tableContainer: `${PREFIX}-tableContainer`
};

export const StyledDocumentLeadBlock = styled(LeadBlock.Card.Section)(
  ({ theme }) => ({
    padding: "30px 24px",
    [theme.breakpoints.down("lg")]: {
      padding: "30px 0",
      "& > div": {
        marginTop: "0"
      }
    },
    [theme.breakpoints.down("sm")]: {
      margin: "0 -8px"
    },
    [`.${classes.tableContainer}`]: {
      ":global": {
        [theme.breakpoints.up("xl")]: {
          border: `1px solid ${theme.colours.storm}`,
          borderRadius: "3px 3px 0 0",
          overflow: "hidden",
          "[class*='MuiTableRow-root']": {
            borderColor: "transparent"
          },
          "[class*='MuiTableRow-head']": {
            borderColor: "transparent"
          },

          "[class*='MuiTableCell-root']": {
            color: theme.colours.slate
          }
        }
      }
    }
  })
);
