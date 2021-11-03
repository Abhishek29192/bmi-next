import { gql } from "@apollo/client";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Product, System } from "@bmi/intouch-api-types";
import Checkbox from "@bmi/checkbox";
import TextField from "@bmi/text-field";
import Button from "@bmi/button";
import Form from "@bmi/form";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import classnames from "classnames";
import { SidePanel } from "../../../components/SidePanel";
import { FilterResult } from "../../FilterResult";
import { formatDate } from "../../../lib/utils";
import {
  useUpdateProductMutation,
  useUpdateSystemMutation
} from "../../../graphql/generated/hooks";
import { ProductsAndSystemsQuery } from "../../../graphql/generated/operations";
import layoutStyles from "../../Layout/styles.module.scss";
import styles from "./styles.module.scss";

type ProductsTabProps = {
  type: "product" | "system";
  items:
    | ProductsAndSystemsQuery["products"]
    | ProductsAndSystemsQuery["systems"];
};

const projectFilters = [
  { label: "Flat", isActive: false, attr: "FLAT" },
  { label: "Pitch", isActive: false, attr: "PITCHED" }
];

const productDetailToShow = [
  { type: "text", key: "technology" },
  { type: "text", key: "bmiRef" },
  { type: "text", key: "brand" },
  { type: "textarea", key: "description" },
  { type: "text", key: "family" },
  { type: "bool", key: "published" },
  { type: "text", key: "maximumValidityYears" },
  { type: "date", key: "updatedAt" }
];

const systemDetailToShow = [
  { type: "text", key: "technology" },
  { type: "text", key: "bmiRef" },
  { type: "textarea", key: "description" },
  { type: "bool", key: "published" },
  { type: "text", key: "maximumValidityYears" },
  { type: "date", key: "updatedAt" }
];

const getValue = (t, type, value) => {
  switch (type) {
    case "text":
    case "textarea":
      return value;
    case "bool":
      return value === true ? t("published") : t("unpublished");
    case "date":
      return formatDate(value);

    default:
      break;
  }
};

