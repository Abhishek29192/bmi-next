import React, { useState } from "react";
import { gql } from "@apollo/client";
import { Product, Technology } from "@bmi/intouch-api-types";
import { useSearchProductsLazyQuery } from "../../../graphql/generated/hooks";
import {
  WizardAutoComplete,
  WizardAutoCompleteOptions,
  WizardAutoCompleteItem
} from "../WizardAutoComplete";
import { useWizardContext } from "../WizardContext";
import { WizardProductDetailCard } from "../WizardProductDetailCard";

const SelectProducts = () => {
  const { data, setData } = useWizardContext();

  const [products, setProducts] = useState<Product[]>();

  const [productOptions, setProductOptions] =
    useState<WizardAutoCompleteOptions>({
      totalCount: 0,
      items: []
    });
  const [productsSearch] = useSearchProductsLazyQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: ({ searchProducts: { totalCount, nodes } }) => {
      setProducts(nodes as Product[]);
      const products = {
        totalCount,
        items: nodes.map(({ id, name, description }) => ({
          id,
          name,
          description
        }))
      };
      setProductOptions(products);
    }
  });
  const [value, setValue] = useState<WizardAutoCompleteItem>(null);

  const handleChange = (value: WizardAutoCompleteItem) => {
    const selectedProduct = value
      ? products.find((product) => product.id === value.id)
      : null;
    setData({
      ...data,
      product: selectedProduct
    });

    setValue(value);
  };
  const handleInput = async (input: string) => {
    setProductOptions({
      totalCount: 0,
      items: []
    });
    if (input.length > 0) {
      productsSearch({
        variables: {
          query: input,
          technology: data.guaranteeType.technology as Technology
        }
      });
    }
  };

  return (
    <div>
      <WizardAutoComplete
        options={productOptions}
        value={value}
        onChange={handleChange}
        onInputChange={handleInput}
      />
      {data.product && (
        <WizardProductDetailCard
          name={data.product.name}
          description={data.product.description}
          brand={data.product.brand}
          family={data.product.family}
          onDeleteClick={() => {
            handleChange(null);
          }}
        />
      )}
    </div>
  );
};

export const GET_GUARANTEE_PRODUCTS = gql`
  query searchProducts($query: String!, $technology: Technology!) {
    searchProducts(query: $query, technology: $technology, first: 20) {
      totalCount
      nodes {
        id
        technology
        name
        description
        published
        brand
        family
        bmiRef
      }
    }
  }
`;

export default SelectProducts;
