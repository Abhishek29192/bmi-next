import { styled } from "@mui/material";
import { Logo, Pagination, Typography } from "@bmi-digital/components";

interface StyleProps {
  pageCount: number;
}
export const StyledListWrapper = styled("div")<StyleProps>((props) => ({
  ...(props.pageCount && { height: "100%" })
}));

export const List = styled("div")(({ theme }) => ({
  position: "relative",
  height: "100%",
  maxHeight: "calc(100vh - 48px)", // Note: minus tab label height.
  overflow: "auto",
  [`${theme.breakpoints.up("lg")}`]: {
    // maxHeight: "640px",
    maxHeight: "576px",
    borderBottom: `1px solid ${theme.colours.storm}`,
    borderTop: `1px solid ${theme.colours.storm}`,
    marginBottom: "10px"
  }
}));

export const StyledPagination = styled(Pagination)({
  marginTop: "24px",
  ["> ul"]: {
    justifyContent: "center"
  }
});

export const Subtitle = styled("div")({
  marginBottom: "12px"
});

export const RoofProCertification = styled("div")({
  marginTop: "1rem"
});

export const RoofProLogo = styled(Logo)({
  height: "18px",
  verticalAlign: "middle",
  marginLeft: "5px"
});

export const NoResults = styled("div")(({ theme }) => ({
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "center",
  textAlign: "center",
  [`${theme.breakpoints.up("lg")}`]: {
    marginTop: 0
  }
}));

export const NoResultsHeading = styled(Typography)({
  marginBottom: "24px"
});
