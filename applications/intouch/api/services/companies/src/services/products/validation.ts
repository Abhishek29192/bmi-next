import { Product, System, SystemMember } from "@bmi/intouch-api-types";

const ALLOWED_TECHNOLOGIES = ["FLAT", "PITCHED"];

export const validateItems = (items: Product[] | System[]) => {
  const errors = [];
  const productsMap = {};

  items.forEach((item) => {
    if (!ALLOWED_TECHNOLOGIES.includes(item.technology)) {
      errors.push({
        ref: item.bmiRef,
        message: "Technology not allowed"
      });
    }

    if (productsMap[item.bmiRef]) {
      errors.push({
        ref: item.bmiRef,
        message: "Duplicate product"
      });
    }
    productsMap[item.bmiRef] = true;

    if (
      !item.maximumValidityYears ||
      Math.sign(item.maximumValidityYears) !== 1
    ) {
      errors.push({
        ref: item.bmiRef,
        message: "Wrong maximum validity years"
      });
    }
  });

  return errors;
};

export const validateProductsAndSystems = (
  systemMember: SystemMember[],
  products: Product[],
  systems: System[]
) => {
  const errors = [];

  if (!products.length && !systems.length) return [];

  const productsMap = products.reduce(
    (result, current) => ({
      ...result,
      [current.bmiRef]: current
    }),
    {}
  );
  const systemsMap = systems.reduce(
    (result, current) => ({
      ...result,
      [current.bmiRef]: current
    }),
    {}
  );

  systemMember.forEach((current: SystemMember) => {
    const currentProd: Product = productsMap[current.productBmiRef];
    const currentSystem: System = systemsMap[current.systemBmiRef];

    if (!currentProd) {
      errors.push({
        ref: `${current.productBmiRef} - ${current.systemBmiRef}`,
        message: "Product not existing"
      });
    }

    if (!currentSystem) {
      errors.push({
        ref: `${current.productBmiRef} - ${current.systemBmiRef}`,
        message: "System not existing"
      });
    }

    const isValidTech = currentProd?.technology === currentSystem?.technology;

    if (!isValidTech) {
      errors.push({
        ref: `${current.productBmiRef} - ${current.systemBmiRef}`,
        message: "Technology mismatch"
      });
    }
  });

  return errors;
};
