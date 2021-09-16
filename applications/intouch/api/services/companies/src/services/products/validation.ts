import { Product, System, SystemMember } from "@bmi/intouch-api-types";

const ALLOWED_TECHNOLOGIES = ["FLAT", "PITCHED"];

const SYSTEM_MEMBER_KEYS = ["systemBmiRef", "productBmiRef"];
const SYSTEM_KEYS = [
  "technology",
  "bmiRef",
  "name",
  "description",
  "maximumValidityYears",
  "published"
];
const PRODUCT_KEYS = [
  "technology",
  "bmiRef",
  "brand",
  "name",
  "description",
  "family",
  "published",
  "maximumValidityYears"
];

const checkMandatoryFields = (item, keys) =>
  keys.reduce((result, key) => {
    if (item[`${key}`] === null || item[`${key}`] === undefined) {
      result.push({
        ref: item.bmiRef,
        message: `${key} is mandatory`
      });
    }

    return result;
  }, []);

const checkMandatoryFieldsMembers = (item, keys) =>
  keys.reduce((result, key) => {
    if (item[`${key}`] === null || item[`${key}`] === undefined) {
      result.push({
        ref: `${item.systemBmiRef} ${item.productBmiRef}`,
        message: `${key} is mandatory`
      });
    }

    return result;
  }, []);

export const validateItems = (
  items: Product[] | System[],
  type: "SYSTEM" | "PRODUCT"
) => {
  let errors = [];
  const productsMap = {};

  items.forEach((item) => {
    if (type == "SYSTEM") {
      const res = checkMandatoryFields(item, SYSTEM_KEYS);
      errors = [...errors, ...res];
    } else {
      const res = checkMandatoryFields(item, PRODUCT_KEYS);
      errors = [...errors, ...res];
    }

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
  let errors = [];

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

    const res = checkMandatoryFieldsMembers(current, SYSTEM_MEMBER_KEYS);
    errors = [...errors, ...res];

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
