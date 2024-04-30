import Button from "@bmi-digital/components/button";
import { buttonClasses } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import type { ApprovalStatus } from "@bmi/pim-types";
import Icon from "../Icon";

const PREFIX = "document-simple-table-results";

export const classes = {
  disableRipple: `${PREFIX}-disableRipple`
};

export const StyledIcon = styled(Icon)({
  width: "32px",
  height: "32px",
  minHeight: "32px",
  minWidth: "32px"
});

export const ExternalLinkIcon = styled(StyledIcon)(({ theme }) => ({
  fill: theme.colours.inter,
  boxSizing: "content-box"
}));

export const Title = styled("p")(({ theme }) => ({
  color: theme.colours.slate,
  WebkitLineClamp: "3",
  WebkitBoxOrient: "vertical",
  display: "-webkit-box",
  margin: 0,
  overflow: "hidden"
}));

export const TitleButton = styled(Button)(({ theme }) => ({
  width: "100%",
  justifyContent: "start",
  [`&:hover p`]: {
    color: theme.colours.inter
  },
  [`&.${classes.disableRipple}`]: {
    transition: "none",
    padding: 0,
    width: "max-content",
    [`.${buttonClasses.startIcon}`]: {
      marginLeft: 0
    },
    "&&:hover": {
      backgroundColor: "unset",
      "& p": {
        color: theme.colours.slate
      }
    }
  }
}));

export const DocumentStatus = styled("span")<{ status: ApprovalStatus }>(
  ({ theme, status }) => ({
    fontWeight: 400,
    fontFamily: "Effra Medium",
    color: status === "approved" ? theme.colours.success : theme.colours.blue300
  })
);
