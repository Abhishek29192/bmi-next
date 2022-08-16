import { BMI as brandLogo, ContainerDialog, Icon } from "@bmi/components";
import { LinearProgress } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { graphql } from "gatsby";
import React, { Suspense, useCallback, useState } from "react";
import { AnalyticsContext, OnAnalyticsEvent } from "../helpers/analytics";
import { CalculatorConfig, CalculatorSteps } from "../types";
import { Data } from "../types/v2";
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
  calculatorConfig: CalculatorConfig | null;
};

const stepProgress: { [key in CalculatorSteps]: number } = {
  [CalculatorSteps.SelectRoof]: 14.28,
  [CalculatorSteps.EnterDimensions]: 14.28,
  [CalculatorSteps.SelectTile]: 28.56,
  [CalculatorSteps.SelectVariant]: 42.84,
  [CalculatorSteps.TileOptions]: 57.12,
  [CalculatorSteps.SelectUnderlay]: 71.4,
  [CalculatorSteps.Guttering]: 85.68,
  [CalculatorSteps.YourSolutionContains]: 100
};

const PitchedRoofCalculator = ({
  isOpen,
  onClose,
  isDebugging,
  data,
  calculatorConfig,
  onAnalyticsEvent = () => {
    // no-op
  }
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

  const [selected, setSelected] = useState<CalculatorSteps>(
    CalculatorSteps.SelectRoof
  );

  // eslint-disable-next-line security/detect-object-injection
  const progress = stepProgress[selected];
  const isSSR = typeof window === "undefined";

  const loading = (
    <div className={styles["spinnerContainer"]}>
      <CircularProgress className={styles["spinner"]} />
    </div>
  );

  return (
    <AnalyticsContext.Provider value={pushEvent}>
      <ContainerDialog
        color={
          selected === CalculatorSteps.YourSolutionContains ? "white" : "pearl"
        }
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
        <ContainerDialog.Header className={styles["ModalHeader"]}>
          <Icon source={brandLogo} className={styles["logo"]} />
          <LinearProgress
            value={progress}
            variant="determinate"
            className={styles["progressBar"]}
          />
        </ContainerDialog.Header>
        <div className={styles["PitchedRoofCalculator"]}>
          {!isSSR ? (
            <Suspense fallback={loading}>
              {data ? (
                <PitchedRoofCalculatorSteps
                  {...{
                    isDebugging,
                    selected,
                    setSelected,
                    data,
                    calculatorConfig
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

export const query = graphql`
  fragment PitchedRoofCalculatorFragment on ContentfulWebToolCalculator {
    hubSpotFormId
    roofShapes {
      roofShapeId
    }
  }
`;
