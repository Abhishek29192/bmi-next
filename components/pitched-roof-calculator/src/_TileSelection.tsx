import React, { useContext } from "react";
import Typography from "@bmi/typography";
import CardRadioGroup from "@bmi/card-radio-group";
import { getMicroCopy, MicroCopyContext } from "./helpers/microCopy";
import FieldContainer from "./subcomponents/_FieldContainer";
import validateRangesAgainstPitchValues from "./helpers/validateRangesAgainstPitchValues";
import getPitchValues from "./helpers/getPitchValues";
import { MainTile, MainTileCategory, RangeValue } from "./types";
import { DimensionsValues } from "./types/roof";
import { AnalyticsContext } from "./helpers/analytics";

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

const byName = ({ name: firstTile }, { name: secondTile }) =>
  firstTile.localeCompare(secondTile);

type TileSelectionRowProps = {
  title: string;
  // TODO: Type when importing from Contentful
  select: (tile: object) => void;
  selected?: any;
  options: ReadonlyArray<any>;
};

const TileSelectionRow = ({
  title,
  options,
  select,
  selected
}: TileSelectionRowProps) => {
  const copy = useContext(MicroCopyContext);
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup name="tile" defaultValue={(selected || {}).code}>
        {options.map((tile) => (
          <CardRadioGroup.Item
            key={tile.code}
            value={tile.code}
            title={tile.name}
            imageSource={tile.variants.slice().sort(byName)[0].image}
            onClick={() => {
              pushEvent({
                event: "dxb.button_click",
                id: "rc-select-tile",
                label: tile.name,
                action: "selected"
              });
              select(tile);
            }}
          >
            <CardRadioGroup.Item.Paragraph>
              {`${tile.variants.length} ${
                tile.variants.length === 1
                  ? getMicroCopy(copy, `tileSelection.color`)
                  : getMicroCopy(copy, `tileSelection.colors`)
              }`}
            </CardRadioGroup.Item.Paragraph>
          </CardRadioGroup.Item>
        ))}
      </CardRadioGroup>
    </FieldContainer>
  );
};

const categories: MainTileCategory[] = ["concrete", "clay", "metal"];

type TileSelecionProps = Pick<TileSelectionRowProps, "select" | "selected"> & {
  tiles: MainTile[];
  dimensions: DimensionsValues;
};

const TileSelection = ({
  select,
  selected,
  dimensions,
  tiles
}: TileSelecionProps) => {
  const copy = useContext(MicroCopyContext);

  const pitchValues = getPitchValues(dimensions);

  const filteredOptions = tiles
    // We don't want the user to be blocked in the next steps
    .filter(
      (tile) =>
        Boolean(tile.variants.length) &&
        validateTileForPitchValues(tile, pitchValues)
    )
    .sort(byName);

  return (
    <div>
      {filteredOptions.length ? (
        categories.map((category) => (
          <TileSelectionRow
            key={category}
            title={getMicroCopy(copy, `tileSelection.categories.${category}`)}
            options={filteredOptions.filter(
              (tile) => tile.category === category
            )}
            {...{ select, selected }}
          />
        ))
      ) : (
        <Typography variant="h4">
          {getMicroCopy(copy, "tileSelection.empty")}
        </Typography>
      )}
    </div>
  );
};

export default TileSelection;
