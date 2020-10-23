import extractDefinitions from "../extractDefinitions";
import extractExtended from "../extractExtended";
import { PDFNode, PageSizeStringOptions } from "../types";

export type DocumentProps = {
  header?: React.ReactNode | PDFNode;
  footer?: React.ReactNode | PDFNode;
  background?: React.ReactNode | PDFNode;
  children?: React.ReactNode;
  pageBreakBefore?: (
    currentNode: any,
    followingNodesOnPage: any[],
    nodesOnNextPage: any[],
    previousNodesOnPage: any[]
  ) => boolean | undefined;
  pageOrientation?: "portrait" | "landscape";
  // TODO: confirm are width/height optional?
  pageSize?:
    | PageSizeStringOptions
    | { width: number | "auto"; height: number | "auto" };
  pageMargins?: number | [number, number] | [number, number, number, number];
  info?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modDate?: string;
    trapped?: string;
    [customKey: string]: any;
  };
  images: {
    [name: string]: string;
  };
  defaultStyle: {
    [name: string]: any;
  };
};

type ReturnedPageSize = {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};

const Document = ({
  header,
  footer,
  background,
  children,
  ...rest
}: DocumentProps): any => {
  const getHeader = (
    currentPage: number,
    pageCount: number,
    pageSize: ReturnedPageSize
  ) => extractExtended(header, { currentPage, pageCount, pageSize });

  const getFooter = (
    currentPage: number,
    pageCount: number,
    pageSize: ReturnedPageSize
  ) => extractExtended(footer, { currentPage, pageCount, pageSize });

  const getBackground = (currentPage: number, pageSize: ReturnedPageSize) =>
    extractExtended(background, { currentPage, pageSize });

  return {
    content: extractDefinitions(children),
    ...(header ? { header: getHeader } : {}),
    ...(footer ? { footer: getFooter } : {}),
    ...(background ? { background: getBackground } : {}),
    ...rest
  };
};

export default Document;
