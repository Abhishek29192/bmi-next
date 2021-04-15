import React from "react";
import CardRadioGroup from "@bmi/card-radio-group";
import FieldContainer from "./subcomponents/_FieldContainer";
import tiles from "./samples/tiles";
import validateRangesAgainstPitchValues from "./helpers/validateRangesAgainstPitchValues";
import getPitchValues from "./helpers/getPitchValues";
import { RangeValue } from "./types";
import { DimensionsValues } from "./types/roof";

type TileSelectionRowProps = {
  title: string;
  dimensions: DimensionsValues;
  // TODO: Type when importing from Contentful
  select: (tile: object) => void;
  selected?: any;
  options: ReadonlyArray<any>;
};

type TileForValidation = {
  maxBattenGauge: RangeValue[];
  eaveGauge: RangeValue[];
  ridgeSpacing: RangeValue[];
};

const validateTileForPitchValues = (
  { maxBattenGauge, eaveGauge, ridgeSpacing }: TileForValidation,
  pitchValues: number[]
): boolean =>
  [maxBattenGauge, eaveGauge, ridgeSpacing].every((ranges) =>
    validateRangesAgainstPitchValues(ranges, pitchValues)
  );

const TileSelectionRow = ({
  title,
  options,
  select,
  selected,
  dimensions
}: TileSelectionRowProps) => {
  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = options
    // We don't want the user to be blocked in the next steps
    .filter(
      (tile) =>
        Boolean(tile.variants.length) &&
        validateTileForPitchValues(tile, pitchValues)
    )
    .sort(({ name: firstTile }, { name: secondTile }) =>
      firstTile.localeCompare(secondTile)
    );

  if (!filteredOptions.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup name="tile" defaultValue={(selected || {}).code}>
        {filteredOptions.map((tile) => (
          <CardRadioGroup.Item
            key={tile.code}
            value={tile.code}
            title={tile.name}
            imageSource={tile.image}
            onClick={() => select(tile)}
          >
            <CardRadioGroup.Item.Paragraph>
              {`${tile.variants.length} ${
                tile.variants.length === 1 ? "colour" : "colours"
              }`}
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

type TileCategory = {
  name: string;
  category: string;
};

const categories: TileCategory[] = [
  {
    name: "Concrete tiles",
    category: "concrete"
  },
  {
    name: "Clay tiles",
    category: "clay"
  },
  {
    name: "Metal tiles",
    category: "metal"
  }
];

type TileSelecionProps = Pick<
  TileSelectionRowProps,
  "select" | "selected" | "dimensions"
>;

const TileSelection = ({ select, selected, dimensions }: TileSelecionProps) => (
  <div>
    {categories.map(({ name, category }) => (
      <TileSelectionRow
        key={category}
        title={name}
        options={tiles.filter((tile) => tile.category === category)}
        {...{ select, selected, dimensions }}
      />
    ))}
  </div>
);

export default TileSelection;
