import { BMI as brandLogo, Icon } from "@bmi/components";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSiteContext } from "../../Site";
import { Data, MainTile, MainTileVariant, Underlay } from "../types";
import {
  DimensionsValues,
  LinesMap,
  Measurements,
  Protrusion,
  RoofV2 as Roof
} from "../types/roof";
import { AnalyticsContext } from "./../helpers/analytics";
import { calculateArea } from "./calculation/calculate";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import protrusionTypes from "./calculation/protrusions";
import { requiredRoofs } from "./calculation/roofs";
import { microCopy } from "./constants/microCopy";
import CalculatorStepper from "./subcomponents/calculator-stepper/CalculatorStepper";
import Guttering, { GutteringSelections } from "./_Guttering";
import styles from "./_PitchedRoofCalculatorSteps.module.scss";
import Results from "./_Results";
import RoofDimensions from "./_RoofDimensions";
import RoofSelection from "./_RoofSelection";
import TileOptions, { TileOptionsSeletions } from "./_TileOptions";
import TileSelection from "./_TileSelection";
import UnderlaySelection from "./_UnderlaySelection";
import VariantSelection from "./_VariantSelection";

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
};

const PitchedRoofCalculatorSteps = ({
  data, // TODO: use here
  isDebugging,
  selected,
  setSelected
}: PitchedRoofCalculatorStepsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  const [roof, setRoof] = useState<Roof | undefined>(undefined);
  const [dimensions, setDimensions] = useState<DimensionsValues>({});
  const [tile, setTile] = useState<MainTile | undefined>(undefined);
  const [variant, setVariant] = useState<MainTileVariant | undefined>(
    undefined
  );
  const [tileOptions, setTileOptions] = useState<
    TileOptionsSeletions | undefined
  >(undefined);
  const [underlay, setUnderlay] = useState<Underlay | undefined>(undefined);
  const [guttering, setGuttering] = useState<GutteringSelections | undefined>(
    undefined
  );

  const selectRoof = (newRoof: Roof) => {
    setSelected("enter-dimensions");
    if (newRoof === roof) return;
    setRoof(newRoof);
    setDimensions({});
  };

  const saveDimensions = (
    e: React.FormEvent<Element>,
    values: Record<string, unknown>
  ) => {
    e.preventDefault();

    pushEvent({
      event: "dxb.button_click",
      id: "rc-dimensions",
      label: getMicroCopy(microCopy.ROOF_DIMENSIONS_NEXT_LABEL),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
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
    const { faces, lines } = roof.getMeasurements(dimensions);

    if (Array.isArray(dimensions.protrusions)) {
      for (const { type, ...protrusionDimensions } of dimensions.protrusions) {
        // eslint-disable-next-line security/detect-object-injection
        const protrusionType: Protrusion | undefined = protrusionTypes[type];
        if (protrusionType?.getMeasurements) {
          // eslint-disable-next-line security/detect-object-injection
          const { faces: pFaces, lines: pLines } =
            protrusionType.getMeasurements({
              ...protrusionDimensions,
              roofPitch: dimensions[roof.roofPitchField] // Says on what face of the roof the protrusion is
            });
          faces.push(...pFaces);
          Object.keys(lines).forEach((line) =>
            // eslint-disable-next-line security/detect-object-injection
            lines[line as keyof LinesMap].push(
              ...pLines[line as keyof LinesMap]
            )
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
          title={getMicroCopy(microCopy.ROOF_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.ROOF_SELECTION_SUBTITLE)}
        >
          <RoofSelection
            requiredRoofShapes={requiredRoofs}
            select={selectRoof}
            selected={roof}
          />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="enter-dimensions"
          title={getMicroCopy(microCopy.ROOF_DIMENSIONS_TITLE)}
          subtitle={getMicroCopy(microCopy.ROOF_DIMENSIONS_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.ROOF_DIMENSIONS_NEXT_LABEL)}
          nextButtonOnClick={saveDimensions}
          backLabel={getMicroCopy(microCopy.ROOF_DIMENSIONS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions",
              label: getMicroCopy(microCopy.ROOF_DIMENSIONS_BACK_LABEL),
              action: "selected"
            });
            setSelected("select-roof");
          }}
        >
          {roof ? <RoofDimensions roof={roof} dimensions={dimensions} /> : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key="select-tile"
          title={getMicroCopy(microCopy.TILE_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.TILE_SELECTION_SUBTITLE)}
          backLabel={getMicroCopy(microCopy.TILE_SELECTION_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile",
              label: getMicroCopy(microCopy.TILE_SELECTION_BACK_LABEL),
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
          title={getMicroCopy(microCopy.VARIANT_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.VARIANT_SELECTION_SUBTITLE)}
          backLabel={getMicroCopy(microCopy.VARIANT_SELECTION_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile-colour",
              label: getMicroCopy(microCopy.VARIANT_SELECTION_BACK_LABEL),
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
          title={getMicroCopy(microCopy.TILE_OPTIONS_TITLE)}
          subtitle={getMicroCopy(microCopy.TILE_OPTIONS_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.TILE_OPTIONS_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(microCopy.TILE_OPTIONS_NEXT_LABEL),
              action: "selected"
            });
            saveAndMove(e, values, setTileOptions, "select-underlay");
          }}
          backLabel={getMicroCopy(microCopy.TILE_OPTIONS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(microCopy.TILE_OPTIONS_BACK_LABEL),
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
          title={getMicroCopy(microCopy.UNDERLAY_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.UNDERLAY_SELECTION_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.UNDERLAY_SELECTION_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(microCopy.UNDERLAY_SELECTION_NEXT_LABEL),
              action: "selected"
            });
            saveAndMove(e, values as Underlay, setUnderlay, "guttering");
          }}
          backLabel={getMicroCopy(microCopy.UNDERLAY_SELECTION_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(microCopy.UNDERLAY_SELECTION_BACK_LABEL),
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
          title={getMicroCopy(microCopy.GUTTERING_GUTTER_TITLE)}
          subtitle={getMicroCopy(microCopy.GUTTERING_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.GUTTERING_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_NEXT_LABEL),
              action: "selected"
            });
            saveAndMove(e, values, setGuttering, "your-solution-contains");
          }}
          backLabel={getMicroCopy(microCopy.GUTTERING_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_BACK_LABEL),
              action: "selected"
            });
            setSelected("select-underlay");
          }}
          linkLabel={getMicroCopy(microCopy.GUTTERING_SKIP_LABEL)}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_SKIP_LABEL),
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
          title={getMicroCopy(microCopy.RESULTS_TITLE)}
          subtitle={getMicroCopy(microCopy.RESULTS_SUBTITLE, {
            contingency: CONTINGENCY_PERCENTAGE_TEXT
          })}
          paragraph={
            <span>
              {`${getMicroCopy(
                microCopy.RESULTS_AREA_LABEL
              )}: ${formattedArea}m`}
              <sup>2</sup>
            </span>
          }
          backLabel={getMicroCopy(microCopy.RESULTS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(microCopy.RESULTS_BACK_LABEL),
              action: "selected"
            });
            setSelected("guttering");
          }}
          linkLabel={getMicroCopy(microCopy.RESULTS_START_OVER_LABEL)}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(microCopy.RESULTS_START_OVER_LABEL),
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
                guttering
              }}
            />
          )}
        </CalculatorStepper.Step>
      </CalculatorStepper>
    </div>
  );
};

export default PitchedRoofCalculatorSteps;
