import React from "react";
import * as ReactIs from "react-is";
import extractDefinitions from "./extractDefinitions";
import { PDFNode, ReturnedPageSize } from "./types";

type Props = {
  currentPage: number;
  pageCount?: number;
  pageSize: ReturnedPageSize;
};

const extendIfElement = (
  element: React.ReactNode | PDFNode,
  props: Props,
  ...children: React.ReactNode[]
) => {
  if (ReactIs.isElement(element)) {
    return React.cloneElement(element, props, ...children);
  }
  return element;
};

const extractExtended = (
  element: React.ReactNode | PDFNode,
  props: Props,
  ...children: React.ReactNode[]
) => extractDefinitions(extendIfElement(element, props, ...children));

export default extractExtended;
