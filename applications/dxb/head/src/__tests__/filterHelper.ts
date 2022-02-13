import { Filter } from "@bmi-digital/components/filters";

export const createBrandFilterCriteria = (
  partialProps?: Partial<Filter>
): Filter => {
  return {
    label: "filterLabels.brand",
    name: "brand",
    options: [
      { label: "AeroDek", value: "AeroDek" },
      { label: "Icopal", value: "Icopal" },
      { label: "BMI Components", value: "BMI Components" }
    ],
    value: ["AeroDek"],
    ...partialProps
  };
};

export const createProductFamilyFilterCriteria = (
  partialProps?: Partial<Filter>
): Filter => {
  return {
    label: "filterLabels.productFamily",
    name: "productFamily",
    options: [
      { label: "AeroDek Quadro Plus", value: "AeroDek_Quadro_Plus" },
      { label: "Divoroll Prima", value: "Divoroll_Prima" },
      { label: "Fonda Geoplex", value: "Fonda_Geoplex" }
    ],
    value: ["AeroDek_Quadro_Plus"],
    ...partialProps
  };
};

export const createAssetTypeFilterCriteria = (
  partialProps?: Partial<Filter>
): Filter => {
  return {
    label: "filterLabels.assetType",
    name: "contentfulAssetType",
    options: [
      { label: "Assembly Instructions", value: "AINS" },
      { label: "CE Certification", value: "CEC" },
      { label: "Certificates", value: "CERT" }
    ],
    value: ["AeroDek_Quadro_Plus"],
    ...partialProps
  };
};
