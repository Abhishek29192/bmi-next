import React from "react";
import extractDefinitions from "../extractDefinitions";
import toArray from "../utils/toArray";

type TableProps = {
  children: React.ReactNode;
  headerRows?: number;
  widths?: Array<string | number>;
  layout?: object | string;
  [rest: string]: any;
};

const Table = ({ children, headerRows, widths, ...rest }: TableProps): any => {
  return {
    table: {
      headerRows,
      widths,
      body: toArray(extractDefinitions(children))
    },
    ...rest
  };
};

Table.Row = ({ children }): any => toArray(extractDefinitions(children));

export default Table;
