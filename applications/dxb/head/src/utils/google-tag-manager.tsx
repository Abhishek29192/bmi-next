import { ClickableAction } from "@bmi/components";
import { ButtonBaseActions } from "@material-ui/core/ButtonBase";
import React, { createContext, useContext } from "react";

export type GTM = {
  id: string;
  event?: string;
  label?: string;
  action?: string;
};

type Props = {
  action?: (ClickableAction | Omit<ButtonBaseActions, "focusVisible">) & {
    "data-gtm"?: string;
  };
  children?: React.ReactNode;
  gtm?: GTM;
};

type Map = Partial<Record<keyof GTM, string>>;

declare let window: Window & {
  dataLayer: {
    push: (data: GTM) => {
      // no-op
    };
  };
};

type Context = {
  idMap: Record<string, string>;
};

/**
 * Allows for GTM IDs to be mapped to a different ID when the event is
 * triggered.
 */
export const GTMContext = createContext<Context>({ idMap: {} });

/**
 * This pushes data to the GTM dataLayer. This should only be used outside of
 * {@link withGTM} when a user doesn't interact with a Component. In most cases,
 * {@link withGTM} should be used.
 *
 * There are some caveats to doing this:
 * 1. For GTM to send data to Google Analytics, we need to provide an `event`
 *     1. To re-create a "click" event, use `gtm.click`
 * 1. Data pushed to the dataLayer is _never_ removed, only ever overwritten
 *
 * @param {GTM} dataGtm the data to push to the dataLayer
 */
export const pushToDataLayer = (dataGtm: GTM) => {
  window.dataLayer && window.dataLayer.push(dataGtm);
};

/**
 * Adds a `data-gtm` attribute and adds the {@link pushToDataLayer} call to the
 * onClick event for the provided Component. The `data-gtm` is used to filter
 * out irrelevant clicks (as GTM captures _all_ clicks).
 *
 * Using gtm
 * @example
 * const MyGtmComponent = withGTM(MyComponent);
 * <MyGtmComponent gtm={
 *   event: "my-event",
 *   id: "my-id",
 *   label: "my-label",
 *   action: "my-action"
 * } />
 *
 * Using propsToGtmMap
 * @example
 * const propsToGtmMap = {
 *   id: "id",
 *   label: "aria-label",
 *   action: "href"
 * }
 * const MyGtmComponent = withGTM(MyComponent, propsToGtmMap);
 * <MyGtmComponent
 *   id={"my-id"}
 *   aria-label={"my-label"}
 *   href={"my-action"}
 * />
 *
 * Using action
 * @example
 * const MyGtmComponent = withGTM(MyComponent);
 * <MyGtmComponent action={
 *  "data-gtm": JSON.stringify({
 *    event: "my-event",
 *    id: "my-id",
 *    label: "my-label",
 *    action: "my-action"
 *  })
 * } />
 *
 * If using spreads, MUST pass it down to the child components
 * @example
 * const MyComponent = (
 *  {
 *    something,
 *    something-else,
 *    ...rest
 *  }: Props) => {
 *  return (
 *    <Card
 *      className={classnames(
 *        styles["LinkCard"],
 *        isOpen && styles[`LinkCard--selected`]
 *      )}
 *      onClick={!isOpen ? onClick : undefined}
 *      ref={forwardedRef}
 *      {...rest}
 *    >
 * etc
 *
 * @param Component the Component to manipulate
 * @param propsToGtmMap the properties to use for adding data to GTM
 * @returns the original Component with the additional behaviour properties
 */
export default function withGTM<P>(
  Component: React.ComponentType<any>,
  propsToGtmMap: Map = {}
) {
  const ComponentWithGTM = ({ gtm, action, children, ...props }: Props & P) => {
    const { idMap } = useContext(GTMContext);
    const { "data-gtm": gtmDatasetJson, ...actionRest } = action || {};
    const gtmDataset = gtmDatasetJson && JSON.parse(gtmDatasetJson);
    const id =
      gtm?.id ||
      (propsToGtmMap.id === "children" && String(children)) ||
      (props[propsToGtmMap.id] && String(props[propsToGtmMap.id])) ||
      gtmDataset?.id;
    // eslint-disable-next-line security/detect-object-injection
    const gtmId = idMap[id] || id;

    const getMediaLabel = (props) => {
      const { isVideo } = props;
      if (propsToGtmMap.label === "media") {
        return isVideo
          ? String(props[propsToGtmMap.label].props.label)
          : String(props[propsToGtmMap.label].props.alt);
      }
      return false;
    };

    const getMediaAction = (props) => {
      const { isVideo } = props;
      if (propsToGtmMap.action === "media") {
        return isVideo
          ? String(props["imageSource"])
          : String(props[propsToGtmMap.action].props.src);
      }
      return false;
    };

    const gtmLabel =
      gtm?.label ||
      getMediaLabel(props) ||
      (propsToGtmMap.label === "children" && String(children)) ||
      (props[propsToGtmMap.label] && String(props[propsToGtmMap.label])) ||
      gtmDataset?.label;
    const gtmAction =
      gtm?.action ||
      getMediaAction(props) ||
      (propsToGtmMap.action === "children" && String(children)) ||
      (props[propsToGtmMap.action] && String(props[propsToGtmMap.action])) ||
      gtmDataset?.action;

    if (!gtmId && !gtmLabel && !gtmAction) {
      throw new Error("No GTM data provided.");
    }

    const dataGtm = {
      id: gtmId,
      label: gtmLabel,
      action: gtmAction
    };

    const handleClick = (...args: any[]) => {
      if (!process.env.GATSBY_PREVIEW) {
        pushToDataLayer(dataGtm);
      }

      // TS doesn't like that P may have onClick
      "onClick" in props && (props as any).onClick(...args);
    };

    return (
      <Component
        {...props}
        {...(action && { action: actionRest })}
        {...(!process.env.GATSBY_PREVIEW && {
          "data-gtm": JSON.stringify(dataGtm)
        })}
        onClick={handleClick}
      >
        {children}
      </Component>
    );
  };

  return ComponentWithGTM;
}

export const useGTM = (props: GTM) => {
  const { idMap } = useContext(GTMContext);
  const gtmId = idMap[props.id] || props.id;
  const dataGTM = {
    id: gtmId,
    label: props.label,
    action: props.action
  };

  function pushGTMEvent() {
    if (!process.env.GATSBY_PREVIEW) {
      pushToDataLayer(dataGTM);
    }
  }

  return {
    dataGTM,
    pushGTMEvent
  };
};
