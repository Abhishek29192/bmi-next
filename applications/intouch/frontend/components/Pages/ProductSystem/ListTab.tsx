import { gql } from "@apollo/client";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Product, System } from "@bmi/intouch-api-types";
import {
  Checkbox,
  TextField,
  Button,
  Form,
  Grid,
  Typography
} from "@bmi/components";
import classnames from "classnames";
import { SidePanel } from "../../../components/SidePanel";
import { FilterResult } from "../../FilterResult";
import { formatDate } from "../../../lib/utils";
import { useMarketContext } from "../../../context/MarketContext";
import {
  useUpdateProductMutation,
  useUpdateSystemMutation
} from "../../../graphql/generated/hooks";
import { ProductsAndSystemsQuery } from "../../../graphql/generated/operations";
import { ProductReport, SystemReport } from "../../Reports";
import layoutStyles from "../../Layout/styles.module.scss";
import AccessControl from "../../../lib/permissions/AccessControl";
import styles from "./styles.module.scss";
import { ProductTable } from "./ProductTable";

export type ProductsTabProps = {
  type: "product" | "system";
  items:
    | ProductsAndSystemsQuery["products"]
    | ProductsAndSystemsQuery["systems"];
  members?: ProductsAndSystemsQuery["systemMembers"];
};

const projectFilters = [
  { label: "Flat", isActive: false, attr: "FLAT" },
  { label: "Pitch", isActive: false, attr: "PITCHED" }
];

export const productDetailToShow = [
  { type: "text", key: "technology" },
  { type: "text", key: "bmiRef" },
  { type: "text", key: "brand" },
  { type: "textarea", key: "description" },
  { type: "text", key: "family" },
  { type: "bool", key: "published" },
  { type: "number", key: "maximumValidityYears" },
  { type: "date", key: "updatedAt" }
];

export const systemDetailToShow = [
  { type: "text", key: "technology" },
  { type: "text", key: "bmiRef" },
  { type: "textarea", key: "description" },
  { type: "bool", key: "published" },
  { type: "number", key: "maximumValidityYears" },
  { type: "date", key: "updatedAt" }
];

export const getValue = (t, type, value) => {
  switch (type) {
    case "text":
    case "textarea":
      return value;
    case "bool":
      return value === true ? t("published") : t("unpublished");
    case "date":
      return formatDate(value);
    case "number":
      return value ? value.toString() : "0";

    default:
      break;
  }
};

export const getSelectedItemValue = (name, value) => {
  const items = [...productDetailToShow, ...systemDetailToShow].find(
    ({ key }) => key === name
  );
  return items?.type === "number" ? (value ? parseInt(value) : 0) : value;
};

const ProductTab = ({ items: ssrItems, type, members }: ProductsTabProps) => {
  const { t } = useTranslation("admin-products-systems");
  const { market } = useMarketContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filterState, setFilterState] = useState({
    searched: null,
    filters: projectFilters
  });

  const [items, setItems] = useState<
    ProductsAndSystemsQuery["products"] | ProductsAndSystemsQuery["systems"]
  >(ssrItems);

  const [selectedItem, setSelectedItem] = useState<
    Partial<Product> | Partial<System>
  >();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const filteredProducts =
      members?.nodes
        .filter((x) => {
          return x.systemBmiRef === selectedItem?.bmiRef;
        })
        .map((member) => member.productByProductBmiRef) || [];

    setProducts(filteredProducts);
  }, [selectedItem]);

  const [udpateProduct] = useUpdateProductMutation({
    onCompleted: (data) => {
      setItems(data.updateProduct.query.products);
      setIsEditing(false);
    }
  });

  const [udpateSystem] = useUpdateSystemMutation({
    onCompleted: (data) => {
      setItems(data.updateSystem.query.systems);
      setIsEditing(false);
    }
  });

  const onItemChange = useCallback(
    (name, value) => {
      setSelectedItem((prev) => ({
        ...prev,
        [name]: getSelectedItemValue(name, value)
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
          marketId: market.id,
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
          marketId: market.id,
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
        renderFooter={() =>
          type === "product" ? (
            <ProductReport disabled={!items?.nodes?.length} />
          ) : (
            <SystemReport disabled={!items?.nodes?.length} />
          )
        }
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
              data-testid="product-tab-form"
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
                        {t("show")}
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
                {type === "product" && (
                  <AccessControl
                    dataModel="productsAdmin"
                    action="updateConfidentialFields"
                  >
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        rows={5}
                        name="family"
                        label={t("family")}
                        value={(selectedItem as Product).family || ""}
                        onChange={(value) => onItemChange("family", value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        rows={5}
                        name="brand"
                        label={t("brand")}
                        value={(selectedItem as Product).brand || ""}
                        onChange={(value) => onItemChange("brand", value)}
                      />
                    </Grid>
                  </AccessControl>
                )}
                <Grid item xs={12}>
                  <Checkbox
                    name="published"
                    label={t("published")}
                    checked={selectedItem.published || false}
                    onChange={(value) => onItemChange("published", value)}
                  />
                </Grid>
                <AccessControl
                  dataModel="productsAdmin"
                  action="updateConfidentialFields"
                >
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      rows={5}
                      name="maximumValidityYears"
                      label={t("maximumValidityYears")}
                      value={
                        selectedItem.maximumValidityYears
                          ? selectedItem.maximumValidityYears.toString()
                          : "0"
                      }
                      onChange={(value) =>
                        onItemChange("maximumValidityYears", value)
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </AccessControl>
              </Grid>
              <Form.ButtonWrapper>
                <Form.SubmitButton>Save</Form.SubmitButton>
              </Form.ButtonWrapper>
            </Form>
          ) : (
            <Grid container data-testid="product-tab-details">
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
                    {t("edit")}
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
              <Grid item xs={12}>
                {products.length > 0 && <ProductTable products={products} />}
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTab;

export const updateProduct = gql`
  mutation updateProduct($input: UpdateProductInput!, $marketId: Int) {
    updateProduct(input: $input) {
      query {
        products(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
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
  mutation updateSystem($input: UpdateSystemInput!, $marketId: Int) {
    updateSystem(input: $input) {
      query {
        systems(orderBy: NAME_ASC, condition: { marketId: $marketId }) {
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
