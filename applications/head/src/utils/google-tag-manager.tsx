import React from "react";

type GTM = {
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

export default function withGTM<P>(
  Component: React.ComponentType<any>,
  propsToGtmMap: Map<P> = {}
) {
  const ComponentWithGTM = ({ gtm, ...props }: GTM & P) => {
    const dataGtm = {
      id: gtm.id || props[propsToGtmMap.id],
      label: gtm.label || String(props[propsToGtmMap.label]),
      action: gtm.action || props[propsToGtmMap.action]
    };

    return (
      <Component
        data-gtm={JSON.stringify(dataGtm)}
        onClick={(...args) => {
          // @ts-ignore TS does not realise P could include `onClick`
          props.onClick && props.onClick(args);
          window.dataLayer && window.dataLayer.push(dataGtm);
        }}
        {...props}
      />
    );
  };

  return ComponentWithGTM;
}
