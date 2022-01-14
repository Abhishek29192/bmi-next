import {
  Calculators,
  CalculatorDataProduct,
  ProductReference
} from "../types/CalculatorData";
import { getProduct } from "../FlatRoofCalculator";
import { ResultProduct } from "../types/ResultProduct";
import { FormValues } from "../types/FormValues";

export const calculateQuantities = (
  systemName: string,
  values: FormValues,
  calculators: Calculators,
  products: CalculatorDataProduct[]
): ResultProduct[] => {
  // eslint-disable-next-line security/detect-object-injection
  const calculations = calculators[systemName];

  if (!calculations) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(`Couldn't find the calculator named: ${systemName}`);
    }
    return [];
  }

  const { COVERAGE, UPSTAND, KERB, MISCELLANEOUS } = calculations;

  const {
    fieldArea = 0,
    upstandHeight = 0,
    upstandLength = 0,
    kerbHeight = 0,
    kerbLength = 0,
    detailHeight1 = 0,
    detailLength1 = 0,
    detailHeight2 = 0,
    detailLength2 = 0
  } = values;

  // TODO: confirm units
  const upstandArea = (upstandHeight * upstandLength) / 1000;
  const kerbArea = (kerbHeight * kerbLength) / 1000;
  const detailArea =
    (detailHeight1 * detailLength1) / 1000 +
    (detailHeight2 * detailLength2) / 1000;

  const steps: Array<[ProductReference[], number]> = [
    [COVERAGE, fieldArea],
    [UPSTAND, upstandArea],
    [KERB, kerbArea],
    [MISCELLANEOUS, detailArea]
  ];

  const productsToBuy = new Map<
    string,
    CalculatorDataProduct & {
      buildUp: string;
      category: string;
      quantity: number;
    }
  >();

  for (const [productReferences, area] of steps) {
    for (const productReference of productReferences) {
      const { buildUp, category } = productReference;
      const product = getProduct(productReference, values, products);

      if (product) {
        const rowId = `${buildUp}:${category}:${product.code}`;

        const currentQuantity: number = (
          productsToBuy.get(rowId) || { quantity: 0 }
        ).quantity;

        productsToBuy.set(rowId, {
          ...product,
          buildUp,
          category,
          quantity: currentQuantity + area / product.coverage
        });
      }
    }
  }

  return [...productsToBuy]
    .map(([_code, product]) => ({
      ...product,
      quantity: Math.ceil(product.quantity)
    }))
    .filter(({ quantity }) => quantity > 0);
};
