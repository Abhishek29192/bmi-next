import { SystemsApiResponse } from "./types";
import createSystem from "./SystemHelper";

const createSystemsApiResponse = (
  systemsApiResponse?: Partial<SystemsApiResponse>
): SystemsApiResponse => ({
  catalog: process.env.PIM_CATALOG_NAME || "",
  currentPage: 0,
  totalPageCount: 1,
  totalSystemsCount: 1,
  systems: [createSystem()],
  ...systemsApiResponse
});

export default createSystemsApiResponse;
