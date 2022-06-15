import { Brand } from "../../types/pim";

const createBrand = (brand?: Partial<Brand>): Brand => ({
  code: "brand-code",
  name: "brand-name",
  logo: "http://brand-logo",
  ...brand
});

export default createBrand;
