import { Filter } from "@bmi/components";
import { Filter as FirestoreFilter } from "../../types/pim";

export const createBrandFilterCriteria = (
  partialProps?: Partial<Filter>
): Filter => {
  return {
    filterCode: "Brand",
    label: "Brand",
    name: "Brand",
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
    filterCode: "ProductFamily",
    label: "ProductFamily",
    name: "ProductFamily",
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
    filterCode: "contentfulAssetType",
    label: "contentfulAssetType",
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

export const createFirestoreFilter = (
  filter?: Partial<FirestoreFilter>
): FirestoreFilter => ({
  filterCode: "Category",
  code: "category-code",
  name: "category-name",
  parentFilterCode: "category-parent-category-code",
  unit: "",
  value: "",
  groupLabel: "",
  isCategory: true,
  ...filter
});
