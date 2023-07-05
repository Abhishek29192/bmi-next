import { styled } from "@mui/material/styles";
import BrandLogo from "../BrandLogo";

export const StyledContentArea = styled("div")(({ theme }) => ({
  maxHeight: "400px"
}));

export const StyledBrandLogo = styled(BrandLogo)(({ theme }) => ({
  marginBottom: "16px",
  marginRight: "16px"
}));
