import { styled } from "@mui/material/styles";

export const Actions = styled("div")({
  alignItems: "center",
  display: "flex",
  justifyContent: "flex-end"
});

export const Divider = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.storm,
  height: "32px",
  width: "1px"
}));
