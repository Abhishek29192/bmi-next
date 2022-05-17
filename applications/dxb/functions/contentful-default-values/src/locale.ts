import { Environment, Locale, Entry, Asset } from "contentful-management";

const TAG_PREFIX = "market__";

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
    if (value) {
      targetlocales.forEach((locale) => {
        // eslint-disable-next-line security/detect-object-injection
        entity.fields[typedName][locale.code] = value;
      });
      dirty = true;
    }
  }
  if (dirty) {
    await entity.update();
    return true;
  }

  return false;
};

export const findLocalesFromTag = (
  entity: Entry | Asset,
  marketLocales: { [key: string]: string[] }
): string[] | undefined => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regEx = new RegExp(`^${TAG_PREFIX}(.*)`);

  const marketId = entity.metadata?.tags?.map((tag) =>
    tag.sys.id.match(regEx)
  )?.[0]?.[1];

  if (!marketId) {
    return undefined;
  }

  return marketLocales[marketId.toString()];
};
