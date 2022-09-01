import { Typography } from "@bmi/components";
import React, { useContext } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useSiteContext } from "../../Site";
import { AnalyticsContext } from "../helpers/analytics";
import { BaseProduct, MainTileCategory } from "../types";
import { GroupedTiles, Tile } from "../types/v2";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import FieldContainer from "./subcomponents/_FieldContainer";

const byName = (
  { name: firstTile }: BaseProduct,
  { name: secondTile }: BaseProduct
) => firstTile.localeCompare(secondTile);

type TileSelectionRowProps = {
  title: string;
  allTiles: GroupedTiles;
  // TODO: Type when importing from Contentful
  selected?: string;
  options: Tile[];
};

const TileSelectionRow = ({
  title,
  options,
  selected,
  allTiles
}: TileSelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <CardRadioGroup
        name="tile"
        defaultValue={selected}
        isRequired
        fieldIsRequiredError={getMicroCopy(
          microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
        )}
      >
        {options.map((tile) => {
          const totalVariants = allTiles[tile.baseProduct.code].length;
          const colorsText = `${totalVariants} ${
            totalVariants === 1
              ? getMicroCopy(microCopy.TILE_SELECTION_COLOR)
              : getMicroCopy(microCopy.TILE_SELECTION_COLORS)
          }`;

          return (
            <CardRadioGroup.Item
              key={tile.code}
              value={tile.baseProduct.code}
              title={tile.baseProduct.name || tile.name}
              imageSource={tile.mainImage}
              onClick={() => {
                pushEvent({
                  event: "dxb.button_click",
                  id: "rc-select-tile",
                  label: `${tile.name} - ${colorsText}`,
                  action: "selected"
                });
              }}
            >
              <CardRadioGroup.Item.Paragraph>
                {colorsText}
              </CardRadioGroup.Item.Paragraph>
            </CardRadioGroup.Item>
          );
        })}
      </CardRadioGroup>
    </FieldContainer>
  );
};

const categories: MainTileCategory[] = ["concrete", "clay", "metal"];

export type TileSelecionProps = Pick<TileSelectionRowProps, "selected"> & {
  tiles: GroupedTiles;
};

const TileSelection = ({ selected, tiles }: TileSelecionProps) => {
  const { getMicroCopy } = useSiteContext();
  const productCodes = Object.keys(tiles);

  const sortedOptions = productCodes
    // eslint-disable-next-line security/detect-object-injection
    .map((baseProductCode) => tiles[baseProductCode][0])
    .sort(byName);

  return (
    <div>
      {sortedOptions.length ? (
        categories.map((category) => (
          <TileSelectionRow
            key={category}
            title={getMicroCopy(`tileSelection.categories.${category}`)}
            allTiles={tiles}
            options={sortedOptions.filter(
              (tile) => tile.category.toLowerCase() === category
            )}
            selected={selected}
          />
        ))
      ) : (
        <Typography variant="h4">
          {getMicroCopy(microCopy.TILE_SELECTION_EMPTY)}
        </Typography>
      )}
    </div>
  );
};

export default TileSelection;
