import React, { createContext, useContext } from "react";
import escapeStringRegexp from "escape-string-regexp";

export const MicroCopyContext = createContext<Record<string, string>>({});

export const getMicroCopy = (
  values: Record<string, string> = {},
  path: string,
  placeholders: Record<string, string> = {},
  prefixMC: boolean = false
): string =>
  Object.entries(placeholders).reduce((carry, [key, value]) => {
    const toReplace = `{{${key}}}`;
    return carry.replace(new RegExp(escapeStringRegexp(toReplace), "g"), value);
  }, values[path] || (prefixMC ? `MC:${path}` : path));

type Props = {
  path: string;
  placeholders?: Record<string, string>;
};

const MicroCopy = ({ path, placeholders = {} }: Props) => {
  const values = useContext(MicroCopyContext);
  const value: string = getMicroCopy(values, path, placeholders);

  return <>{value}</>;
};

type ProviderProps = {
  values: Record<string, string>;
  children: React.ReactNode;
};

const MicroCopyProvider = ({ values, children }: ProviderProps) => {
  return (
    <MicroCopyContext.Provider value={values}>
      {children}
    </MicroCopyContext.Provider>
  );
};

MicroCopy.Provider = MicroCopyProvider;

export default MicroCopy;
