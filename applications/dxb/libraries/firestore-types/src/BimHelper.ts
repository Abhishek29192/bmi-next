import { BIM } from "./types";

const createBim = (bim?: Partial<BIM>): BIM => ({
  name: "bim",
  url: "http://localhost:8000",
  ...bim
});

export default createBim;
