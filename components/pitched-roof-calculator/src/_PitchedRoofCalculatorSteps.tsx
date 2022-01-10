import React, { useContext, useEffect, useMemo, useState } from "react";
import CalculatorStepper from "@bmi/calculator-stepper";
import { BMI as brandLogo } from "@bmi/logo";
import Icon from "@bmi/icon";
import { AnalyticsContext } from "./helpers/analytics";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import RoofSelection from "./_RoofSelection";
import RoofDimensions from "./_RoofDimensions";
import TileSelection from "./_TileSelection";
import TileOptions, { TileOptionsSeletions } from "./_TileOptions";
import VariantSelection from "./_VariantSelection";
import UnderlaySelection from "./_UnderlaySelection";
import Guttering, { GutteringSelections } from "./_Guttering";
import { calculateArea } from "./calculation/calculate";
import Results from "./_Results";
import { EmailFormValues } from "./types/EmailFormValues";
import protrusionTypes from "./calculation/protrusions";
import { DimensionsValues, Measurements, Roof } from "./types/roof";
import styles from "./_PitchedRoofCalculatorSteps.module.scss";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import { Data, MainTile, MainTileVariant, Underlay } from "./types";

export type Step =
  | "select-roof"
  | "enter-dimensions"
  | "select-tile"
  | "select-variant"
  | "tile-options"
  | "select-underlay"
  | "guttering"
  | "your-solution-contains";

export type PitchedRoofCalculatorStepsProps = {
  data: Data;
  isDebugging?: boolean;
  selected: Step;
  setSelected: (value: Step) => void;
  sendEmailAddress: (values: EmailFormValues) => Promise<void>;
};

