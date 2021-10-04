import { EsSystem } from "../../transformSystems";
import createImage from "./ImageHelper";

export const createEsSystem = (esSystem?: Partial<EsSystem>): EsSystem => ({
  approvalStatus: "approved",
  brand: "BMI-brand-code",
  type: "systemWsDTO",
  images: [createImage()],
  code: "code",
  name: "name",
  shortDescription: "Short description",
  ...esSystem
});
