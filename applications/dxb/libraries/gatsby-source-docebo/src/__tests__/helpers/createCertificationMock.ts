import type { Certification } from "../../types";

export const createCertificationMock = (
  certification: Partial<Certification> = {}
): Certification => ({
  id_cert: 1,
  title: "certification title",
  description: "description",
  duration: "10h",
  allow_same_item: "0",
  duration_unit: "h",
  code: "certification-code",
  ...certification
});
