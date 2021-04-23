import { ClickableAction } from "@bmi/clickable";
import { ButtonBaseActions } from "@material-ui/core";
import React from "react";

type GTM = {
  action?: (ClickableAction | Omit<ButtonBaseActions, "focusVisible">) & {
    "data-gtm"?: string;
  };
  gtm?: {
    id: string;
    label?: string;
    action?: string;
  };
};

type Map<P> = Partial<Record<keyof GTM["gtm"], string>>;

declare let window: Window & {
  dataLayer: object[];
};

export function pushToDataLayer(dataGtm: GTM["gtm"]) {
  window.dataLayer && window.dataLayer.push(dataGtm);
}

export default function withGTM<P>(
  Component: React.ComponentType<any>,
  propsToGtmMap: Map<P> = {}
) {
  const ComponentWithGTM = ({ gtm, action, ...props }: GTM & P) => {
    const { "data-gtm": gtmDatasetJson, ...actionRest } = action || {};
    const gtmDataset = gtmDatasetJson && JSON.parse(gtmDatasetJson);
    const dataGtm = {
      id: gtm.id || props[propsToGtmMap.id] || gtmDataset?.id,
      label:
        gtm.label || String(props[propsToGtmMap.label]) || gtmDataset?.label,
      action: gtm.action || props[propsToGtmMap.action] || gtmDataset?.action
    };

    const handleClick = (...args) => {
      // NOTE: Even if window.dataLayer doesn't exist in PREVIEW environment,
      // it's better to add an extra independent check here.
      if (!process.env.GATSBY_PREVIEW) {
        pushToDataLayer(dataGtm);
      }
      // @ts-ignore TS does not realise P could include `onClick`
      props.onClick && props.onClick(...args);
    };

    return (
      <Component
        {...props}
        {...(action && { action: actionRest })}
        data-gtm={JSON.stringify(dataGtm)}
        onClick={handleClick}
      />
    );
  };

  return ComponentWithGTM;
}
