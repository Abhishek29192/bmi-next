import { ContainerDialog } from "@bmi-digital/components";
import CircularProgress from "@mui/material/CircularProgress";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { AnalyticsContext, OnAnalyticsEvent } from "../helpers/analytics";
import { Data } from "../types";
import { EmailFormValues } from "../types/EmailFormValues";
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

  const isSSR = typeof window === "undefined";

  const loading = (
    <div className={styles["spinnerContainer"]}>
      <CircularProgress className={styles["spinner"]} />
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
          {!isSSR ? (
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
