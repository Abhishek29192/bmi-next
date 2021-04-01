import React, { createContext, useContext } from "react";

const MicroCopyContext = createContext<Record<string, string>>({});

type Props = {
  path: string;
  placeholders?: Record<string, string>;
};

// Some PIM fitlers have labels which are already translated, if this is the case
// we can identify these and just display the text instead.
function tidyPimFilterLabels(value) {
  return value.replace("MC: pim.", "");
}

const MicroCopy = ({ path, placeholders = {} }: Props) => {
  const values = useContext(MicroCopyContext);
  let value: string = Object.entries(placeholders).reduce(
    (carry, [key, value]) => {
      return carry.replaceAll(`{{${key}}}`, value);
    },
    // values can be undefined, which reaults in app breaking
    // when this happens, we should still display the MC path instead of breaking
    values ? values[path] || `MC: ${path}` : `MC: ${path}`
  );

  return <>{tidyPimFilterLabels(value)}</>;
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
