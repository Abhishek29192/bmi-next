type ParamType = string | boolean | undefined;

export const convertStrToBool = (param: ParamType) => {
  if (typeof param === "boolean") {
    return param;
  }
  return param === "true" ? true : false;
};
