import React, { Suspense, useCallback, useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContainerDialog from "@bmi/container-dialog";
import { AnalyticsContext, OnAnalyticsEvent } from "./helpers/analytics";
import styles from "./PitchedRoofCalculator.module.scss";

const PitchedRoofCalculatorSteps = React.lazy(
  () => import("./_PitchedRoofCalculatorSteps")
);

type PitchedRoofCalculatorProps = {
  isOpen?: boolean;
  onClose: () => void;
  isDebugging?: boolean;
  onAnalyticsEvent?: OnAnalyticsEvent;
};

const PitchedRoofCalculator = ({
  isOpen,
  onClose,
  isDebugging,
  onAnalyticsEvent = () => {}
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

  const [selected, setSelected] =
    useState<
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

  return (
    <AnalyticsContext.Provider value={pushEvent}>
      <ContainerDialog
        color={selected === "your-solution-contains" ? "white" : "pearl"}
        open={isOpen}
        onCloseClick={() => {
          pushEvent({
            id: "rc-close",
            label: "Close Roof Calculator",
            action: "selected"
          });
          onClose();
        }}
        maxWidth="xl"
        allowOverflow
        onBackdropClick={() => {}} // Disabling close on backdrop click
      >
        <div className={styles["PitchedRoofCalculator"]}>
          {!isSSR ? (
            <Suspense
              fallback={
                <div className={styles["spinnerContainer"]}>
                  <CircularProgress className={styles["spinner"]} />
                </div>
              }
            >
              <PitchedRoofCalculatorSteps
                {...{ isDebugging, selected, setSelected }}
              />
            </Suspense>
          ) : null}
        </div>
      </ContainerDialog>
    </AnalyticsContext.Provider>
  );
};

export default PitchedRoofCalculator;