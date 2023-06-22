import { styled } from "@mui/material/styles";
import { AnchorLink } from "@bmi-digital/components";

export const StyledLoadMoreWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "32px"
}));

export const StyledReadMoreAnchor = styled(AnchorLink)(({ theme }) => ({
  marginTop: "12px"
}));
