import React, { useContext } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import getPitchValues from "../helpers/getPitchValues";
import validateRangesAgainstPitchValues from "../helpers/validateRangesAgainstPitchValues";
import { RangeValue } from "../types";
import { DimensionsValues } from "../types/roof";
import { MainTile, MainTileVariant } from "../types/v2";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

type VariantSelectionRowProps = {
  title: string;
  dimensions: DimensionsValues;
  select: (tile: MainTileVariant) => void;
  selected?: MainTileVariant;
  options: ReadonlyArray<MainTileVariant>;
  tile: MainTile;
};

type TileForValidation = {
  maxBattenGauge: RangeValue[];
  eaveGauge: RangeValue[];
  ridgeSpacing: RangeValue[];
};

const validateVariantForPitchValues = (
  { maxBattenGauge, eaveGauge, ridgeSpacing }: TileForValidation,
  tile: TileForValidation,
  pitchValues: number[]
): boolean => {
  const {
    maxBattenGauge: mainTileMaxBattenGauge,
    eaveGauge: mainTileEaveGauge,
    ridgeSpacing: mainTileRidgeSpacing
  } = tile;
  return [
    maxBattenGauge.length ? maxBattenGauge : mainTileMaxBattenGauge,
    eaveGauge.length ? eaveGauge : mainTileEaveGauge,
    ridgeSpacing.length ? ridgeSpacing : mainTileRidgeSpacing
  ].every((ranges) => validateRangesAgainstPitchValues(ranges, pitchValues));
};

const VariantSelectionRow = ({
  title,
  options,
  select,
  selected,
  dimensions,
  tile
}: VariantSelectionRowProps) => {
  const pushEvent = useContext(AnalyticsContext);
  const { getMicroCopy } = useSiteContext();

  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = options
    // We don't want the user to be blocked in the next steps
    .filter((variant) =>
      validateVariantForPitchValues(variant, tile, pitchValues)
    )
    .sort(({ color: firstVariant }, { color: secondVariant }) =>
      firstVariant.localeCompare(secondVariant)
    );

  if (!filteredOptions.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup
        name="variant"
        defaultValue={(selected || {}).externalProductCode}
      >
        {filteredOptions.map((tile) => (
          <CardRadioGroup.Item
            key={tile.externalProductCode}
            value={tile.externalProductCode}
            title={tile.color}
            imageSource={tile.image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-tile-colour",
                label: `${tile.color} - ${getMicroCopy(
                  microCopy.CALCULATOR_NOBB_LABEL
                )}: ${tile.externalProductCode}`,
                action: "selected"
              });
              select(tile);
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              {getMicroCopy(microCopy.CALCULATOR_NOBB_LABEL)}:{" "}
              {tile.externalProductCode}
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

export type VariantSelecionProps = Pick<
  VariantSelectionRowProps,
  "select" | "selected" | "dimensions" | "tile"
>;

const VariantSelection = ({
  select,
  selected,
  dimensions,
  tile
}: VariantSelecionProps) => (
  <div>
    <VariantSelectionRow
      title={tile.name}
      options={tile.variants}
      {...{ select, selected, dimensions, tile }}
    />
  </div>
);

export default VariantSelection;
