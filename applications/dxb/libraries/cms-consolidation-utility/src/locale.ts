import type { Asset, Entry, Environment, Locale } from "contentful-management";

export const findIrrelevantLocales = async (
  environment: Environment,
  marketLocales: string[]
): Promise<Locale[] | undefined> => {
  const spaceLocales = await environment.getLocales();
  return spaceLocales.items.filter(
    (locale) => !marketLocales.includes(locale.code)
  );
};

export const copyDefaultValues = async (
  entity: Entry | Asset,
  targetlocales: Locale[],
  sourceLocaleCode: string
): Promise<boolean> => {
  let dirty = false;
  for (const name in entity.fields) {
    const typedName = name as keyof typeof entity.fields;
    // eslint-disable-next-line security/detect-object-injection
    const value = entity.fields[typedName][sourceLocaleCode];
    if (value !== undefined) {
      targetlocales.forEach((locale) => {
        // eslint-disable-next-line security/detect-object-injection
        entity.fields[typedName][locale.code] = value;
      });
      dirty = true;
    }
  }
  if (dirty) {
    return entity
      .update()
      .then(() => true)
      .catch(() => false);
  }

  return false;
};
