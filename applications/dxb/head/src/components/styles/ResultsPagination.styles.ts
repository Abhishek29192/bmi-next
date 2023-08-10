import { styled } from "@mui/material/styles";
import { Pagination } from "@bmi-digital/components";

const PREFIX = "resultsPaginationStyles";
export const classes = {
  paginationRoot: `${PREFIX}-paginationRoot`,
  pagination: `${PREFIX}-pagination`
};

export const StyledPaginationWrapper = styled("div")(({ theme }) => ({
  textAlign: "right",
  fontSize: "1rem",
  marginTop: "48px",
  marginBottom: "48px",
  [`.${classes["pagination"]}`]: {
    margin: "32px 0"
  }
}));

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  [`&.${classes.paginationRoot}`]: {
    "& ul": {
      justifyContent: "flex-end"
    }
  }
}));
