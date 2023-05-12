import createRichText from "../richTextHelper";
import createEntrySys from "../entrySysHelper";
import createAssetLink from "../assetLinkHelper";
import createEntryLink from "../entryLinkHelper";
import type { EntryPartial } from "../helperTypes";
import type { TypeDocument } from "../../types";

const setForAllLocales = <Locales extends string, Value>(
  locales: Locales[],
  value: Value
): { [LocaleName in Locales]?: Value } =>
  locales.reduce((map, locale) => ({ ...map, [locale]: value }), {});

export const createFullyPopulatedDocumentLocalisedUnlinked = <
  Locales extends string
>(
  contentfulDocument?: EntryPartial<
    TypeDocument<"WITH_ALL_LOCALES" | "WITHOUT_LINK_RESOLUTION", Locales>
  >,
  locales: Locales[] = ["en-US" as Locales]
): TypeDocument<"WITH_ALL_LOCALES" | "WITHOUT_LINK_RESOLUTION", Locales> => {
  const document = createDocumentLocalisedUnlinked(contentfulDocument, locales);
  return {
    ...document,
    fields: {
      ...document.fields,
      brand: setForAllLocales(locales, "AeroDek"),
      description: setForAllLocales(locales, createRichText()),
      featuredMedia: setForAllLocales(locales, { sys: createEntryLink() }),
      noIndex: setForAllLocales(locales, false),
      ...contentfulDocument?.fields
    }
  };
};

const createDocumentLocalisedUnlinked = <Locale extends string>(
  contentfulDocument?: EntryPartial<
    TypeDocument<"WITH_ALL_LOCALES" | "WITHOUT_LINK_RESOLUTION", Locale>
  >,
  locales: Locale[] = ["en-US" as Locale]
): TypeDocument<"WITH_ALL_LOCALES" | "WITHOUT_LINK_RESOLUTION", Locale> => {
  return {
    sys: {
      ...createEntrySys(),
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "document"
        }
      },
      ...contentfulDocument?.sys
    },
    metadata: {
      tags: [],
      ...contentfulDocument?.metadata
    },
    fields: {
      asset: setForAllLocales(locales, { sys: createAssetLink() }),
      assetType: setForAllLocales(locales, { sys: createEntryLink() }),
      title: setForAllLocales(locales, "contentful document title"),
      ...contentfulDocument?.fields
    }
  };
};

export default createDocumentLocalisedUnlinked;
