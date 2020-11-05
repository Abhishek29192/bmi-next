import { graphql } from "gatsby";

export type Data = {
  key: string;
  value: string;
};

export type GetMicroCopy = (path: string) => string;

export const fallbackGetMicroCopy: GetMicroCopy = (path) => `MC: ${path}`;

export const generateGetMicroCopy = (microCopy?: Data[]) => {
  if (!microCopy) {
    return fallbackGetMicroCopy;
  }

  const getMicroCopy: GetMicroCopy = (path) => microCopy[path] || `MC: ${path}`;

  return getMicroCopy;
};

export const query = graphql`
  fragment MicroCopyFragment on ContentfulMicroCopy {
    key
    value
  }
`;
