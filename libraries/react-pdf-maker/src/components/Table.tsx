import React from "react";
import extractDefinitions from "../extractDefinitions";
import toArray from "../utils/toArray";
import { ComponentProps } from "../types";

type TableProps = ComponentProps & {
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

Table.Row = ({ children }: { children: React.ReactNode }): any =>
  toArray(extractDefinitions(children));

export default Table;