const PitchedRoofCalculatorSteps = ({
  data, // TODO: use here
  isDebugging,
  selected,
  setSelected,
  sendEmailAddress
}: PitchedRoofCalculatorStepsProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const [roof, setRoof] = useState<Roof | undefined>(undefined);
  const [dimensions, setDimensions] = useState<DimensionsValues>({});
  const [tile, setTile] = useState<MainTile | undefined>(undefined);
  const [variant, setVariant] =
    useState<MainTileVariant | undefined>(undefined);
  const [tileOptions, setTileOptions] =
    useState<TileOptionsSeletions | undefined>(undefined);
  const [underlay, setUnderlay] = useState<Underlay | undefined>(undefined);
  const [guttering, setGuttering] =
    useState<GutteringSelections | undefined>(undefined);

  const selectRoof = (newRoof: Roof) => {
    setSelected("enter-dimensions");
    if (newRoof === roof) return;
    setRoof(newRoof);
    setDimensions({});
  };

  const saveDimensions = (e: React.FormEvent<Element>, values: object) => {
    e.preventDefault();

    pushEvent({
      event: "dxb.button_click",
      id: "rc-dimensions",
      label: getMicroCopy(copy, "roofDimensions.nextLabel"),
      action: "selected"
    });

    // Nice to have: check if the dimensions are different before resetting
    setDimensions(values as DimensionsValues);
    setTile(undefined);
    setSelected("select-tile");
  };

  const selectTile = (newTile: MainTile) => {
    setSelected("select-variant");
    if (newTile === tile) return;
    setTile(newTile);
    setVariant(undefined);
  };

  const selectVariant = (newVariant: MainTileVariant) => {
    setSelected("tile-options");
    if (newVariant === variant) return;
    setVariant(newVariant);
    setTileOptions(undefined);
  };

  const saveAndMove = <T extends any>(
    e: React.FormEvent<Element>,
    values: T,
    set: React.Dispatch<React.SetStateAction<T | undefined>>,
    next: Step
  ) => {
    e.preventDefault();
    set(values);
    setSelected(next);
  };

  const measurements: Measurements | null = useMemo(() => {
    if (!roof || !dimensions) return null;
    let { faces, lines } = roof.getMeasurements(dimensions);

    if (Array.isArray(dimensions.protrusions)) {
      for (const { type, ...protrusionDimensions } of dimensions.protrusions) {
        // eslint-disable-next-line security/detect-object-injection
        if (protrusionTypes[type]?.getMeasurements) {
          // eslint-disable-next-line security/detect-object-injection
          const { faces: pFaces, lines: pLines } = protrusionTypes[
            type
          ].getMeasurements({
            ...protrusionDimensions,
            roofPitch: dimensions[roof.roofPitchField] // Says on what face of the roof the protrusion is
          });
          faces.push(...pFaces);
          Object.keys(lines).forEach((line) =>
            // eslint-disable-next-line security/detect-object-injection
            lines[line].push(...pLines[line])
          );
        }
      }
    }

    return {
      faces,
      lines,
      area: calculateArea(faces)
    };
  }, [roof, dimensions]);

  const formattedArea = ((measurements?.area || 0) / 10000).toFixed(2);

  useEffect(() => {
    if (selected === "your-solution-contains") {
      pushEvent({
        event: "dxb.button_click",
        id: "rc-solution-m2",
        label: "m²",
        action: formattedArea
      });
    }
  }, [selected, formattedArea]);

  return (
    <div className={styles["PitchedRoofCalculatorSteps"]}>
      <Icon source={brandLogo} className={styles["logo"]} />
      <CalculatorStepper selected={selected}>
        <CalculatorStepper.Step
          key="select-roof"
          title={getMicroCopy(copy, "roofSelection.title")}
          subtitle={getMicroCopy(copy, "roofSelection.subtitle")}
        >
          <RoofSelection select={selectRoof} selected={roof} />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="enter-dimensions"
          title={getMicroCopy(copy, "roofDimensions.title")}
          subtitle={getMicroCopy(copy, "roofDimensions.subtitle")}
          nextLabel={getMicroCopy(copy, "roofDimensions.nextLabel")}
          nextButtonOnClick={saveDimensions}
          backLabel={getMicroCopy(copy, "roofDimensions.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions",
              label: getMicroCopy(copy, "roofDimensions.backLabel"),
              action: "selected"
            });
            setSelected("select-roof");
          }}
        >
          {roof ? <RoofDimensions roof={roof} dimensions={dimensions} /> : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="select-tile"
          title={getMicroCopy(copy, "tileSelection.title")}
          subtitle={getMicroCopy(copy, "tileSelection.subtitle")}
          backLabel={getMicroCopy(copy, "tileSelection.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile",
              label: getMicroCopy(copy, "tileSelection.backLabel"),
              action: "selected"
            });
            setSelected("enter-dimensions");
          }}
        >
          <TileSelection
            tiles={data.mainTiles}
            select={selectTile}
            selected={tile}
            dimensions={dimensions}
          />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="select-variant"
          title={getMicroCopy(copy, "variantSelection.title")}
          subtitle={getMicroCopy(copy, "variantSelection.subtitle")}
          backLabel={getMicroCopy(copy, "variantSelection.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile-colour",
              label: getMicroCopy(copy, "variantSelection.backLabel"),
              action: "selected"
            });
            setSelected("select-tile");
          }}
        >
          {tile ? (
            <VariantSelection
              select={selectVariant}
              selected={variant}
              dimensions={dimensions}
              tile={tile}
            />
          ) : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="tile-options"
          title={getMicroCopy(copy, "tileOptions.title")}
          subtitle={getMicroCopy(copy, "tileOptions.subtitle")}
          nextLabel={getMicroCopy(copy, "tileOptions.nextLabel")}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(copy, "tileOptions.nextLabel"),
              action: "selected"
            });
            saveAndMove(e, values, setTileOptions, "select-underlay");
          }}
          backLabel={getMicroCopy(copy, "tileOptions.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(copy, "tileOptions.backLabel"),
              action: "selected"
            });
            setSelected("select-variant");
          }}
        >
          {variant && tileOptions ? (
            <TileOptions variant={variant} selections={tileOptions} />
          ) : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="select-underlay"
          title={getMicroCopy(copy, "underlaySelection.title")}
          subtitle={getMicroCopy(copy, "underlaySelection.subtitle")}
          nextLabel={getMicroCopy(copy, "underlaySelection.nextLabel")}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(copy, "underlaySelection.nextLabel"),
              action: "selected"
            });
            saveAndMove(e, values as Underlay, setUnderlay, "guttering");
          }}
          backLabel={getMicroCopy(copy, "underlaySelection.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(copy, "underlaySelection.backLabel"),
              action: "selected"
            });
            setSelected("tile-options");
          }}
        >
          <UnderlaySelection
            options={data.underlays}
            selected={underlay}
            dimensions={dimensions}
          />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="guttering"
          title={getMicroCopy(copy, "guttering.title")}
          subtitle={getMicroCopy(copy, "guttering.subtitle")}
          nextLabel={getMicroCopy(copy, "guttering.nextLabel")}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(copy, "guttering.nextLabel"),
              action: "selected"
            });
            saveAndMove(e, values, setGuttering, "your-solution-contains");
          }}
          backLabel={getMicroCopy(copy, "guttering.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(copy, "guttering.backLabel"),
              action: "selected"
            });
            setSelected("select-underlay");
          }}
          linkLabel={getMicroCopy(copy, "guttering.skipLabel")}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(copy, "guttering.skipLabel"),
              action: "selected"
            });
            setSelected("your-solution-contains");
          }}
        >
          {guttering ? (
            <Guttering
              selections={guttering}
              gutters={data.gutters}
              gutterHooks={data.gutterHooks}
            />
          ) : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          isForm={false}
          key="your-solution-contains"
          title={getMicroCopy(copy, "results.title")}
          subtitle={getMicroCopy(copy, "results.subtitle", {
            contingency: CONTINGENCY_PERCENTAGE_TEXT
          })}
          paragraph={
            <span>
              {`${getMicroCopy(copy, "results.areaLabel")}: ${formattedArea}m`}
              <sup>2</sup>
            </span>
          }
          backLabel={getMicroCopy(copy, "results.backLabel")}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(copy, "results.backLabel"),
              action: "selected"
            });
            setSelected("guttering");
          }}
          linkLabel={getMicroCopy(copy, "results.startOverLabel")}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(copy, "results.startOverLabel"),
              action: "selected"
            });
            setSelected("select-roof");
            setRoof(undefined);
          }}
        >
          {measurements && variant && tileOptions && underlay && guttering && (
            <Results
              underlays={data.underlays}
              gutters={data.gutters}
              gutterHooks={data.gutterHooks}
              {...{
                isDebugging,
                measurements,
                variant,
                tileOptions,
                underlay,
                guttering,
                sendEmailAddress
              }}
            />
          )}
        </CalculatorStepper.Step>
      </CalculatorStepper>
    </div>
  );
};

export default PitchedRoofCalculatorSteps;
