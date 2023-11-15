import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Icon from "../../../../components/Icon";

export const Anchor = styled("a")({
  alignItems: "center",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center"
});

export const Root = styled("ul")({
  alignItems: "start",
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0
});

export const Item = styled("li")({
  marginRight: "11px",
  "&:last-child": {
    marginRight: 0
  }
});

export const StyledIcon = styled(Icon)(({ theme }) => ({
  fill: theme.colours.cyan500,
  height: "22px",
  width: "22px"
}));

export const StyledLink = styled(Link)({
  alignItems: "center",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center"
});
