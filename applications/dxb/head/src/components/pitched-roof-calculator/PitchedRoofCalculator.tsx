import { ContainerDialog, Logo, useIsClient } from "@bmi-digital/components";
import { BMI as brandLogo } from "@bmi-digital/components/logo";
import { LinearProgress } from "@mui/material";
import { graphql } from "gatsby";
import React, { Suspense, useCallback, useState } from "react";
import ProgressIndicator from "../ProgressIndicator";
import { AnalyticsContext, OnAnalyticsEvent } from "./helpers/analytics";
import styles from "./PitchedRoofCalculator.module.scss";
import { CalculatorConfig, CalculatorSteps } from "./types";

const PitchedRoofCalculatorSteps = React.lazy(
  () => import("./_PitchedRoofCalculatorSteps")
);

export type PitchedRoofCalculatorProps = {
  isOpen?: boolean;
  onClose: () => void;
  isDebugging?: boolean;
  onAnalyticsEvent?: OnAnalyticsEvent;
  calculatorConfig: CalculatorConfig | null;
};

const stepProgress: { [key in CalculatorSteps]: number } = {
  [CalculatorSteps.SelectRoof]: 12.5,
  [CalculatorSteps.EnterDimensions]: 25,
  [CalculatorSteps.SelectTile]: 37.5,
  [CalculatorSteps.SelectVariant]: 50,
  [CalculatorSteps.TileOptions]: 62.5,
  [CalculatorSteps.SelectUnderlay]: 75,
  [CalculatorSteps.Guttering]: 87.5,
  [CalculatorSteps.YourSolutionContains]: 100
};

const PitchedRoofCalculator = ({
  isOpen,
  onClose,
  isDebugging,
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

  const { isClient } = useIsClient();

  // eslint-disable-next-line security/detect-object-injection
  const progress = stepProgress[selected];

  const loading = (
    <div className={styles["spinnerContainer"]}>
      <ProgressIndicator size={40} className={styles["spinner"]} />
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
        className={styles["PitchedRoofCalculator"]}
        containerClassName={styles["dialogContent"]}
        allowOverflow={false}
        onBackdropClick={() => {
          // Disabling close on backdrop click
        }}
      >
        <ContainerDialog.Header className={styles["ModalHeader"]}>
          <Logo source={brandLogo} className={styles["logo"]} />
          <LinearProgress
            value={progress}
            variant="determinate"
            className={styles["progressBar"]}
          />
        </ContainerDialog.Header>
        <div className={styles["dialogBody"]}>
          {isClient ? (
            <Suspense fallback={loading}>
              <PitchedRoofCalculatorSteps
                isDebugging={isDebugging}
                selected={selected}
                setSelected={setSelected}
                calculatorConfig={calculatorConfig}
              />
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
    needHelpSection {
      ...TitleWithContentFragment
    }
  }
`;