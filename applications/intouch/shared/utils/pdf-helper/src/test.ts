import { getGuaranteeTypeData } from "./dummy-data";
import GuaranteePdf from "./guarantee-pdf";

const start = async () => {
  const result = await getGuaranteeTypeData();

  const guaranteePdf = new GuaranteePdf(result);

  guaranteePdf.createPdf("guarantee_example");
};

start();
