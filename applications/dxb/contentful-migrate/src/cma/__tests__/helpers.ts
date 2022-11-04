import MurmurHash3 from "imurmurhash";

export const getMockContentfulEntries = (
  keys: string[],
  tags: string[],
  isPublishedFn?: () => boolean
) => {
  const items = keys.map((key: string) => {
    const keyHash = MurmurHash3(key + new Date().getTime().toString)
      .result()
      .toString();
    return {
      sys: {
        id: keyHash,
        type: "Entry",
        publishedVersion: 1,
        publishedCounter: 1,
        version: 2,
        contentType: {
          sys: {
            type: "Link",
            linkType: "ContentType",
            id: "resource"
          }
        }
      },
      fields: {
        key: {
          "en-US": key
        }
      },
      isPublished: isPublishedFn ? isPublishedFn : () => true,
      metadata: {
        tags: []
      }
    };
  });
  if (tags.length > 0) {
    const itemsWithTags = tags.flatMap((tag) => {
      return items.map((item) => {
        return {
          ...item,
          metadata: {
            tags: [{ sys: { id: tag } }]
          }
        };
      });
    });
    return {
      total: itemsWithTags.length,
      items: [...itemsWithTags]
    };
  }
  return {
    total: items.length,
    items: [...items]
  };
};

export const getContentfulTags = () => {
  const mockTags = {
    items: [
      {
        sys: {
          id: "market__norway",
          type: "Tag",
          version: 1,
          visibility: "public"
        },
        name: "norway"
      },
      {
        sys: {
          id: "market__uk",
          type: "Tag",
          version: 1,
          visibility: "public"
        },
        name: "uk"
      }
    ]
  };
  return mockTags;
};

export const getContentfulLocales = () => {
  const localeUS = {
    name: "English (United States)",
    internal_code: "en-US",
    code: "en-US",
    default: true,
    sys: {
      type: "Locale",
      id: "2PRKjDESdhv6BCbdu",
      version: 1
    }
  };
  const localeUK = {
    name: "English (United Kingdom)",
    internal_code: "en-UK",
    code: "en-UK",
    default: false,
    sys: {
      type: "Locale",
      id: "2PIogCdfgfgRKjDBJSK",
      version: 1
    }
  };
  return {
    items: [localeUS, localeUK]
  };
};
