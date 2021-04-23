import React, { useMemo, useState } from "react";
import QuantityTable from "@bmi/quantity-table";
import Typography from "@bmi/typography";
import FieldContainer from "./subcomponents/_FieldContainer";
import { battenCalc, surface } from "./calculation/calculate";
import underlays from "./samples/underlays";
import { guttering as gutteringList, hooks } from "./samples/guttering";
import { VergeOption, LengthBasedProduct } from "./types";
import { Measurements } from "./types/roof";

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

const getReduceDivideAndCeil = (by, subtractBeforeDivision = 0) => (acc, v) =>
  acc + Math.ceil((v.length - subtractBeforeDivision) / by);

const getLengthOrZero = (
  lengthBasedProduct: LengthBasedProduct,
  shouldReturn = true
) => (shouldReturn ? lengthBasedProduct && lengthBasedProduct.length : 0);

const getProductItemFromSchema = ({
  name,
  packSize = "-",
  quantity = 0,
  ...rest
}: {
  image: string;
  name: string;
  externalProductCode: string;
  packSize?: string;
  quantity?: number;
}) => ({
  ...rest,
  description: name,
  packSize,
  quantity
});

const Results = ({
  isDebugging,
  measurements: { faces, lines, area },
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
  const [tileRows, setTileRows] = useState(() => {
    let vergeOption: VergeOption;

    if (tileOptions.verge && tileOptions.verge !== "none") {
      vergeOption = variant.vergeOptions.find(
        ({ name }) => name === tileOptions.verge
      );
    }

    const facesBattens = faces.map((face) => ({
      battens: battenCalc(face.vertices, [face.pitch], variant),
      sides: face.sides,
      subtract: face.subtract
    }));
    const faceTiles = facesBattens.map(({ battens, sides, subtract }) =>
      surface(
        battens,
        sides,
        variant,
        variant.halfTile,
        vergeOption && vergeOption.type === "TILE" ? vergeOption : undefined,
        subtract
      )
    );

    const result = [
      {
        ...getProductItemFromSchema(variant),
        quantity: faceTiles.reduce((acc, { quantity }) => acc + quantity, 0)
      },
      ...(variant.halfTile
        ? [
            {
              ...getProductItemFromSchema(variant.halfTile),
              quantity: faceTiles.reduce(
                (acc, { half: { quantity } }) => acc + quantity,
                0
              )
            }
          ]
        : []),
      ...(vergeOption && vergeOption.type === "TILE"
        ? [
            {
              ...getProductItemFromSchema(vergeOption.left),
              quantity: faceTiles.reduce(
                (acc, { cloakedVerge: { left } }) => acc + left,
                0
              )
            },
            {
              ...getProductItemFromSchema(vergeOption.right),
              quantity: faceTiles.reduce(
                (acc, { cloakedVerge: { right } }) => acc + right,
                0
              )
            },
            {
              ...getProductItemFromSchema(vergeOption.halfLeft),
              quantity: faceTiles.reduce(
                (acc, { cloakedVerge: { halfLeft } }) => acc + halfLeft,
                0
              )
            },
            {
              ...getProductItemFromSchema(vergeOption.halfRight),
              quantity: faceTiles.reduce(
                (acc, { cloakedVerge: { halfRight } }) => acc + halfRight,
                0
              )
            }
          ]
        : [])
    ].filter((v) => v && !!v.quantity);

    if (vergeOption && vergeOption.type === "METAL_FLUSH") {
      const left = lines.leftVerge.reduce(
        getReduceDivideAndCeil(
          vergeOption.left.length,
          vergeOption.leftStart.length
        ),
        0
      );
      const right = lines.rightVerge.reduce(
        getReduceDivideAndCeil(
          vergeOption.right.length,
          vergeOption.rightStart.length
        ),
        0
      );
      const leftStart = lines.leftVerge.length;
      const rightStart = lines.rightVerge.length;

      result.push(
        {
          ...getProductItemFromSchema(vergeOption.left),
          quantity: left
        },
        {
          ...getProductItemFromSchema(vergeOption.right),
          quantity: right
        },
        {
          ...getProductItemFromSchema(vergeOption.leftStart),
          quantity: leftStart
        },
        {
          ...getProductItemFromSchema(vergeOption.rightStart),
          quantity: rightStart
        }
      );
    }

    const valley = [
      variant.valleyMetalFlushStart && {
        ...getProductItemFromSchema(variant.valleyMetalFlushStart),
        quantity: lines.valley.filter(({ start }) => !!start).length
      },
      variant.valleyMetalFlushEnd && {
        ...getProductItemFromSchema(variant.valleyMetalFlushEnd),
        quantity: lines.valley.filter(({ end }) => !!end).length
      },
      variant.valleyMetalFlushTop && {
        ...getProductItemFromSchema(variant.valleyMetalFlushTop),
        quantity: lines.valley.filter(({ top }) => !!top).length / 2
      },
      variant.valleyMetalFlushDormerStart && {
        ...getProductItemFromSchema(variant.valleyMetalFlushDormerStart),
        quantity: lines.valley.filter(({ dormerStart }) => !!dormerStart).length
      },
      variant.valleyMetalFlush && {
        ...getProductItemFromSchema(variant.valleyMetalFlush),
        quantity: lines.valley.reduce(
          (acc, { length, start, end, top, dormerStart }) =>
            acc +
            Math.ceil(
              (length -
                (getLengthOrZero(variant.valleyMetalFlushStart, start) +
                  getLengthOrZero(variant.valleyMetalFlushEnd, end) +
                  getLengthOrZero(variant.valleyMetalFlushTop, top) +
                  getLengthOrZero(
                    variant.valleyMetalFlushDormerStart,
                    dormerStart
                  ))) /
                variant.valleyMetalFlush.length
            ),
          0
        )
      }
    ].filter((v) => v && !!v.quantity);

    result.push(...valley);

    return result.filter(({ quantity }) => quantity > 0);
  });

  const { ridge, ridgeTiles, hipTiles } = useMemo(() => {
    const ridge = tileOptions.ridge
      ? variant.ridgeOptions.find(
          (i) => i.externalProductCode === tileOptions.ridge
        )
      : variant.ridgeOptions[0];

    const ridgeTiles = lines.ridge.reduce(
      (acc, v) => acc + Math.ceil(v.length / ridge.length),
      0
    );

    const hipTiles = lines.hip.reduce(
      (acc, v) => acc + Math.ceil(v.length / variant.hip.length),
      0
    );

    return { ridge, ridgeTiles, hipTiles };
  }, []);

  const [fixingRows, setFixingRows] = useState(() =>
    [
      {
        ...getProductItemFromSchema(ridge),
        quantity: ridgeTiles + (variant.hip.code === ridge.code ? hipTiles : 0)
      },
      ...(variant.hip.code !== ridge.code
        ? [
            {
              ...getProductItemFromSchema(variant.hip),
              quantity: hipTiles
            }
          ]
        : [])
    ].filter(({ quantity }) => quantity > 0)
  );

  const [ventilationRows, setVentilationRows] = useState(() => [
    ...variant.ventilationHoodOptions
      .filter((v) => tileOptions.ventilation.includes(v.externalProductCode))
      .map((p) => ({ ...p, quantity: 1 }))
  ]);

  const [accessoryRows, setAccessoryRows] = useState(() => {
    const calculateForEaves = (length) =>
      lines.eave.reduce((acc, v) => acc + Math.ceil(v.length / length), 0);

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
          ...getProductItemFromSchema(gutteringVariant),
          quantity: calculateForEaves(gutteringVariant.length)
        },
        {
          ...getProductItemFromSchema(hook),
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
      const hipMeters = lines.hip.reduce((acc, v) => acc + v.length, 0) / 100;
      const ridgeMeters =
        lines.ridge.reduce((acc, v) => acc + v.length, 0) / 100;
      const eaveMeters = lines.eave.reduce((acc, v) => acc + v.length, 0) / 100;
      const leftVergeMeters =
        lines.leftVerge.reduce((acc, v) => acc + v.length, 0) / 100;
      const rightVergeMeters =
        lines.rightVerge.reduce((acc, v) => acc + v.length, 0) / 100;

      longScrews = Math.ceil(
        (hipMeters +
          ridgeMeters +
          eaveMeters +
          leftVergeMeters +
          rightVergeMeters) *
          3.2
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

    return [
      {
        ...getProductItemFromSchema(selectedUnderlay),
        quantity: Math.ceil(
          area /
            (selectedUnderlay.length *
              (selectedUnderlay.width - selectedUnderlay.overlap))
        )
      },
      ...gutterProducts,
      ...(variant.eaveAccessories || []).map((a) =>
        getProductItemFromSchema({ ...a, quantity: eaveAccessoriesQuantity })
      ),
      ...calculatedAccessories,
      ...(variant.accessories || []).map(getProductItemFromSchema)
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
