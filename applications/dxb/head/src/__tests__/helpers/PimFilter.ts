import { Filter } from "../../types/pim";

const createFilter = (filter?: Partial<Filter>): Filter => ({
  filterCode: "appearanceAttributes.colour",
  name: "Filter name",
  value: "Filter value",
  unit: "unit",
  code: "filter code",
  groupLabel: "filter group",
  parentFilterCode: "parent filter code",
  isCategory: true,
  ...filter
});

export default createFilter;
