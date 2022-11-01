import useDimensions from "@bmi-digital/use-dimensions";
import {
  Table as MuiTable,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableHead as MuiTableHead,
  TableHeadProps,
  TableProps as MuiTableProps,
  TableRow,
  TableRowProps
} from "@material-ui/core";
import classnames from "classnames";
import React, {
  createContext,
  Fragment,
  isValidElement,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import { useStyles } from "./styles";

const TableContext = createContext<{
  theme?: Colors;
}>({});

export type TableProps = {
  theme?: Colors;
  hasNoBorder?: boolean;
  rowBgColorPattern?: "even" | "odd" | "none";
} & MuiTableProps;

function parseTable(children: React.ReactNode): {
  headerRow: React.ReactNode[];
  bodyRows: React.ReactNode[][];
} {
  const childElements = React.Children.toArray(children).filter(isValidElement);

  const header = childElements.find((child) => child.type === TableHead);
  let headerRow: React.ReactNode[] = [];

  if (header) {
    const row = React.Children.only((header.props as TableHeadProps).children);
    headerRow = React.Children.toArray(
      (
        row as
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactPortal
      ).props.children
    )
      .filter(isValidElement)
      .map((child) => (child.props as TableCellProps).children);
  }

  const body = childElements.find((child) => child.type === TableBody);

  const rows =
    (body &&
      React.Children.toArray((body.props as TableBodyProps).children).filter(
        isValidElement
      )) ||
    [];

  const bodyRows = rows.map((row) =>
    React.Children.toArray((row.props as TableRowProps).children)
      .filter(isValidElement)
      .map((tableCell) => (tableCell.props as TableCellProps).children)
  );

  return { headerRow, bodyRows };
}

const TableHead = (props: { children: React.ReactNode } & TableHeadProps) => {
  const { theme } = useContext(TableContext);
  return <ColorPair theme={theme} markupComponent={MuiTableHead} {...props} />;
};

const Table = ({
  theme = "pearl",
  hasNoBorder,
  rowBgColorPattern,
  ...rest
}: TableProps) => {
  const [containerRef, containerDimensions] = useDimensions();
  const [normalTableRef, normalTableDimensions] = useDimensions();
  const [mediumTableRef, mediumTableDimensions] = useDimensions();
  const [tableSize, setTableSize] = useState<"normal" | "medium" | "small">(
    "normal"
  );

  const classes = useStyles();

  const header = useMemo(
    () =>
      React.Children.toArray(rest.children)
        .filter(isValidElement)
        .find((child) => child.type === TableHead),
    [rest.children]
  );

  useEffect(() => {
    if (!("width" in containerDimensions)) {
      return;
    }

    setTableSize("normal");

    if (
      "width" in normalTableDimensions &&
      containerDimensions.width &&
      normalTableDimensions.width &&
      containerDimensions.width < normalTableDimensions.width
    ) {
      if (!header) {
        setTableSize("small");
        return;
      }
      setTableSize("medium");
    }

    if (
      "width" in mediumTableDimensions &&
      containerDimensions.width &&
      mediumTableDimensions.width &&
      containerDimensions.width < mediumTableDimensions.width
    ) {
      setTableSize("small");
    }
  }, [containerDimensions, normalTableDimensions, mediumTableDimensions]);

  const _rowBgColorPattern = rowBgColorPattern || (header ? "even" : "odd");

  return (
    <TableContext.Provider value={{ theme: theme }}>
      <div ref={containerRef}>
        {tableSize === "normal" && (
          <MuiTable
            ref={normalTableRef}
            className={classnames(
              classes.root,
              _rowBgColorPattern !== "none" &&
                classes[`${_rowBgColorPattern}Color`],
              _rowBgColorPattern === "none" && classes.rowNoColor,
              hasNoBorder && classes.noBorder
            )}
            {...rest}
          />
        )}

        {tableSize === "medium" && (
          <MediumTable
            ref={mediumTableRef}
            theme={theme}
            hasNoBorder={hasNoBorder}
            {...rest}
          />
        )}

        {tableSize === "small" && (
          <SmallTable
            hasNoBorder={hasNoBorder}
            rowBgColorPattern={_rowBgColorPattern}
            {...rest}
          />
        )}
      </div>
    </TableContext.Provider>
  );
};

const MediumTable = React.forwardRef<HTMLTableElement, TableProps>(
  function MediumTable(
    { hasNoBorder, children, theme, ...rest }: TableProps,
    ref:
      | ((instance: HTMLTableElement | null) => void)
      | MutableRefObject<HTMLTableElement | null>
      | null
  ) {
    const { headerRow, bodyRows } = useMemo(
      () => parseTable(children),
      [children]
    );
    const classes = useStyles();

    return (
      <MuiTable
        ref={ref}
        className={classnames(classes.root, hasNoBorder && classes.noBorder)}
        {...rest}
      >
        <TableBody>
          {bodyRows.map((row, key) =>
            row.map((cell, i) => (
              <TableRow
                key={`${key}_${i}`}
                className={classnames(
                  i === row.length - 1 && classes.separator
                )}
              >
                <ColorPair theme={theme} markupComponent={TableCell}>
                  {/* eslint-disable-next-line security/detect-object-injection */}
                  {headerRow[i]}
                </ColorPair>
                <TableCell>{cell}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    );
  }
);

const SmallTable = ({
  hasNoBorder,
  children,
  rowBgColorPattern
}: TableProps) => {
  const { headerRow, bodyRows } = useMemo(
    () => parseTable(children),
    [children]
  );
  const classes = useStyles();

  const ListComponent = headerRow.length ? "dl" : "ul";
  const ItemComponent = headerRow.length ? "dd" : "li";

  return (
    <div
      className={classnames(
        classes.smallTable,
        rowBgColorPattern &&
          rowBgColorPattern !== "none" &&
          classes[`item${rowBgColorPattern}Color`],
        hasNoBorder && classes.noBorder
      )}
    >
      {bodyRows.map((row, key) => (
        <ListComponent key={key} className={classes.item}>
          {row.map((cell, i) => (
            <Fragment key={`${key}_${i}`}>
              {headerRow.length ? (
                // eslint-disable-next-line security/detect-object-injection
                <dt className={classes.title}>{headerRow[i]}</dt>
              ) : null}
              <ItemComponent className={classes.description}>
                {cell}
              </ItemComponent>
            </Fragment>
          ))}
        </ListComponent>
      ))}
    </div>
  );
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
