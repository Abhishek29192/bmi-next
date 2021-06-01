import { Address } from "@bmi/intouch-api-types";
import { emptyNodes } from "./utils/graphileNodes";

const mockAddressBoilerplate = {
  createdAt: Date.now(),
  updatedAt: Date.now(),
  companiesByRegisteredAddressId: emptyNodes,
  companiesByTradingAddressId: emptyNodes,
  projectsByBuildingOwnerAddressId: emptyNodes,
  projectsBySiteAddressId: emptyNodes
};

export const mockCompanyAddress: Address = {
  id: 1,
  nodeId: "",
  firstLine: "23 Fairwell Street",
  secondLine: "Somewhere",
  town: "Fantatown",
  country: "Fantaland",
  postcode: "12300-002",
  ...mockAddressBoilerplate
};

export const mockSiteAddress: Address = {
  id: 2,
  nodeId: "",
  firstLine: "4719 Farwell Road",
  secondLine: "Tennyson",
  town: "Losino-Petrovskiy",
  country: "Russia",
  postcode: "19570-005",
  ...mockAddressBoilerplate
};

export const mockBuildingOwnerAddress: Address = {
  id: 3,
  nodeId: "",
  firstLine: "8 Boyd Terrace",
  secondLine: "Ohio",
  town: "Flórina",
  country: "Greece",
  postcode: "19570-035",
  ...mockAddressBoilerplate
};
