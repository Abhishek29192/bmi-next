import { ClickableAction } from "@bmi/clickable";
import { ButtonBaseActions } from "@material-ui/core";
import React, { createContext, useContext } from "react";

type Props = {
  action?: (ClickableAction | Omit<ButtonBaseActions, "focusVisible">) & {
    "data-gtm"?: string;
  };
  children?: React.ReactNode;
  gtm?: {
    id: string;
    event?: string;
    label?: string;
    action?: string;
  };
};

type Map = Partial<Record<keyof Props["gtm"], string>>;

declare let window: Window & {
  dataLayer: { push: (data: Props["gtm"]) => {} };
};

type Context = {
  idMap: Record<string, string>;
};

export const GTMContext = createContext<Context>({ idMap: {} });

export function pushToDataLayer(dataGtm: Props["gtm"]) {
  window.dataLayer &&
    window.dataLayer.push({ ...dataGtm, event: dataGtm.event ?? "gtm.click" });
}

export default function withGTM<P>(
  Component: React.ComponentType<any>,
  propsToGtmMap: Map = {}
) {
  const ComponentWithGTM = ({ gtm, action, children, ...props }: Props & P) => {
    const { idMap } = useContext(GTMContext);
    const { "data-gtm": gtmDatasetJson, ...actionRest } = action || {};
    const gtmDataset = gtmDatasetJson && JSON.parse(gtmDatasetJson);
    const id = gtm.id || props[propsToGtmMap.id] || gtmDataset?.id;
    const dataGtm = {
      id: idMap[id] || id,
      label:
        gtm.label || String(props[propsToGtmMap.label]) || gtmDataset?.label,
      action: gtm.action || props[propsToGtmMap.action] || gtmDataset?.action
    };

    return (
      <Component
        {...props}
        {...(action && { action: actionRest })}
        data-gtm={JSON.stringify(dataGtm)}
      >
        {children}
      </Component>
    );
  };

  return ComponentWithGTM;
}
