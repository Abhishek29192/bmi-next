import classnames from "classnames";
import React from "react";
import {
  StyledPagination,
  StyledPaginationWrapper,
  classes
} from "./styles/ResultsPagination.styles";

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const ResultsPagination = ({ page, count, onPageChange }: Props) => {
  // const globalClasses = useGlobalResPaginationStyles();
  return count > 1 ? (
    <StyledPaginationWrapper>
      <StyledPagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={classnames(classes["pagination"], classes.paginationRoot)}
      />
    </StyledPaginationWrapper>
  ) : null;
};

export default ResultsPagination;
