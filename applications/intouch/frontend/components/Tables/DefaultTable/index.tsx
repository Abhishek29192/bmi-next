import { Pagination, Table } from "@bmi-digital/components";
import { useMediaQuery, useTheme } from "@material-ui/core";
import classNames from "classnames";
import React, { useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

export type DefaultTablesProps = {
  tableReference: string;
  items: Array<Record<string, any>>;
  enablePagination: boolean;
  count?: number;
};

export const DefaultTable = ({
  tableReference,
  items,
  enablePagination,
  count
}: DefaultTablesProps) => {
  const tableRef = useRef(null);
  const [tablePage, setTablePage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentTableItems = useMemo(() => {
    if (enablePagination) {
      const itemCount = (tablePage - 1) * count;
      const scrollY = tableRef.current ? tableRef.current.offsetTop - 200 : 0;
      window.scrollTo(0, scrollY);
      return items.slice(itemCount, itemCount + count);
    }
    return items;
  }, [tablePage, items]);

  const onTablePageChange = (_, page) => {
    setTablePage(page);
  };

  return (
    !!items.length && (
      <div className={styles.defaultTable} ref={tableRef}>
        {!isMobile && (
          <Table>
            <Table.Head>
              <Table.Row>
                {Object.keys(items[0]).map((field, index) => (
                  <Table.Cell
                    key={`${tableReference}-table-title-${index}`}
                    data-testid={`${tableReference}-table-title-${index}`}
                  >
                    {field}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {currentTableItems.map((item, index) => (
                <Table.Row
                  key={`${tableReference}-table-row-${index}`}
                  data-testid={`${tableReference}-table-row-${index}`}
                >
                  {Object.keys(item).map((field, key) => (
                    <Table.Cell
                      key={`${tableReference}-table-row-${index}-item-${key}`}
                      data-testid={`${tableReference}-table-row-${index}-item-${key}`}
                    >
                      {item[`${field}`]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {isMobile && (
          <div className={classNames(styles.listView)}>
            {currentTableItems.map((item, key) => (
              <div
                key={`${tableReference}-list-view-${key}`}
                className={styles.item}
                data-testid={`${tableReference}-list-view-${key}`}
              >
                {Object.keys(item).map((field, i) => (
                  <React.Fragment
                    key={`${tableReference}-list-view-${key}-item-${i}`}
                  >
                    <div className={styles.title}>{field}</div>
                    <div className={styles.description}>{item[`${field}`]}</div>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        )}
        {enablePagination && (
          <Pagination
            page={tablePage}
            onChange={onTablePageChange}
            count={Math.ceil(items.length / count)}
            style={{ marginTop: 32 }}
            className={`${styles.paginationContainer}`}
            data-testid={`default-table-pagination`}
          />
        )}
      </div>
    )
  );
};

export default DefaultTable;
