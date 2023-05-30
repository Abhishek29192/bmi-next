import { Button, IconButtonProps } from "@bmi-digital/components";
import { ApprovalStatus } from "@bmi/pim-types/src";
import { buttonClasses } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Icon from "../Icon";

const PREFIX = "document-simple-table-results";

export const classes = {
  actionIcon: `${PREFIX}-actionIcon`
};

export const ActionIcon = styled(Icon)(({ theme }) => ({
  "&, & path": {
    fill: theme.colours.inter
  },
  display: "block",
  width: "24px",
  height: "24px",
  "&:hover": {
    cursor: "pointer"
  }
}));

export const ExternalLinkIcon = styled(Icon)(({ theme }) => ({
  fill: theme.colours.inter,
  width: "25px",
  height: "25px"
}));

export const StyledDocumentIcon = styled(Icon)({
  width: "32px",
  height: "32px",
  minHeight: "32px",
  minWidth: "32px"
});

export const StyledButton = styled(Button)<IconButtonProps>(({ size }) => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  width: size === "large" ? "60px" : "unset !important",
  height: size === "large" ? "60px" : "unset !important",
  [`.${classes["actionIcon"]}`]: {
    height: "32px",
    width: "32px"
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

export const TitleButton = styled(Button)(({ theme }) => ({
  width: "100%",
  justifyContent: "start",
  [`&:hover p`]: {
    color: theme.colours.inter
  },
  [theme.breakpoints.down("lg")]: {
    padding: 0,
    transition: "none",
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
