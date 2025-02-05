import {
  FormContext,
  withFormControl,
  WithFormControlProps
} from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import React, { useContext } from "react";
import { useSiteContext } from "../Site";
import { AnalyticsContext } from "./helpers/analytics";
import FieldContainer from "./subcomponents/_FieldContainer";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import { BaseProduct, GroupedTiles, Tile } from "./types";

const byName = (
  { name: firstTile }: BaseProduct,
  { name: secondTile }: BaseProduct
) => firstTile.localeCompare(secondTile);

type TileSelectionRowProps = {
  title?: string;
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
            <Grid
              xs={6}
              md={4}
              lg={2}
              key={tile.code}
              data-testid="base-tile-grid"
            >
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

export type TileSelectionProps = WithFormControlProps<string> & {
  tiles: GroupedTiles;
  tileMaterial?: string;
};

const TileSelection = ({
  tiles,
  tileMaterial,
  onChange
}: TileSelectionProps) => {
  const { getMicroCopy } = useSiteContext();
  const productCodes = Object.keys(tiles);

  const sortedOptions = productCodes
    // eslint-disable-next-line security/detect-object-injection
    .map((baseProductCode) => tiles[baseProductCode][0])
    .sort(byName);

  return (
    <div>
      {sortedOptions.length ? (
        <TileSelectionRow
          title={tileMaterial}
          allTiles={tiles}
          options={sortedOptions}
          onChange={(value) => onChange?.(value)}
        />
      ) : (
        <Typography variant="h4" align="center">
          {getMicroCopy(microCopy.TILE_SELECTION_EMPTY)}
        </Typography>
      )}
    </div>
  );
};

export default withFormControl<TileSelectionProps, string>(TileSelection);
