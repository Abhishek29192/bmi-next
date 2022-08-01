import { Filter } from "./types";

const createFilter = (filter?: Partial<Filter>): Filter => ({
  filterCode: "appearanceAttributes.colour",
  name: "Colour",
  value: "Shadow Black",
  code: "code",
  groupLabel: "Colour",
  parentFilterCode: "",
  unit: "symbol",
  isCategory: false,
  ...filter
});

export default createFilter;
