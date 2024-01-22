import { styled } from "@mui/material/styles";

const PREFIX = "ToolCard";

export const classes = {
  box: `${PREFIX}-box`
};

export const ToolCardsBox = styled("div")(({ theme }) => ({
  [`.${classes.box}`]: {
    justifyContent: "flex-start",
    marginTop: "24px",
    marginBottom: 0,
    fill: theme.colours.cyan400
  }
}));

export const HelloText = styled("span")(() => ({
  textOverflow: "ellipsis",
  width: "100%",
  overflow: "hidden"
}));
