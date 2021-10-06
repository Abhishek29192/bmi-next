import { ClickableAction } from "@bmi/clickable";
import { ButtonBaseActions } from "@material-ui/core";
import React, { createContext, useContext } from "react";

type GTM = {
  action?: (ClickableAction | Omit<ButtonBaseActions, "focusVisible">) & {
    "data-gtm"?: string;
  };
  gtm?: {
    id: string;
    event?: string;
    label?: string;
    action?: string;
  };
};

type Map<P> = Partial<Record<keyof GTM["gtm"], string>>;

declare let window: Window & {
  dataLayer: { push: (data: GTM["gtm"]) => {} };
};

type Context = {
  idMap: Record<string, string>;
};

export const GTMContext = createContext<Context>({ idMap: {} });

export function pushToDataLayer(dataGtm: GTM["gtm"]) {
  window.dataLayer &&
    window.dataLayer.push({ ...dataGtm, event: dataGtm.event ?? "gtm.click" });
}

export default function withGTM<P>(
  Component: React.ComponentType<any>,
  propsToGtmMap: Map<P> = {}
) {
  const ComponentWithGTM = ({ gtm, action, ...props }: GTM & P) => {
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
      />
    );
  };

  return ComponentWithGTM;
}
