import React, { useContext, useMemo, useState } from "react";
import QuantityTable from "@bmi/quantity-table";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import PDFIcon from "@material-ui/icons/PictureAsPdf";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import { battenCalc } from "./calculation/calculate";
import underlays from "./samples/underlays";
import { guttering as gutteringList, hooks } from "./samples/guttering";
import { VergeOption } from "./types";
import { Measurements } from "./types/roof";
import QuantitiesCalculator from "./calculation/QuantitiesCalculator";
import { AnalyticsContext } from "./helpers/analytics";
import Alert from "./subcomponents/_Alert";

const getRemoveRow = (setRows) => (externalProductCode) =>
  setRows((rows) =>
    rows.filter((row) => row.externalProductCode !== externalProductCode)
  );

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
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  const { faces, lines, area } = measurements;

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

  const tableLabels = useMemo(
    () => ({
      title: getMicroCopy(copy, "results.table.title"),
      packSize: getMicroCopy(copy, "results.table.packSize"),
      externalProductCode: getMicroCopy(
        copy,
        "results.table.externalProductCode"
      ),
      quantity: getMicroCopy(copy, "results.table.quantity"),
      remove: getMicroCopy(copy, "results.table.remove")
    }),
    []
  );

  return (
    <>
      {tileRows.length ? (
        <FieldContainer title={getMicroCopy(copy, "results.categories.tiles")}>
          <QuantityTable
            onDelete={getRemoveRow(setTileRows)}
            onChangeQuantity={() => {}}
            rows={tileRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {fixingRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.fixings")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setFixingRows)}
            onChangeQuantity={() => {}}
            rows={fixingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {sealingRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.sealing")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setSealingRows)}
            onChangeQuantity={() => {}}
            rows={sealingRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {ventilationRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.ventilation")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setVentilationRows)}
            onChangeQuantity={() => {}}
            rows={ventilationRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      {accessoryRows.length ? (
        <FieldContainer
          title={getMicroCopy(copy, "results.categories.accessories")}
        >
          <QuantityTable
            onDelete={getRemoveRow(setAccessoryRows)}
            onChangeQuantity={() => {}}
            rows={accessoryRows}
            {...tableLabels}
          />
        </FieldContainer>
      ) : null}
      <Alert
        type="warning"
        title={getMicroCopy(copy, "results.alerts.quantities.title")}
        first
      >
        {getMicroCopy(copy, "results.alerts.quantities.text")}
      </Alert>
      <Alert title={getMicroCopy(copy, "results.alerts.needToKnow.title")} last>
        {getMicroCopy(copy, "results.alerts.needToKnow.text")}
      </Alert>
      <Button
        startIcon={<PDFIcon />}
        style={{ marginBottom: 30 }}
        onClick={async () => {
          pushEvent({
            id: "rc-solution",
            label: getMicroCopy(copy, "results.downloadPdfLabel"),
            action: "selected"
          });
          (await import("./PDF")).default({
            results,
            area: (area / 10000).toFixed(2),
            getMicroCopy: (...params) => getMicroCopy(copy, ...params)
          });
        }}
      >
        {getMicroCopy(copy, "results.downloadPdfLabel")}
      </Button>
      {isDebugging ? (
        <FieldContainer>
          <Typography variant="h3">
            Measurements (showing because debugging mode is ON)
          </Typography>
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
