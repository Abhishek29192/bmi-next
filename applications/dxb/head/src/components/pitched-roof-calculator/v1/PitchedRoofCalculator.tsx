import { ContainerDialog, useIsClient } from "@bmi-digital/components";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { AnalyticsContext, OnAnalyticsEvent } from "../helpers/analytics";
import { Data } from "../types";
import { EmailFormValues } from "../types/EmailFormValues";
import ProgressIndicator from "../../ProgressIndicator";
import styles from "./PitchedRoofCalculator.module.scss";

const PitchedRoofCalculatorSteps = React.lazy(
  () => import("./_PitchedRoofCalculatorSteps")
);

export type PitchedRoofCalculatorProps = {
  isOpen?: boolean;
  onClose: () => void;
  isDebugging?: boolean;
  data?: Data; // undefied shows loading progress
  onAnalyticsEvent?: OnAnalyticsEvent;
  sendEmailAddress: (values: EmailFormValues) => Promise<void>;
};

const PitchedRoofCalculator = ({
  isOpen,
  onClose,
  isDebugging,
  data,
  onAnalyticsEvent = () => {
    // no-op
  },
  sendEmailAddress
}: PitchedRoofCalculatorProps) => {
  const pushEvent: OnAnalyticsEvent = useCallback(
    (event) => {
      try {
        onAnalyticsEvent(event);
      } catch (_error) {
        // eslint-disable-next-line no-console
        console.warn("Analytics events are failing");
      }
    },
    [onAnalyticsEvent]
  );

  const [selected, setSelected] = useState<
    | "select-roof"
    | "enter-dimensions"
    | "select-tile"
    | "select-variant"
    | "tile-options"
    | "select-underlay"
    | "guttering"
    | "your-solution-contains"
  >("select-roof");

  useEffect(() => {
    if (!isOpen && selected !== "select-roof") {
      setSelected("select-roof");
    }
  }, [isOpen]);

  const { isClient } = useIsClient();

  const loading = (
    <div className={styles["spinnerContainer"]}>
      <ProgressIndicator size={40} className={styles["spinner"]} />
    </div>
  );

  return (
    <AnalyticsContext.Provider value={pushEvent}>
      <ContainerDialog
        color={selected === "your-solution-contains" ? "white" : "pearl"}
        open={isOpen}
        onCloseClick={() => {
          pushEvent({
            event: "dxb.button_click",
            id: "rc-close",
            label: "Close Roof Calculator",
            action: "selected"
          });
          onClose();
        }}
        maxWidth="xl"
        allowOverflow
        onBackdropClick={() => {
          // Disabling close on backdrop click
        }}
      >
        <div className={styles["PitchedRoofCalculator"]}>
          {isClient ? (
            <Suspense fallback={loading}>
              {data ? (
                <PitchedRoofCalculatorSteps
                  {...{
                    isDebugging,
                    selected,
                    setSelected,
                    sendEmailAddress,
                    data
                  }}
                />
              ) : (
                loading
              )}
            </Suspense>
          ) : null}
        </div>
      </ContainerDialog>
    </AnalyticsContext.Provider>
  );
};

export default PitchedRoofCalculator;
