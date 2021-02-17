import React from "react";
import Pagination from "@bmi/pagination";
import styles from "./styles/ResultsPagination.module.scss";

type Props = {
  page: number;
  count: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const ResultsPagination = ({ page, count, onPageChange }: Props) => {
  return (
    <div className={styles["ResultsPagination"]}>
      <Pagination
        page={page}
        onChange={onPageChange}
        count={count}
        className={styles["pagination"]}
      />
    </div>
  );
};

export default ResultsPagination;
