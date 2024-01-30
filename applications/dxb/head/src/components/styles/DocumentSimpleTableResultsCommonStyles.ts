import Button, { IconButtonProps } from "@bmi-digital/components/button";
import { ApprovalStatus } from "@bmi/pim-types";
import { buttonClasses } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Icon from "../Icon";

const PREFIX = "document-simple-table-results";

export const classes = {
  actionIconSmall: `${PREFIX}-actionIconSmall`,
  disableRipple: `${PREFIX}-disableRipple`
};

export const StyledIcon = styled(Icon)({
  width: "32px",
  height: "32px",
  minHeight: "32px",
  minWidth: "32px"
});

export const ActionIcon = styled(StyledIcon)(({ theme }) => ({
  "&, & path": {
    fill: theme.colours.inter
  },
  "&:hover": {
    cursor: "pointer"
  }
}));

export const ExternalLinkIcon = styled(StyledIcon)(({ theme }) => ({
  fill: theme.colours.inter,
  boxSizing: "content-box"
}));

export const StyledButton = styled(Button)<IconButtonProps>(({ size }) => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  width: size === "large" ? "60px" : "unset !important",
  height: size === "large" ? "60px" : "unset !important",
  [`.${classes["actionIconSmall"]}`]: {
    width: "24px",
    height: "24px",
    minHeight: "24px",
    minWidth: "24px"
  }
}));

export const Title = styled("p")(({ theme }) => ({
  color: theme.colours.slate,
  WebkitLineClamp: "3",
  WebkitBoxOrient: "vertical",
  display: "-webkit-box",
  margin: 0,
  overflow: "hidden"
}));

export const TooltipPopper = styled("div")(({ theme }) => ({
  color: theme.colours.white,
  marginRight: "8px",
  backgroundColor: theme.colours.slate,
  borderRadius: "4px",
  padding: "5px 10px",
  maxWidth: "300px",
  fontSize: "12px",
  lineHeight: "17px",
  fontWeight: 500
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
