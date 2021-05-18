import React, { useContext, useMemo, useState } from "react";
import Button from "@bmi/button";
import ContainerDialog from "@bmi/container-dialog";
import CalculatorStepper from "@bmi/calculator-stepper";
import { BMI as brandLogo } from "@bmi/logo";
import Icon from "@bmi/icon";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import RoofSelection from "./_RoofSelection";
import RoofDimensions from "./_RoofDimensions";
import TileSelection from "./_TileSelection";
import TileOptions from "./_TileOptions";
import VariantSelection from "./_VariantSelection";
import UnderlaySelection from "./_UnderlaySelection";
import Guttering from "./_Guttering";
import { calculateArea } from "./calculation/calculate";
import Results from "./_Results";
import protrusionTypes from "./calculation/protrusions";
import { DimensionsValues, Measurements, Roof } from "./types/roof";
import styles from "./PitchedRoofCalculator.module.scss";

type PitchedRoofCalculatorProps = {
  isDebugging?: boolean;
};

const PitchedRoofCalculator = ({ isDebugging }: PitchedRoofCalculatorProps) => {
  const copy = useContext(MicroCopyContext);
  const [open, setOpen] = useState(false);
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
  const [roof, setRoof] = useState<Roof | null>(null);
  const [dimensions, setDimensions] = useState<DimensionsValues>({});
  const [tile, setTile] = useState(null);
  const [variant, setVariant] = useState(null);
  const [tileOptions, setTileOptions] = useState<any>({});
  const [underlay, setUnderlay] = useState({});
  const [guttering, setGuttering] = useState<any>({});

  const selectRoof = (newRoof) => {
    setSelected("enter-dimensions");
    if (newRoof === roof) return;
    setRoof(newRoof);
    setDimensions({});
  };

  const saveDimensions = (e, values) => {
    e.preventDefault();
    // Nice to have: check if the dimensions are different before resetting
    setDimensions(values);
    setTile(null);
    setSelected("select-tile");
  };

  const selectTile = (newTile) => {
    setSelected("select-variant");
    if (newTile === tile) return;
    setTile(newTile);
    setVariant(null);
  };

  const selectVariant = (newVariant) => {
    setSelected("tile-options");
    if (newVariant === variant) return;
    setVariant(newVariant);
    setTileOptions({});
  };

  const saveAndMove = (e, values, set, next) => {
    e.preventDefault();
    set(values);
    setSelected(next);
  };

  const measurements: Measurements = useMemo(() => {
    if (!roof || !dimensions) return null;
    let { faces, lines } = roof.getMeasurements(dimensions);

    if (Array.isArray(dimensions.protrusions)) {
      for (const { type, ...protrusionDimensions } of dimensions.protrusions) {
        if (protrusionTypes[type].getMeasurements) {
          const { faces: pFaces, lines: pLines } = protrusionTypes[
            type
          ].getMeasurements({
            ...protrusionDimensions,
            roofPitch: dimensions[roof.roofPitchField] // Says on what face of the roof the protrusion is
          });
          faces.push(...pFaces);
          Object.keys(lines).forEach((line) =>
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

  return (
    <>
      <Button
        onClick={() => {
          setSelected("select-roof");
          setRoof(null);
          setOpen(true);
        }}
      >
        {getMicroCopy(copy, "roofSelection.title")}
      </Button>
      <ContainerDialog
        color={selected === "your-solution-contains" ? "white" : "pearl"}
        open={open}
        onCloseClick={() => setOpen(false)}
        maxWidth="xl"
        allowOverflow
        onBackdropClick={() => {}} // Disabling close on backdrop click
      >
        <div className={styles["PitchedRoofCalculator"]}>
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
              backButtonOnClick={() => setSelected("select-roof")}
            >
              {roof ? (
                <RoofDimensions roof={roof} dimensions={dimensions} />
              ) : null}
            </CalculatorStepper.Step>
            <CalculatorStepper.Step
              key="select-tile"
              title={getMicroCopy(copy, "tileSelection.title")}
              subtitle={getMicroCopy(copy, "tileSelection.subtitle")}
              backLabel={getMicroCopy(copy, "tileSelection.backLabel")}
              backButtonOnClick={() => setSelected("enter-dimensions")}
            >
              <TileSelection
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
              backButtonOnClick={() => setSelected("select-tile")}
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
              nextButtonOnClick={(e, values) =>
                saveAndMove(e, values, setTileOptions, "select-underlay")
              }
              backLabel={getMicroCopy(copy, "tileOptions.backLabel")}
              backButtonOnClick={() => setSelected("select-variant")}
            >
              {variant ? (
                <TileOptions variant={variant} selections={tileOptions} />
              ) : null}
            </CalculatorStepper.Step>
            <CalculatorStepper.Step
              key="select-underlay"
              title={getMicroCopy(copy, "underlaySelection.title")}
              subtitle={getMicroCopy(copy, "underlaySelection.subtitle")}
              nextLabel={getMicroCopy(copy, "underlaySelection.nextLabel")}
              nextButtonOnClick={(e, values) =>
                saveAndMove(e, values, setUnderlay, "guttering")
              }
              backLabel={getMicroCopy(copy, "underlaySelection.backLabel")}
              backButtonOnClick={() => setSelected("tile-options")}
            >
              <UnderlaySelection
                selected={underlay["underlay"]}
                dimensions={dimensions}
              />
            </CalculatorStepper.Step>
            <CalculatorStepper.Step
              key="guttering"
              title={getMicroCopy(copy, "guttering.title")}
              subtitle={getMicroCopy(copy, "guttering.subtitle")}
              nextLabel={getMicroCopy(copy, "guttering.nextLabel")}
              nextButtonOnClick={(e, values) =>
                saveAndMove(e, values, setGuttering, "your-solution-contains")
              }
              backLabel={getMicroCopy(copy, "guttering.backLabel")}
              backButtonOnClick={() => setSelected("select-underlay")}
              linkLabel={getMicroCopy(copy, "guttering.skipLabel")}
              linkOnClick={() => setSelected("your-solution-contains")}
            >
              <Guttering selections={guttering} />
            </CalculatorStepper.Step>
            <CalculatorStepper.Step
              key="your-solution-contains"
              title={getMicroCopy(copy, "results.title")}
              subtitle={getMicroCopy(copy, "results.subtitle", {
                contingency: "0"
              })}
              paragraph={
                <span>
                  {`${getMicroCopy(copy, "results.areaLabel")}: ${(
                    (measurements || { area: 0 }).area / 10000
                  ).toFixed(2)}m`}
                  <sup>2</sup>
                </span>
              }
              backLabel={getMicroCopy(copy, "results.backLabel")}
              backButtonOnClick={() => setSelected("guttering")}
              linkLabel={getMicroCopy(copy, "results.startOverLabel")}
              linkOnClick={() => setSelected("select-roof")}
            >
              <Results
                {...{
                  isDebugging,
                  measurements,
                  variant,
                  tileOptions,
                  underlay,
                  guttering
                }}
              />
            </CalculatorStepper.Step>
          </CalculatorStepper>
        </div>
      </ContainerDialog>
    </>
  );
};

export default PitchedRoofCalculator;
