import { Tree } from "../types/CalculatorData";
import { pickNumbers } from "../utils/pickNumbers";

export const getSystem = (values: any, tree: Tree) => {
  // Create a new values object that only keep the necessary values (no left overs selections from other tree paths)
  const params: { [key: string]: string } = {};

  let current: Tree | string = tree;

  // Keep looking until we reach a result (a string which is the system name)
  while (typeof current !== "string") {
    const { field, paths } = current as Tree;

    // Check the selected value
    // eslint-disable-next-line security/detect-object-injection
    const value = values[field];
    if (typeof value !== "string") {
      throw new Error(`Found an invalid selection ${value} for ${field}`);
    }

    const path = paths.find(({ option }) => option === value);

    if (!path) {
      throw new Error(`Couldn't find path for ${value} in ${field}`);
    }

    // Register as a necessary value to keep in the shareable link and display in the results view
    // eslint-disable-next-line security/detect-object-injection
    params[field] = value;
    // Search the path we reached next
    current = path.target;
  }

  // Return only the values we need to include in the shareable link
  return {
    name: current,
    values: {
      ...params,
      ...pickNumbers(
        values,
        "fieldArea",
        "upstandHeight",
        "upstandLength",
        "kerbHeight",
        "kerbLength",
        "detailHeight1",
        "detailLength1",
        "detailHeight2",
        "detailLength2"
      ),
      companyName: values["companyName"],
      projectName: values["projectName"]
    }
  };
};
