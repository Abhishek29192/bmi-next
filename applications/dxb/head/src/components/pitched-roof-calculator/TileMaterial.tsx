/* eslint-disable security/detect-object-injection */
import { FormContext, withFormControl } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import React, { useContext } from "react";
import type { Product } from "@bmi/elasticsearch-types";
import { ESResponse } from "../../types/elasticsearch";
import { queryElasticSearch } from "../../utils/elasticSearch";
import { useSiteContext } from "../Site";
import { getTileFilters } from "./helpers/esQueries";
import FieldContainer from "./subcomponents/_FieldContainer";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";
import type { Aggregations } from "../../utils/elasticSearch";
import type { WithFormControlProps } from "@bmi-digital/components/form";

export type TilesGroupedByMaterial = {
  [material: string]: {
    product: Product;
    count: number;
  };
};

export type TileMaterialProps = WithFormControlProps<string> & {
  tilesGroupedByMaterial: TilesGroupedByMaterial | undefined;
};

type AggregationBucket = {
  key: [string, string, string];
  doc_count: number;
  key_as_string: string;
};

export const getTileMaterials = async (
  pitches: number[]
): Promise<TilesGroupedByMaterial | undefined> => {
  try {
    const res: ESResponse<
      Product,
      Aggregations<AggregationBucket>
    > = await queryElasticSearch(
      {
        query: {
          bool: getTileFilters(pitches)
        },
        collapse: {
          field: "baseProduct.code.keyword"
        },
        aggs: {
          material: {
            multi_terms: {
              size: 100,
              terms: [
                {
                  field: "GENERALINFORMATION$MATERIALS.name.keyword"
                },
                {
                  field: "baseProduct.code.keyword"
                }
              ]
            }
          }
        },
        size: 100
      },
      process.env.NEXT_PUBLIC_ES_INDEX_NAME_PRODUCTS!
    );

    if (res?.hits?.hits?.length) {
      const products = res.hits.hits.map((product) => product._source);
      const groupedProductsByMaterial = groupProductsByMaterial(
        products,
        res.aggregations
      );
      return groupedProductsByMaterial;
    }
  } catch (err) {
    console.error(err);
  }
};

const groupProductsByMaterial = (
  products: Product[],
  aggregations: Aggregations<AggregationBucket>
) => {
  return aggregations.material.buckets.reduce<TilesGroupedByMaterial>(
    (acc, current) => {
      const [material, productCode] = current.key;
      const product = products.find(
        (product) => product.baseProduct.code === productCode
      ) as Product;

      if (acc[material]) {
        acc[material].count++;
        return acc;
      }

      return {
        ...acc,
        [material]: {
          product: product,
          count: 1
        }
      };
    },
    {}
  );
};

const TileMaterial = ({
  tilesGroupedByMaterial,
  onChange
}: TileMaterialProps) => {
  const { getMicroCopy } = useSiteContext();
  const { values } = useContext(FormContext);

  return tilesGroupedByMaterial ? (
    <FieldContainer>
      <Grid container spacing={3} justifyContent="center">
        {Object.entries(tilesGroupedByMaterial).map(([material, options]) => (
          <Grid
            xs={6}
            md={4}
            lg={2}
            key={replaceSpaces(material)}
            data-testid="tile-material-grid"
          >
            <CardRadioGroup.Item
              value={material}
              checked={values.tileMaterial === material}
              title={material}
              imageSource={options.product.mainImage}
              onChange={() => onChange?.(material)}
              data-testid={`${replaceSpaces(material)}-roof-tile`}
            >
              <CardRadioGroup.Item.Paragraph>
                {getMicroCopy(
                  options.count === 1
                    ? microCopy.TILE_MATERIAL_SELECTION_CATEGORY
                    : microCopy.TILE_MATERIAL_SELECTION_CATEGORIES,
                  { count: options.count.toString() }
                )}
              </CardRadioGroup.Item.Paragraph>
            </CardRadioGroup.Item>
          </Grid>
        ))}
      </Grid>
    </FieldContainer>
  ) : (
    <Typography variant="h4" align="center">
      {getMicroCopy(microCopy.TILE_MATERIAL_SELECTION_EMPTY)}
    </Typography>
  );
};

export default withFormControl<TileMaterialProps, string>(TileMaterial);