const ProductTab = ({ items: ssrItems, type }: ProductsTabProps) => {
  const { t } = useTranslation("admin-products-systems");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filterState, setFilterState] = useState({
    searched: null,
    filters: projectFilters
  });

  const [items, setItems] =
    useState<
      ProductsAndSystemsQuery["products"] | ProductsAndSystemsQuery["systems"]
    >(ssrItems);

  const [selectedItem, setSelectedItem] =
    useState<Partial<Product> | Partial<System>>();

  const [udpateProduct] = useUpdateProductMutation({
    onCompleted: (data) => {
      setItems(data.updateProduct.query.products);
    }
  });

  const [udpateSystem] = useUpdateSystemMutation({
    onCompleted: (data) => {
      setItems(data.updateSystem.query.systems);
    }
  });

  const onItemChange = useCallback(
    (name, value) => {
      setSelectedItem((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    [setSelectedItem]
  );

  const onProductSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const { id, __typename, ...rest } = selectedItem;
      udpateProduct({
        variables: {
          input: {
            id,
            patch: {
              ...rest
            }
          }
        }
      });
    },
    [udpateProduct, selectedItem]
  );

  const onSystemSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const { id, __typename, ...rest } = selectedItem;
      udpateSystem({
        variables: {
          input: {
            id,
            patch: {
              ...rest
            }
          }
        }
      });
    },
    [udpateSystem, selectedItem]
  );

  const onSearch = (value: string): void => {
    setFilterState((prev) => ({
      ...prev,
      searched: value.toLowerCase()
    }));
  };

  const onFilterClick = (value) => {
    setFilterState((prev) => ({
      ...prev,
      filters: prev.filters.map((item) =>
        value.attr === item.attr ? { ...item, isActive: !item.isActive } : item
      )
    }));
  };

  useEffect(() => {
    const { searched, filters } = filterState;

    const activeFilters = filters
      .filter(({ isActive }) => isActive)
      .map(({ attr }) => attr?.toLowerCase());

    setItems((prevStatus) => ({
      ...prevStatus,
      nodes: (ssrItems?.nodes as any[]).filter(
        ({ technology, bmiRef, name }) => {
          let isSearched = true;
          let isFiltered = true;

          if (activeFilters.length > 0) {
            isFiltered = activeFilters.includes(technology?.toLowerCase());
          }

          if (filterState.searched) {
            isSearched =
              (technology &&
                technology?.toLowerCase().indexOf(searched) !== -1) ||
              (bmiRef && bmiRef?.toLowerCase().indexOf(searched) !== -1) ||
              (name && name?.toLowerCase().indexOf(searched) !== -1);
          }

          return isFiltered && isSearched;
        }
      )
    }));
  }, [filterState]);

  return (
    <div
      className={classnames(layoutStyles.searchPanelWrapper, styles.container)}
    >
      <SidePanel
        key="list-products"
        searchLabel={t("sidePanel.search.label")}
        onSearchFilterChange={onSearch}
        filters={filterState.filters}
        filterClick={onFilterClick}
        noResultLabel={t("sidePanel.search.noResult")}
      >
        {(items?.nodes as any)?.map((item: any, index: number) => (
          <div key={`product-${index}`} onClick={(e) => setSelectedItem(item)}>
            <FilterResult label={item.bmiRef} key={item.bmiRef}>
              <Typography>{item.name}</Typography>
            </FilterResult>
          </div>
        ))}
      </SidePanel>
      {selectedItem && (
        <div className={styles.detailPanel}>
          {isEditing ? (
            <Form
              key={`form-${type}`}
              onSubmit={type === "product" ? onProductSubmit : onSystemSubmit}
              style={{ width: "100%" }}
            >
              <Grid container>
                <Grid xs={12} item>
                  <Grid
                    xs={12}
                    container
                    direction="row"
                    alignItems="flex-start"
                    justify="space-between"
                  >
                    <Grid item xs={10}>
                      <Typography
                        variant="h4"
                        hasUnderline
                        style={{ marginBottom: "15px" }}
                      >
                        {t(`form.${type}Title`)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        className={styles.editBtn}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {!isEditing ? t("edit") : t("show")}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label={t("name")}
                    value={selectedItem.name || ""}
                    onChange={(value) => onItemChange("name", value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    isTextArea
                    rows={5}
                    name="description"
                    label={t("description")}
                    value={selectedItem.description || ""}
                    onChange={(value) => onItemChange("description", value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Checkbox
                    name="published"
                    label={t("published")}
                    checked={selectedItem.published || false}
                    onChange={(value) => onItemChange("published", value)}
                  />
                </Grid>
              </Grid>
              <Form.ButtonWrapper>
                <Form.SubmitButton>Save</Form.SubmitButton>
              </Form.ButtonWrapper>
            </Form>
          ) : (
            <Grid container>
              <Grid
                item
                xs={12}
                container
                spacing={0}
                direction="row"
                alignItems="flex-start"
                justify="space-between"
                style={{ display: "flex" }}
              >
                <Grid item xs={10}>
                  <Typography
                    variant="h3"
                    hasUnderline
                    style={{ marginBottom: "15px" }}
                  >
                    {selectedItem.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className={styles.editBtn}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {!isEditing ? t("edit") : t("show")}
                  </Button>
                </Grid>
              </Grid>
              {(type === "product"
                ? productDetailToShow
                : systemDetailToShow
              ).map(({ key, type }) => (
                <Grid key={key} item xs={12}>
                  <Typography component="h6" variant="h6">
                    {t(key)}
                  </Typography>
                  <Typography variant="body1">
                    {getValue(t, type, selectedItem[`${key}`])}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTab;

export const updateProduct = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      query {
        products(orderBy: NAME_ASC) {
          nodes {
            id
            name
            brand
            family
            bmiRef
            updatedAt
            published
            technology
            description
            maximumValidityYears
          }
        }
      }
    }
  }
`;

export const updateSystem = gql`
  mutation updateSystem($input: UpdateSystemInput!) {
    updateSystem(input: $input) {
      query {
        systems(orderBy: NAME_ASC) {
          nodes {
            id
            name
            bmiRef
            updatedAt
            published
            technology
            description
            maximumValidityYears
          }
        }
      }
    }
  }
`;
