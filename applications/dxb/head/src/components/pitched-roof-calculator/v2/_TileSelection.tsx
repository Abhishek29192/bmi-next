import {
  FormContext,
  Typography,
  withFormControl,
  WithFormControlProps
} from "@bmi-digital/components";
import { Grid } from "@mui/material";
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
  onChange: (value: string) => void;
  options: Tile[];
};

const TileSelectionRow = ({
  title,
  options,
  onChange,
  allTiles
}: TileSelectionRowProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);
  const { values } = useContext(FormContext);

  if (!options.length) {
    return null;
  }

  return (
    <FieldContainer title={title}>
      <Grid container spacing={3} justifyContent="center">
        {options.map((tile) => {
          const totalVariants = allTiles[tile.baseProduct.code].length;
          const colorsText = `${totalVariants} ${
            totalVariants === 1
              ? getMicroCopy(microCopy.TILE_SELECTION_COLOR)
              : getMicroCopy(microCopy.TILE_SELECTION_COLORS)
          }`;

          return (
            <Grid xs={6} md={4} lg={2} key={tile.code}>
              <CardRadioGroup.Item
                value={tile.baseProduct.code}
                title={tile.baseProduct.name || tile.name}
                imageSource={tile.mainImage}
                checked={values.tile === tile.baseProduct.code}
                onClick={() => {
                  pushEvent({
                    event: "dxb.button_click",
                    id: "rc-select-tile",
                    label: `${tile.name} - ${colorsText}`,
                    action: "selected"
                  });
                  onChange(tile.baseProduct.code);
                }}
              >
                <CardRadioGroup.Item.Paragraph>
                  {colorsText}
                </CardRadioGroup.Item.Paragraph>
              </CardRadioGroup.Item>
            </Grid>
          );
        })}
      </Grid>
    </FieldContainer>
  );
};

const categories: MainTileCategory[] = ["concrete", "clay", "metal"];

export type TileSelectionProps = WithFormControlProps<string> & {
  tiles: GroupedTiles;
};

const TileSelection = ({ tiles, onChange }: TileSelectionProps) => {
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
            onChange={onChange}
          />
        ))
      ) : (
        <Typography variant="h4" align="center">
          {getMicroCopy(microCopy.TILE_SELECTION_EMPTY)}
        </Typography>
      )}
    </div>
  );
};

export default withFormControl<TileSelectionProps, string>(TileSelection);
