export type LocalisedFields<T> = {
  [key in keyof T]: {
    [locale: string]: T[key];
  };
};

export const getDataFromLocale = <T extends {}>(
  localeCode: string,
  fields?: LocalisedFields<T>
) => {
  if (!fields) {
    return;
  }
  // TODO: Ideally the return type should also be using the generic.
  // "However, it's a complicated structure. Thanks Content🤬.", (Alax Canessa)
  return Object.entries(fields).map(([field, value]) => {
    const newValue = {};
    // eslint-disable-next-line security/detect-object-injection
    newValue[field] = value[localeCode];
    return newValue;
  });
};
