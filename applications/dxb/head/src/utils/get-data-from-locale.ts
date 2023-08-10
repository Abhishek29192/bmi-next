export type LocalisedFields<T> = {
  [key in keyof T]: {
    [locale: string]: T[key];
  };
};

// TODO: Is this even being used?
export const getDataFromLocale = <T extends Record<string, unknown>>(
  localeCode: string,
  fields?: LocalisedFields<T>
): Record<string, unknown>[] | undefined => {
  if (!fields) {
    return;
  }
  return Object.entries(fields).map(([field, value]) => {
    const newValue: { [key: string]: unknown } = {};
    // eslint-disable-next-line security/detect-object-injection
    newValue[field] = value[localeCode];
    return newValue;
  });
};
