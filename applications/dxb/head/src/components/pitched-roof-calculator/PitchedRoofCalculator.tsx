import ContainerDialog from "@bmi-digital/components/container-dialog";
import { useIsClient } from "@bmi-digital/components/hooks";
import React, { Suspense, useCallback, useState } from "react";
import ProgressIndicator from "../ProgressIndicator";
import {
  StyledContainerDialog,
  StyledLinearProgress,
  StyledLogo,
  StyledSpinner,
  classes
} from "./PitchedRoofCalculator.styles";
import { AnalyticsContext, OnAnalyticsEvent } from "./helpers/analytics";
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
  [CalculatorSteps.SelectRoof]: 11.11,
  [CalculatorSteps.EnterDimensions]: 22.22,
  [CalculatorSteps.SelectTileCategory]: 33.33,
  [CalculatorSteps.SelectTile]: 44.44,
  [CalculatorSteps.SelectVariant]: 55.55,
  [CalculatorSteps.TileOptions]: 66.66,
  [CalculatorSteps.SelectUnderlay]: 77.77,
  [CalculatorSteps.Guttering]: 88.88,
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
    <StyledSpinner>
      <ProgressIndicator size={40} />
    </StyledSpinner>
  );

  const onCloseClick = useCallback(() => {
    pushEvent({
      event: "dxb.button_click",
      id: "rc-close",
      label: "Close Roof Calculator",
      action: "selected"
    });
    onClose();
  }, [onClose, pushEvent]);

  return (
    <AnalyticsContext.Provider value={pushEvent}>
      <StyledContainerDialog
        color={
          selected === CalculatorSteps.YourSolutionContains ? "white" : "pearl"
        }
        open={isOpen}
        onCloseClick={onCloseClick}
        maxWidth="xl"
        containerClassName={classes.dialogContent}
        allowOverflow={false}
        onBackdropClick={() => {
          // Disabling close on backdrop click
        }}
      >
        <ContainerDialog.Header
          className={classes.modalHeader}
          onCloseClick={onCloseClick}
        >
          <StyledLogo />
          <StyledLinearProgress value={progress} variant="determinate" />
        </ContainerDialog.Header>
        <div className={classes.dialogBody}>
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
      </StyledContainerDialog>
    </AnalyticsContext.Provider>
  );
};

export default PitchedRoofCalculator;
