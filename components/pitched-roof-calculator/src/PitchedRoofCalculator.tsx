import React, { useMemo, useState } from "react";
import Button from "@bmi/button";
import CalculatorModal from "@bmi/calculator-modal";
import CalculatorStepper from "@bmi/calculator-stepper";
import RoofSelection from "./_RoofSelection";
import RoofDimensions from "./_RoofDimensions";
import TileSelection from "./_TileSelection";
import TileOptions from "./_TileOptions";
import VariantSelection from "./_VariantSelection";
import UnderlaySelection from "./_UnderlaySelection";
import Guttering from "./_Guttering";
import { calculateArea } from "./calculation/calculate";
import Results from "./_Results";

const PitchedRoofCalculator = ({ isDebugging }: any) => {
  const [open, setOpen] = useState(false);
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
  const [roof, setRoof] = useState(null);
  const [dimensions, setDimensions] = useState({});
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

  const measurements = useMemo(() => {
    if (!roof || !dimensions) return null;
    const { faces, lines } = roof.getMeasurements(dimensions);
    return { faces, lines, area: calculateArea(faces) };
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
        Open modal
      </Button>
      <CalculatorModal
        pearl={selected !== "your-solution-contains"}
        open={open}
        onCloseClick={() => setOpen(false)}
      >
        <CalculatorStepper selected={selected}>
          <CalculatorStepper.Step
            key="select-roof"
            title="Choose your roof type"
            subtitle="Get started by letting us know the roof shape that most closely resembles your roof"
          >
            <RoofSelection select={selectRoof} selected={roof} />
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="enter-dimensions"
            title="Enter dimensions"
            subtitle="Enter these measurements, to help us find the total area of the roof"
            nextLabel="Proceed to select tile options"
            nextButtonOnClick={saveDimensions}
            backLabel="Go back"
            backButtonOnClick={() => setSelected("select-roof")}
          >
            {roof ? (
              <RoofDimensions roof={roof} dimensions={dimensions} />
            ) : null}
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="select-tile"
            title="Select a tile"
            subtitle="You can now choose from different roofing tiles. In the next step you can select the tile colour."
            backLabel="Go back"
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
            title="Select your tile colour"
            subtitle="These are the tile colour options available for the chosen product range."
            backLabel="Go back"
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
            title="Tile options and accessories"
            subtitle="Here you can choose more tile options and accessories."
            nextLabel="Proceed to select underlay"
            nextButtonOnClick={(e, values) =>
              saveAndMove(e, values, setTileOptions, "select-underlay")
            }
            backLabel="Go back"
            backButtonOnClick={() => setSelected("select-variant")}
          >
            {variant ? (
              <TileOptions variant={variant} selections={tileOptions} />
            ) : null}
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="select-underlay"
            title="Now, select the underlay"
            subtitle="These are the available options for your tile product selection. You can remove your underlay later, if required."
            nextLabel="Calculate products"
            nextButtonOnClick={(e, values) =>
              saveAndMove(e, values, setUnderlay, "guttering")
            }
            backLabel="Go back"
            backButtonOnClick={() => setSelected("tile-options")}
          >
            {tile ? (
              <UnderlaySelection
                selected={underlay["underlay"]}
                dimensions={dimensions}
              />
            ) : null}
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="guttering"
            title="Now, choose your guttering options"
            subtitle="Choose the available guttering option. Skip this step if you don’t want to add guttering to the estimation."
            nextLabel="Calculate products"
            nextButtonOnClick={(e, values) =>
              saveAndMove(e, values, setGuttering, "your-solution-contains")
            }
            backLabel="Go back"
            backButtonOnClick={() => setSelected("select-underlay")}
            linkLabel="Skip guttering and calculate products"
            linkOnClick={() => setSelected("your-solution-contains")}
          >
            <Guttering selections={guttering} />
          </CalculatorStepper.Step>
          <CalculatorStepper.Step
            key="your-solution-contains"
            title="Your solution contains"
            subtitle="Disclaimer: We strive to be within 5-10% accurate. We've also added a wastage contingency of: 0% into this material calculation"
            paragraph={
              <span>
                For the total measured area for your roof:{" "}
                {((measurements || { area: 0 }).area / 10000).toFixed(2)}m
                <sup>2</sup>
              </span>
            }
            backLabel="Go back"
            backButtonOnClick={() => setSelected("guttering")}
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
      </CalculatorModal>
    </>
  );
};

export default PitchedRoofCalculator;
