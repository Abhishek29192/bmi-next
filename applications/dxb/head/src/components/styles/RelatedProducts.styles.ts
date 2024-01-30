import AnchorLink from "@bmi-digital/components/anchor-link";
import { styled } from "@mui/material/styles";

export const StyledLoadMoreWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "32px"
}));

export const StyledReadMoreAnchor = styled(AnchorLink)(({ theme }) => ({
  marginTop: "12px"
}));
