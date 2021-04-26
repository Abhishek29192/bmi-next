import React, { useMemo, useState } from "react";
import QuantityTable from "@bmi/quantity-table";
import Typography from "@bmi/typography";
import FieldContainer from "./subcomponents/_FieldContainer";
import { battenCalc } from "./calculation/calculate";
import underlays from "./samples/underlays";
import { guttering as gutteringList, hooks } from "./samples/guttering";
import { VergeOption } from "./types";
import { Measurements } from "./types/roof";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";

const getRemoveRow = (setRows) => (externalProductCode) =>
  setRows((rows) =>
    rows.filter((row) => row.externalProductCode !== externalProductCode)
  );

const tableLabels = {
  title: "Product",
  packSize: "Pack size",
  externalProductCode: "Nobb no",
  quantity: "Quantity",
  remove: "Remove"
};

const Results = ({
  isDebugging,
  measurements,
  variant,
  tileOptions,
  underlay,
  guttering
}: {
  isDebugging?: boolean;
  measurements: Measurements;
  variant: any;
  tileOptions: any;
  underlay: any;
  guttering: any;
}) => {
  const { faces, lines } = measurements;

  const results = useMemo(() => {
    let vergeOption: VergeOption;

    if (tileOptions.verge && tileOptions.verge !== "none") {
      vergeOption = variant.vergeOptions.find(
        ({ name }) => name === tileOptions.verge
      );
    }

    const ridge = tileOptions.ridge
      ? variant.ridgeOptions.find(
          (i) => i.externalProductCode === tileOptions.ridge
        )
      : variant.ridgeOptions[0];

    const ventilationHoods = variant.ventilationHoodOptions.filter((v) =>
      tileOptions.ventilation.includes(v.externalProductCode)
    );

    let gutteringVariant, gutteringHook;

    if (guttering.gutteringVariant) {
      gutteringVariant = gutteringList
        .find(({ name }) => guttering.guttering === name)
        .variants.find(
          ({ externalProductCode }) =>
            guttering.gutteringVariant === externalProductCode
        );
    }

    if (guttering.gutteringHook) {
      gutteringHook = hooks.find(
        ({ externalProductCode }) =>
          guttering.gutteringHook === externalProductCode
      );
    }

    const selectedUnderlay = underlays.find(
      (u) => u.externalProductCode === underlay.underlay
    );

    const quantitiesCalculator = new QuantitiesCalculator({
      measurements,
      mainTileVariant: variant,
      vergeOption: vergeOption,
      ridge,
      ventilationHoods,
      underlay: selectedUnderlay,
      gutteringVariant,
      gutteringHook,
      downPipes: guttering.downPipes,
      downPipeConnectors: guttering.downPipeConnectors
    });

    return quantitiesCalculator.getResultsRowsByCategory();
  }, []);

  const [tileRows, setTileRows] = useState(results.tiles);
  const [fixingRows, setFixingRows] = useState(results.fixings);
  const [sealingRows, setSealingRows] = useState(results.sealing);
  const [ventilationRows, setVentilationRows] = useState(results.ventilation);
  const [accessoryRows, setAccessoryRows] = useState(results.accessories);

  return (
    <>
      {tileRows.length ? (
        <FieldContainer title={"Tiles"}>
          <QuantityTable
            onDelete={getRemoveRow(setTileRows)}
            onChangeQuantity={() => {}}
            rows={tileRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {fixingRows.length ? (
        <FieldContainer title={"Fixings"}>
          <QuantityTable
            onDelete={getRemoveRow(setFixingRows)}
            onChangeQuantity={() => {}}
            rows={fixingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {sealingRows.length ? (
        <FieldContainer title={"Sealing"}>
          <QuantityTable
            onDelete={getRemoveRow(setSealingRows)}
            onChangeQuantity={() => {}}
            rows={sealingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {ventilationRows.length ? (
        <FieldContainer title={"Ventilation"}>
          <QuantityTable
            onDelete={getRemoveRow(setVentilationRows)}
            onChangeQuantity={() => {}}
            rows={ventilationRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {accessoryRows.length ? (
        <FieldContainer title={"Accessories"}>
          <QuantityTable
            onDelete={getRemoveRow(setAccessoryRows)}
            onChangeQuantity={() => {}}
            rows={accessoryRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {isDebugging ? (
        <FieldContainer>
          <Typography variant="h3">Measurements</Typography>
          <Typography variant="h4">Lines</Typography>
          <ul>
            {Object.keys(lines).map((l) =>
              lines[l].length ? (
                <li key={l}>
                  <b>{l}:</b>{" "}
                  {lines[l].map((v) => v.length.toFixed(2)).join(" | ")}
                </li>
              ) : null
            )}
          </ul>
          <Typography variant="h4">Faces</Typography>
          <ul>
            {faces.map((face, i) => (
              <li key={i}>
                <b>face {i + 1} battens (width):</b>{" "}
                {battenCalc(face.vertices, [face.pitch], variant)
                  .map(({ width }) => width.toFixed(2))
                  .join(" | ")}
              </li>
            ))}
          </ul>
        </FieldContainer>
      ) : null}
    </>
  );
};

export default Results;
