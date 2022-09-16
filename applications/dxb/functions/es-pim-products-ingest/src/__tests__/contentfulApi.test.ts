import {
  Collection,
  Entry,
  EntryProps,
  KeyValueMap,
  QueryOptions
} from "contentful-management";
import { getAssetTypes, getProductDocumentNameMap } from "../contentfulApi";

const { MARKET_LOCALE } = process.env;

const getEntries = jest.fn();
jest.mock("contentful-management", () => ({
  createClient: () => ({
    getSpace: () => ({
      getEnvironment: () => ({
        getEntries: (
          options: QueryOptions
        ): Promise<Collection<Entry, EntryProps<KeyValueMap>>> =>
          getEntries(options)
      })
    })
  })
}));

describe("contentfulApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("getAssetTypes", () => {
    it("sholud return correct data", async () => {
      getEntries.mockReturnValue({
        items: [
          {
            sys: {
              id: "Test_id1"
            },
            fields: {
              description: { [`${MARKET_LOCALE}`]: "Test_description1" },
              name: { [`${MARKET_LOCALE}`]: "Test_name1" },
              code: { [`${MARKET_LOCALE}`]: "Test_code1" },
              pimCode: { [`${MARKET_LOCALE}`]: "Test_pimCode1" }
            }
          },
          {
            sys: {
              id: "Test_id2"
            },
            fields: {
              description: { [`${MARKET_LOCALE}`]: "Test_description2" },
              name: { [`${MARKET_LOCALE}`]: "Test_name2" },
              code: { [`${MARKET_LOCALE}`]: "Test_code2" },
              pimCode: { [`${MARKET_LOCALE}`]: "Test_pimCode2" }
            }
          },
          {
            sys: {
              id: "Test_id3"
            },
            fields: {
              description: { [`${MARKET_LOCALE}`]: "Test_description3" },
              name: { [`${MARKET_LOCALE}`]: "Test_name3" },
              code: { [`${MARKET_LOCALE}`]: "Test_code3" }
            }
          }
        ]
      });

      const result = await getAssetTypes();

      const expectedResult = [
        {
          __typename: "ContentfulAssetType",
          id: "Test_id1",
          description: "Test_description1",
          name: "Test_name1",
          code: "Test_code1",
          pimCode: "Test_pimCode1"
        },
        {
          __typename: "ContentfulAssetType",
          id: "Test_id2",
          description: "Test_description2",
          name: "Test_name2",
          code: "Test_code2",
          pimCode: "Test_pimCode2"
        }
      ];

      expect(result).toEqual(expectedResult);
    });

    it("sholud return correct data if description is not provided", async () => {
      getEntries.mockReturnValue({
        items: [
          {
            sys: {
              id: "Test_id1"
            },
            fields: {
              description: { [`${MARKET_LOCALE}`]: "Test_description1" },
              name: { [`${MARKET_LOCALE}`]: "Test_name1" },
              code: { [`${MARKET_LOCALE}`]: "Test_code1" },
              pimCode: { [`${MARKET_LOCALE}`]: "Test_pimCode1" }
            }
          },
          {
            sys: {
              id: "Test_id2"
            },
            fields: {
              name: { [`${MARKET_LOCALE}`]: "Test_name2" },
              code: { [`${MARKET_LOCALE}`]: "Test_code2" },
              pimCode: { [`${MARKET_LOCALE}`]: "Test_pimCode2" }
            }
          }
        ]
      });

      const result = await getAssetTypes();

      const expectedResult = [
        {
          __typename: "ContentfulAssetType",
          id: "Test_id1",
          description: "Test_description1",
          name: "Test_name1",
          code: "Test_code1",
          pimCode: "Test_pimCode1"
        },
        {
          __typename: "ContentfulAssetType",
          id: "Test_id2",
          description: null,
          name: "Test_name2",
          code: "Test_code2",
          pimCode: "Test_pimCode2"
        }
      ];

      expect(result).toEqual(expectedResult);
    });

    it("sholud return undefined if MANAGEMENT_ACCESS_TOKEN is NOT provided", async () => {
      const token = process.env.MANAGEMENT_ACCESS_TOKEN;
      delete process.env.MANAGEMENT_ACCESS_TOKEN;

      console.log(process.env.MANAGEMENT_ACCESS_TOKEN);

      const result = await getAssetTypes();

      expect(result).toEqual(undefined);
      process.env.MANAGEMENT_ACCESS_TOKEN = token;
    });
    it("sholud return undefined if SPACE_ID is NOT provided", async () => {
      const token = process.env.SPACE_ID;
      delete process.env.SPACE_ID;

      console.log(process.env.SPACE_ID);

      const result = await getAssetTypes();

      expect(result).toEqual(undefined);
      process.env.SPACE_ID = token;
    });
    it("sholud return undefined if CONTENTFUL_ENVIRONMENT is NOT provided", async () => {
      const token = process.env.CONTENTFUL_ENVIRONMENT;
      delete process.env.CONTENTFUL_ENVIRONMENT;

      console.log(process.env.CONTENTFUL_ENVIRONMENT);

      const result = await getAssetTypes();

      expect(result).toEqual(undefined);
      process.env.CONTENTFUL_ENVIRONMENT = token;
    });
    it("sholud return undefined if MARKET_LOCALE is NOT provided", async () => {
      const token = process.env.MARKET_LOCALE;
      delete process.env.MARKET_LOCALE;

      console.log(process.env.MARKET_LOCALE);

      const result = await getAssetTypes();

      expect(result).toEqual(undefined);
      process.env.MARKET_LOCALE = token;
    });
  });

  describe("getProductDocumentNameMap", () => {
    it("sholud return correct data", async () => {
      getEntries.mockReturnValue({
        items: [
          {
            fields: {
              productDocumentNameMap: {
                [`${MARKET_LOCALE}`]: "Product name + asset type"
              }
            }
          }
        ]
      });

      const result = await getProductDocumentNameMap();
      const expectedResult = "Product name + asset type";

      expect(result).toEqual(expectedResult);
    });

    it("sholud return default value 'Document name'", async () => {
      getEntries.mockReturnValue({
        items: [
          {
            fields: {}
          }
        ]
      });

      const result = await getProductDocumentNameMap();
      const expectedResult = "Document name";

      expect(result).toEqual(expectedResult);
    });
  });
});
