import React, { createContext, useContext } from "react";

const MicroCopyContext = createContext<Record<string, string>>({});

type Props = {
  path: string;
  placeholders?: Record<string, string>;
};

const MicroCopy = ({ path, placeholders = {} }: Props) => {
  const values = useContext(MicroCopyContext);
  const value: string = Object.entries(placeholders).reduce(
    (carry, [key, value]) => {
      return carry.replaceAll(`{{${key}}}`, value);
    },
    values[path] || `MC: ${path}`
  );

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
