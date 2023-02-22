import { Pagination } from "@bmi-digital/components";
import { styled } from "@mui/material/styles";
import classnames from "classnames";
import React from "react";
import styles from "./styles/ResultsPagination.module.scss";

const PREFIX = "resultsPaginationStyles";
const classes = {
  paginationRoot: `${PREFIX}-paginationRoot`
};

const StyledPagination = styled(Pagination)(({ theme }) => ({
  [`&.${classes.paginationRoot}`]: {
    "& ul": {
      justifyContent: "flex-end"
    }
  }
}));

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const ResultsPagination = ({ page, count, onPageChange }: Props) => {
  // const globalClasses = useGlobalResPaginationStyles();
  return (
    <div className={styles["ResultsPagination"]}>
      <StyledPagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={classnames(styles["pagination"], classes.paginationRoot)}
      />
    </div>
  );
};

export default ResultsPagination;
