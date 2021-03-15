import React, { useMemo, useState } from "react";
import QuantityTable from "@bmi/quantity-table";
import Typography from "@bmi/typography";
import FieldContainer from "./subcomponents/_FieldContainer";
import { battenCalc, surface } from "./calculation/calculate";
import underlays from "./samples/underlays";
import { guttering as gutteringList, hooks } from "./samples/guttering";

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
  measurements: { faces, lines, area },
  variant,
  tileOptions,
  underlay,
  guttering
}: any) => {
  const [tileRows, setTileRows] = useState(() => {
    const facesBattens = faces.map((face) =>
      battenCalc(face.vertices, [face.pitch], variant)
    );
    const faceTiles = facesBattens.map((battens) =>
      surface(battens, variant, variant.halfTile)
    );

    return [
      {
        image: variant.image,
        description: variant.name,
        externalProductCode: variant.externalProductCode,
        packSize: "-",
        quantity: faceTiles.reduce((acc, { quantity }) => acc + quantity, 0)
      },
      ...(variant.halfTile
        ? [
            {
              image: variant.halfTile.image,
              description: variant.halfTile.name,
              externalProductCode: variant.halfTile.externalProductCode,
              packSize: "-",
              quantity: faceTiles.reduce(
                (acc, { half: { quantity } }) => acc + quantity,
                0
              )
            }
          ]
        : [])
    ];
  });

  const { ridge, ridgeTiles, hipTiles } = useMemo(() => {
    const ridge = tileOptions.ridge
      ? variant.ridgeOptions.find(
          (i) => i.externalProductCode === tileOptions.ridge
        )
      : variant.ridgeOptions[0];

    const ridgeTiles = lines.ridge.reduce(
      (acc, v) => acc + Math.ceil(v / ridge.length),
      0
    );

    const hipTiles = lines.hip.reduce(
      (acc, v) => acc + Math.ceil(v / variant.hip.length),
      0
    );

    return { ridge, ridgeTiles, hipTiles };
  }, []);

  const [fixingRows, setFixingRows] = useState(() => [
    {
      image: ridge.image,
      description: ridge.name,
      externalProductCode: ridge.externalProductCode,
      packSize: "-",
      quantity: ridgeTiles
    },
    {
      image: variant.hip.image,
      description: variant.hip.name,
      externalProductCode: variant.hip.externalProductCode,
      packSize: "-",
      quantity: hipTiles
    }
  ]);

  const [ventilationRows, setVentilationRows] = useState(() => [
    ...variant.ventilationHoodOptions
      .filter((v) => tileOptions.ventilation.includes(v.externalProductCode))
      .map((p) => ({ ...p, quantity: 1 }))
  ]);

  const [accessoryRows, setAccessoryRows] = useState(() => {
    const calculateForEaves = (length) =>
      lines.eave.reduce((acc, v) => acc + Math.ceil(v / length), 0);

    const eaveAccessoriesQuantity = calculateForEaves(1000);

    let gutterProducts = [];

    if (guttering.gutteringVariant) {
      const gutteringVariant = gutteringList
        .find(({ name }) => guttering.guttering === name)
        .variants.find(
          ({ externalProductCode }) =>
            guttering.gutteringVariant === externalProductCode
        );
      const hook = hooks.find(
        ({ externalProductCode }) =>
          guttering.gutteringHook === externalProductCode
      );
      gutterProducts = [
        {
          image: gutteringVariant.image,
          description: gutteringVariant.name,
          externalProductCode: gutteringVariant.externalProductCode,
          packSize: "-",
          quantity: calculateForEaves(gutteringVariant.length)
        },
        {
          image: hook.image,
          description: hook.name,
          externalProductCode: hook.externalProductCode,
          packSize: "-",
          quantity: calculateForEaves(hook.length)
        },
        { ...gutteringVariant.downpipe, quantity: guttering.downPipes },
        {
          ...gutteringVariant.downpipeConnector,
          quantity: guttering.downPipeConnectors
        }
      ];
    }

    let calculatedAccessories = [];

    if (variant.clip) {
      calculatedAccessories.push({
        ...variant.clip,
        quantity: ridgeTiles + hipTiles
      });
    }

    if (variant.ridgeAndHipScrew) {
      calculatedAccessories.push({
        ...variant.ridgeAndHipScrew,
        quantity: ridgeTiles + hipTiles
      });
    }

    let longScrews = 0;

    if (variant.longScrew) {
      const hipMeters = lines.hip.reduce((acc, v) => acc + v, 0) / 100;
      const ridgeMeters = lines.ridge.reduce((acc, v) => acc + v, 0) / 100;
      const eaveMeters = lines.eave.reduce((acc, v) => acc + v, 0) / 100;
      const vergeMeters = lines.verge.reduce((acc, v) => acc + v, 0) / 100;

      longScrews = Math.ceil(
        (hipMeters + ridgeMeters + eaveMeters + vergeMeters) * 3.2
      );

      calculatedAccessories.push({
        ...variant.longScrew,
        quantity: longScrews
      });
    }

    if (variant.screw) {
      calculatedAccessories.push({
        ...variant.screw,
        quantity: Math.ceil((area / 10000) * 10 - longScrews)
      });
    }

    if (variant.stormBracket && ridge.externalProductCode === "25762568") {
      calculatedAccessories.push({
        ...variant.stormBracket,
        quantity: ridgeTiles * 2
      });
    }

    if (variant.finishingKit) {
      calculatedAccessories.push({
        ...variant.finishingKit,
        quantity: 1
      });
    }

    const selectedUnderlay = underlays.find(
      (u) => u.externalProductCode === underlay.underlay
    );

    const mapAccessory = (a) => ({
      image: a.image,
      description: a.name,
      externalProductCode: a.externalProductCode,
      packSize: a.packSize || "-",
      quantity: a.quantity || 0
    });

    return [
      {
        image: selectedUnderlay.image,
        description: selectedUnderlay.name,
        externalProductCode: selectedUnderlay.externalProductCode,
        packSize: "-",
        quantity: Math.ceil(
          area /
            (selectedUnderlay.length *
              (selectedUnderlay.width - selectedUnderlay.overlap))
        )
      },
      ...gutterProducts,
      ...(variant.eaveAccessories || []).map((a) =>
        mapAccessory({ ...a, quantity: eaveAccessoriesQuantity })
      ),
      ...calculatedAccessories,
      ...(variant.accessories || []).map(mapAccessory)
    ];
  });

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
                  <b>{l}:</b> {lines[l].map((v) => v.toFixed(2)).join(" | ")}
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
