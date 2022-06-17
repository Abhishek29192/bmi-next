import { Brand } from "./types";

const createBrand = (brand?: Partial<Brand>): Brand => ({
  code: "code",
  name: "name",
  logo: "http://localhost:8000",
  ...brand
});

export default createBrand;
