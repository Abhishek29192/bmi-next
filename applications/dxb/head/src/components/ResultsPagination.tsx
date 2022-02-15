import React from "react";
import { Pagination } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import styles from "./styles/ResultsPagination.module.scss";

export const useGlobalResPaginationStyles = makeStyles(
  () => ({
    paginationRoot: {
      "& ul": {
        justifyContent: "flex-end"
      }
    }
  }),
  { classNamePrefix: "resultsPaginationStyles" }
);

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const ResultsPagination = ({ page, count, onPageChange }: Props) => {
  const globalClasses = useGlobalResPaginationStyles();
  return (
    <div className={styles["ResultsPagination"]}>
      <Pagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={classnames(
          styles["pagination"],
          globalClasses.paginationRoot
        )}
      />
    </div>
  );
};

export default ResultsPagination;
