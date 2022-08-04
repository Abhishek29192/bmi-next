import { graphql } from "gatsby";
import { MicroCopyValues } from "../constants/microCopies";

export type Data = {
  key: string;
  value: string;
};

export type GetMicroCopy = (
  path: MicroCopyValues,
  variables?: Record<string, string>
) => string;

export const fallbackGetMicroCopy: GetMicroCopy = (path) => `MC: ${path}`;

export const generateGetMicroCopy = (microCopy?: Data[]) => {
  if (!microCopy) {
    return fallbackGetMicroCopy;
  }

  const replaceVariables: GetMicroCopy = (copy = "", variables = {}) =>
    Object.entries(variables).reduce(
      (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
      copy
    );

  const getMicroCopy: GetMicroCopy = (path, variables) => {
    const copy = microCopy.find(({ key }) => key === path)?.value;
    return (
      replaceVariables(copy as MicroCopyValues, variables) || `MC: ${path}`
    );
  };

  return getMicroCopy;
};

export const query = graphql`
  fragment MicroCopyFragment on ContentfulMicroCopy {
    key
    value
  }
`;
