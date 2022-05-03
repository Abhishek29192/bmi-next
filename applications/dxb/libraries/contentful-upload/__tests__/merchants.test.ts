/* eslint-disable no-console */
import path from "path";
import mockConsole from "jest-mock-console";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();

jest.mock("dotenv", () => ({ config: jest.fn() }));
jest.mock("node-fetch", () => fetchMock);

let answer: (answer: string) => void;
let onAsk: (askedQuestion: string) => void | undefined;
const expectQuestion = (question: string) =>
  new Promise<void>((resolve, reject) => {
    onAsk = (askedQuestion: string) => {
      if (askedQuestion !== question) {
        reject(`Expected ${question}, Found: ${askedQuestion}`);
      }
      resolve();
    };
  });
const question = jest.fn().mockImplementation((question, resolve) => {
  if (onAsk) {
    onAsk(question);
  }
  answer = resolve;
});

let onDone: (value?: unknown) => void;
let done: Promise<unknown>;
jest.mock("readline", () => {
  return {
    createInterface: () => {
      done = new Promise((resolve) => (onDone = resolve));
      return {
        question,
        close: () => {
          if (onDone) {
            onDone();
          }
        }
      };
    }
  };
});

const getEntries = jest.fn().mockResolvedValue({
  total: 1,
  items: [
    {
      fields: {
        name: { "en-US": "BMI Icopal Flat roof Systems" }
      },
      sys: {
        id: "id-1"
      }
    },
    {
      fields: {
        name: { "en-US": "Hellend dak" }
      },
      sys: {
        id: "id-2"
      }
    }
  ]
});
const getLocales = jest
  .fn()
  .mockReturnValue({ total: 1, items: [{ code: "en-US" }] });

const publishRoofer = jest.fn().mockImplementation(() => {
  return {
    sys: { version: 1, id: "roofer-id" }
  };
});
const publishMerchantType = jest.fn();

const createEntry = jest.fn().mockImplementation((contentTypeId, data) => {
  if (contentTypeId === "roofer") {
    return {
      publish: publishRoofer
    };
  }
  if (contentTypeId === "serviceType") {
    return {
      publish: publishMerchantType
    };
  }
});

const getEnvironment = jest
  .fn()
  .mockReturnValue({ createEntry, getLocales, getEntries });
const getSpace = jest.fn().mockReturnValue({ getEnvironment });
const createClient = jest.fn().mockImplementation(() => ({ getSpace }));
jest.mock("contentful-management", () => {
  return {
    createClient
  };
});

mockResponses(fetchMock, {
  method: "GET",
  url: `begin:https://maps.googleapis.com`,
  body: {
    results: [{ geometry: { location: { lat: 1, lng: 2 } } }]
  }
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  mockConsole();
});

const argv = process.argv;
const env = process.env;

const validEnv = {
  MANAGEMENT_ACCESS_TOKEN: "MANAGEMENT_ACCESS_TOKEN:value",
  SPACE_ID: "SPACE_ID:value",
  CONTENTFUL_ENVIRONMENT: "CONTENTFUL_ENVIRONMENT:value",
  LOCALE: "en-US"
};

const getMinimalPath = (file: string) => path.join(__dirname, "data", file);

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  process.argv = ["", "", getMinimalPath("single-merchant.tsv")];
  process.env = {
    ...env,
    ...validEnv
  };
});

afterEach(() => {
  process.argv = argv;
  process.env = env;
  fetchMock.reset();
});

describe("Merchants contentful upload", () => {
  it(`throws error if the file path is missing`, async () => {
    process.argv = ["", "", ""];
    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).not.toHaveBeenCalled();
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("file path is missing")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).not.toHaveBeenCalled();
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`throws error if MANAGEMENT_ACCESS_TOKEN is not set`, async () => {
    const orginalManagementAccessToken = process.env.MANAGEMENT_ACCESS_TOKEN;
    delete process.env.MANAGEMENT_ACCESS_TOKEN;
    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("Missing Env vars")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).not.toHaveBeenCalled();
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();

    process.env.MANAGEMENT_ACCESS_TOKEN = orginalManagementAccessToken;
  });

  it(`throws error if SPACE_ID is not set`, async () => {
    const originalSpaceId = process.env.SPACE_ID;
    delete process.env.SPACE_ID;
    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("Missing Env vars")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).not.toHaveBeenCalled();
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();

    process.env.SPACE_ID = originalSpaceId;
  });

  it(`throws error if CONTENTFUL_ENVIRONMENT is not set`, async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;
    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("Missing Env vars")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).not.toHaveBeenCalled();
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it(`throws error if LOCALE is not set`, async () => {
    const originalLocale = process.env.LOCALE;
    delete process.env.LOCALE;
    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("Missing Env vars")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).not.toHaveBeenCalled();
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();

    process.env.LOCALE = originalLocale;
  });

  it(`throws error if getSpace returns a rejected promise`, async () => {
    getSpace.mockRejectedValueOnce(new Error("Expected error"));

    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      Error("Expected error")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`throws error if getEnvironment returns a rejected promise`, async () => {
    getEnvironment.mockRejectedValueOnce(new Error("Expected error"));

    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      Error("Expected error")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).not.toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`throws error if getLocales returns a rejected promise`, async () => {
    getLocales.mockRejectedValueOnce(new Error("Expected error"));

    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      Error("Expected error")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).not.toHaveBeenCalled();
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`throws error if getEntries returns a rejected promise`, async () => {
    getEntries.mockRejectedValueOnce(new Error("Expected error"));

    require("../scripts/merchants");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      Error("Expected error")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`exits gracefully when answered with not "y"`, async () => {
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("no");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "Uploadng to roofer, using:\n" +
        `SPACE: ${process.env.SPACE_ID}\n` +
        `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith("Exiting...");
    expect(console.error as jest.Mock).not.toHaveBeenCalled();

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`handles if the file doesn't exist`, async () => {
    process.argv = ["", "", getMinimalPath("a-non-existent-file.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "Uploadng to roofer, using:\n" +
        `SPACE: ${process.env.SPACE_ID}\n` +
        `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Reading ${process.argv[2]}`
    );
    expect((console.error as jest.Mock).mock.calls[0][0].message).toEqual(
      `ENOENT: no such file or directory, open '${process.argv[2]}'`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`checks for first line to be empty`, async () => {
    process.argv = ["", "", getMinimalPath("first-line-non-empty.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "Uploadng to roofer, using:\n" +
        `SPACE: ${process.env.SPACE_ID}\n` +
        `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Reading ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error("First line must be empty to match the template")
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`checks that header line matches the template`, async () => {
    process.argv = ["", "", getMinimalPath("incorrect-header-line.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "Uploadng to roofer, using:\n" +
        `SPACE: ${process.env.SPACE_ID}\n` +
        `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Reading ${process.argv[2]}`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      new Error(
        "Second line doesn't match header template\n" +
          "Expected: Name, Latitude, Longitude, Type of Merchant, Address, Country, City, Postcode, PhoneNumber, Email, Website, Summary of Company\n" +
          "Found:    Name with incorrect label, Latitude, Longitude, Address, City, Postcode, PhoneNumber, Email, Website"
      )
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith("Process failed");

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).not.toHaveBeenCalled();
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
  });

  it(`logs error when creating entry fails without erroring process`, async () => {
    createEntry.mockImplementationOnce(() => {
      throw new Error("Expected error");
    });
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Looking in ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "Uploadng to roofer, using:\n" +
        `SPACE: ${process.env.SPACE_ID}\n` +
        `ENVIRONMENT: ${process.env.CONTENTFUL_ENVIRONMENT}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Reading ${process.argv[2]}`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Uploading 1 lines to columns: Name, Latitude, Longitude, Type of Merchant, Address, Country, City, Postcode, PhoneNumber, Email, Website, Summary of Company`
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      `Uploading line 1: 'Aarlese Bouwmaterialen'`
    );
    expect(console.error as jest.Mock).toHaveBeenCalledWith(
      "Failed to publish 'Aarlese Bouwmaterialen' :: source line No.: 1",
      new Error("Expected error")
    );
    expect(console.log as jest.Mock).toHaveBeenCalledWith("All done");
    expect(console.error as jest.Mock).not.toHaveBeenCalledWith(
      "Process failed"
    );

    expect(getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(getLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalledWith({
      content_type: "serviceType"
    });
    expect(createEntry).toHaveBeenCalledTimes(1);
    expect(createEntry).toHaveBeenCalledWith("roofer", {
      fields: {
        address: {
          "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
        },
        email: {
          "en-US": "info@aarlesebouwmaterialen.nl"
        },
        entryType: {
          "en-US": "Merchant"
        },
        location: {
          "en-US": {
            lat: 23,
            lon: 63
          }
        },
        name: {
          "en-US": "Aarlese Bouwmaterialen"
        },
        phone: {
          "en-US": "0492-383300"
        },
        serviceTypes: {
          "en-US": [
            {
              sys: {
                id: "id-2",
                linkType: "Entry",
                type: "Link"
              }
            }
          ]
        },
        summary: {
          "en-US": "Test summary"
        },
        website: {
          "en-US": undefined
        }
      }
    });
    expect(publishRoofer).not.toHaveBeenCalled();
    expect(publishMerchantType).not.toHaveBeenCalled();
    expect(console.log as jest.Mock).lastCalledWith("All done");
  });

  it("geocodes address", async () => {
    mockResponses(fetchMock, {
      method: "GET",
      url: `begin:https://maps.googleapis.com`,
      body: {
        results: [{ geometry: { location: { lat: 1, lng: 2 } } }]
      }
    });

    process.argv = ["", "", getMinimalPath("empty-location.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;

    expect(console.log as jest.Mock).toHaveBeenCalledTimes(9);
    expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(getSpace).toHaveBeenCalledTimes(1);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
    expect(getLocales).toHaveBeenCalledTimes(1);
    expect(getEntries).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveFetched(`begin:https://maps.googleapis.com`, {
      body: {
        results: [{ geometry: { location: { lat: 1, lng: 2 } } }]
      }
    });
    expect(createEntry).toHaveBeenCalledTimes(2);
    expect(createEntry.mock.calls[1]).toEqual([
      "roofer",
      {
        fields: {
          address: {
            "en-US": "Gouwe 1, ZWOLLE, 8032 CA"
          },
          email: {
            "en-US": "info@aberson.nl"
          },
          entryType: {
            "en-US": "Merchant"
          },
          location: {
            "en-US": {
              lat: 1,
              lon: 2
            }
          },
          name: {
            "en-US": "Aberson BV"
          },
          phone: {
            "en-US": "088-4553600"
          },
          serviceTypes: {
            "en-US": [
              {
                sys: {
                  id: "id-2",
                  linkType: "Entry",
                  type: "Link"
                }
              }
            ]
          },
          summary: {
            "en-US": undefined
          },
          website: {
            "en-US": "https://www.aberson.nl"
          }
        }
      }
    ]);
    expect(console.log as jest.Mock).lastCalledWith("All done");
  });

  it("geocoding doesn't return results", async () => {
    mockResponses(fetchMock, {
      method: "GET",
      url: `begin:https://maps.googleapis.com`,
      body: {
        results: [],
        error_message: "Test error message"
      }
    });

    process.argv = ["", "", getMinimalPath("empty-location.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;

    expect(console.log as jest.Mock).toHaveBeenCalledTimes(9);
    expect(console.error as jest.Mock).toHaveBeenCalledTimes(2);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(getSpace).toHaveBeenCalledTimes(1);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
    expect(createEntry).toHaveBeenCalledTimes(2);
    expect(getLocales).toHaveBeenCalledTimes(1);
    expect(getEntries).toHaveBeenCalledTimes(1);
    expect(console.log as jest.Mock).lastCalledWith("All done");
  });

  describe(`when one merchant type is empty string`, () => {
    it(`logs empty merchant error`, async () => {
      process.argv = ["", "", getMinimalPath("empty-merchant.tsv")];

      createEntry.mockImplementation((contentTypeId, data) => {
        if (contentTypeId === "roofer") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "roofer-id" }
              };
            })
          };
        }
        if (contentTypeId === "serviceType") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "merchant-type-id" }
              };
            })
          };
        }
      });

      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(7);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(1);
      expect((console.error as jest.Mock).mock.calls[0]).toEqual([
        "EMPTY merchant type found at record 'Aarlese Bouwmaterialen'. no new merchant type will be created."
      ]);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(createEntry).toHaveBeenCalledTimes(1);
      expect(createEntry.mock.calls[0]).toEqual([
        "roofer",
        {
          fields: {
            address: {
              "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
            },
            email: {
              "en-US": "info@aarlesebouwmaterialen.nl"
            },
            entryType: {
              "en-US": "Merchant"
            },
            location: {
              "en-US": {
                lat: 23,
                lon: 63
              }
            },
            name: {
              "en-US": "Aarlese Bouwmaterialen"
            },
            phone: {
              "en-US": "0492-383300"
            },
            serviceTypes: {
              "en-US": [
                {
                  sys: {
                    id: "id-2",
                    linkType: "Entry",
                    type: "Link"
                  }
                }
              ]
            },
            summary: {
              "en-US": "Test summary"
            },
            website: {
              "en-US": undefined
            }
          }
        }
      ]);
      expect(getLocales).toHaveBeenCalledTimes(1);
      expect(getEntries).toHaveBeenCalledTimes(1);

      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`when merchant type does not exist `, () => {
    it(`creates new service type entry`, async () => {
      getEntries.mockResolvedValueOnce({ total: 0 });

      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(7);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(1);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(createEntry).toHaveBeenCalledTimes(2);
      expect(createEntry.mock.calls[0]).toEqual([
        "serviceType",
        {
          fields: {
            name: {
              "en-US": "Hellend dak"
            }
          }
        }
      ]);
      expect(getLocales).toHaveBeenCalledTimes(1);
      expect(getEntries).toHaveBeenCalledTimes(1);

      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`when merchant type throws error`, () => {
    it(`creates merchant entry`, async () => {
      createEntry.mockImplementation((contentTypeId, data) => {
        if (contentTypeId === "roofer") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "roofer-id" }
              };
            })
          };
        }
        if (contentTypeId === "serviceType") {
          throw new Error("cannot create merchant type");
        }
      });
      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(7);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(createEntry).toHaveBeenCalledTimes(1);
      expect(getLocales).toHaveBeenCalledTimes(1);
      expect(getEntries).toHaveBeenCalledTimes(1);

      expect(createEntry).toHaveBeenCalledWith("roofer", {
        fields: {
          address: {
            "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
          },
          email: {
            "en-US": "info@aarlesebouwmaterialen.nl"
          },
          entryType: {
            "en-US": "Merchant"
          },
          location: {
            "en-US": {
              lat: 23,
              lon: 63
            }
          },
          name: {
            "en-US": "Aarlese Bouwmaterialen"
          },
          phone: {
            "en-US": "0492-383300"
          },
          serviceTypes: {
            "en-US": [
              {
                sys: {
                  id: "id-2",
                  linkType: "Entry",
                  type: "Link"
                }
              }
            ]
          },
          summary: {
            "en-US": "Test summary"
          },
          website: {
            "en-US": undefined
          }
        }
      });

      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`when merchant type gets created but does not publish`, () => {
    it(`it creates merchant type and merchant entries`, async () => {
      const publishMerchant = jest.fn();
      const publishMerchantType = jest.fn().mockImplementation(() => {
        return null;
      });
      createEntry.mockImplementation((contentTypeId, data) => {
        if (contentTypeId === "roofer") {
          return {
            publish: publishMerchant
          };
        }
        if (contentTypeId === "serviceType") {
          return {
            sys: { id: "merchant-type-id" },

            publish: publishMerchantType
          };
        }
      });
      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(6);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(createEntry).toHaveBeenCalledTimes(1);
      expect(getLocales).toHaveBeenCalledTimes(1);
      expect(getEntries).toHaveBeenCalledTimes(1);
      expect(publishMerchant).toHaveBeenCalledTimes(1);
      expect(publishMerchantType).toHaveBeenCalledTimes(0);
      expect(createEntry).toHaveBeenCalledWith("roofer", {
        fields: {
          address: {
            "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
          },
          email: {
            "en-US": "info@aarlesebouwmaterialen.nl"
          },
          entryType: {
            "en-US": "Merchant"
          },
          location: {
            "en-US": {
              lat: 23,
              lon: 63
            }
          },
          name: {
            "en-US": "Aarlese Bouwmaterialen"
          },
          phone: {
            "en-US": "0492-383300"
          },
          serviceTypes: {
            "en-US": [
              {
                sys: {
                  id: "id-2",
                  linkType: "Entry",
                  type: "Link"
                }
              }
            ]
          },
          summary: {
            "en-US": "Test summary"
          },
          website: {
            "en-US": undefined
          }
        }
      });
      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`when site locale is different from env variable locale`, () => {
    it(`creates 'merchant type' and 'merchant' entries with new locale`, async () => {
      const newLocale = "en-GB";

      getLocales.mockReturnValue({ total: 1, items: [{ code: newLocale }] });

      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(8);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(getLocales).toHaveBeenCalledTimes(1);

      expect(createEntry).toHaveBeenCalledTimes(2);
      expect(createEntry.mock.calls[0]).toEqual([
        "serviceType",
        { fields: { name: { [newLocale]: "Hellend dak" } } }
      ]);

      expect(createEntry.mock.calls[1]).toEqual([
        "roofer",
        {
          fields: {
            address: {
              [newLocale]: "Havenweg 17, AARLE RIXTEL, 5735 SH"
            },
            email: {
              [newLocale]: "info@aarlesebouwmaterialen.nl"
            },
            entryType: {
              [newLocale]: "Merchant"
            },
            location: {
              [newLocale]: {
                lat: 23,
                lon: 63
              }
            },
            name: {
              [newLocale]: "Aarlese Bouwmaterialen"
            },
            phone: {
              [newLocale]: "0492-383300"
            },
            serviceTypes: {
              [newLocale]: [
                {
                  sys: {
                    id: "merchant-type-id",
                    linkType: "Entry",
                    type: "Link"
                  }
                }
              ]
            },
            summary: {
              [newLocale]: "Test summary"
            },
            website: {
              [newLocale]: undefined
            }
          }
        }
      ]);

      expect(getEntries).toHaveBeenCalledTimes(1);
      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`when getLocales returns null`, () => {
    it(`creates merchant entries with new locale`, async () => {
      const originlLocale = "en-US";

      getLocales.mockReturnValue(null);
      createEntry.mockImplementationOnce((contentTypeId, data) => {
        if (contentTypeId === "roofer") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "roofer-id" }
              };
            })
          };
        }
        if (contentTypeId === "serviceType") {
          return {
            sys: { id: "merchant-type-id" },
            publish: publishMerchantType
          };
        }
      });

      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(getLocales).toHaveBeenCalledTimes(1);
      expect(getEntries).toHaveBeenCalledTimes(1);

      expect(createEntry).toHaveBeenCalledTimes(1);
      expect(createEntry.mock.calls[0]).toEqual([
        "roofer",
        {
          fields: {
            address: {
              [originlLocale]: "Havenweg 17, AARLE RIXTEL, 5735 SH"
            },
            email: {
              [originlLocale]: "info@aarlesebouwmaterialen.nl"
            },
            entryType: {
              [originlLocale]: "Merchant"
            },
            location: {
              [originlLocale]: {
                lat: 23,
                lon: 63
              }
            },
            name: {
              [originlLocale]: "Aarlese Bouwmaterialen"
            },
            phone: {
              [originlLocale]: "0492-383300"
            },
            serviceTypes: {
              [originlLocale]: [
                {
                  sys: {
                    id: "id-2",
                    linkType: "Entry",
                    type: "Link"
                  }
                }
              ]
            },
            summary: {
              [originlLocale]: "Test summary"
            },
            website: {
              [originlLocale]: undefined
            }
          }
        }
      ]);
      expect(console.log as jest.Mock).nthCalledWith(
        6,
        "'Aarlese Bouwmaterialen' : was created and published with id: roofer-id"
      );
      expect(console.log as jest.Mock).lastCalledWith("All done");
    });
  });

  describe(`When multiple lines are processed`, () => {
    it(`creates 'merchant type' and 'merchant' entries with new locale`, async () => {
      process.argv = ["", "", getMinimalPath("merchants.tsv")];

      mockResponses(fetchMock, {
        method: "GET",
        url: `begin:https://maps.googleapis.com`,
        body: {
          results: [{ geometry: { location: { lat: 1, lng: 2 } } }]
        }
      });

      createEntry.mockImplementation((contentTypeId, data) => {
        if (contentTypeId === "roofer") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "roofer-id" }
              };
            })
          };
        }
        if (contentTypeId === "serviceType") {
          return {
            publish: jest.fn().mockImplementation(() => {
              return {
                sys: { version: 1, id: "merchant-type-id" }
              };
            })
          };
        }
      });
      require("../scripts/merchants");
      await expectQuestion("Continue (y/N)?");
      answer("y");
      await done;

      expect(console.log as jest.Mock).toHaveBeenCalledTimes(11);

      expect((console.error as jest.Mock).mock.calls).toEqual([]);
      expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(getSpace).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(getLocales).toHaveBeenCalledTimes(1);

      expect(createEntry).toHaveBeenCalledTimes(3);

      expect(createEntry.mock.calls[0]).toEqual([
        "roofer",
        {
          fields: {
            address: {
              "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
            },
            email: {
              "en-US": "info@aarlesebouwmaterialen.nl"
            },
            entryType: {
              "en-US": "Merchant"
            },
            location: {
              "en-US": {
                lat: 23,
                lon: 63
              }
            },
            name: {
              "en-US": "Aarlese Bouwmaterialen"
            },
            phone: {
              "en-US": "0492-383300"
            },
            serviceTypes: {
              "en-US": [
                {
                  sys: {
                    id: "id-2",
                    linkType: "Entry",
                    type: "Link"
                  }
                }
              ]
            },
            summary: {
              "en-US": "Test summary"
            },
            website: {
              "en-US": undefined
            }
          }
        }
      ]);

      expect(console.log as jest.Mock).lastCalledWith("All done");
    });

    describe(`and some lines are empty`, () => {
      it("removes empty lines before processing", async () => {
        process.argv = ["", "", getMinimalPath("empty-lines.tsv")];

        createEntry.mockImplementation((contentTypeId, data) => {
          if (contentTypeId === "roofer") {
            return {
              publish: jest.fn().mockImplementation(() => {
                return {
                  sys: { version: 1, id: "roofer-id" }
                };
              })
            };
          }
          if (contentTypeId === "serviceType") {
            return {
              publish: jest.fn().mockImplementation(() => {
                return {
                  sys: { version: 1, id: "merchant-type-id" }
                };
              })
            };
          }
        });
        require("../scripts/merchants");
        await expectQuestion("Continue (y/N)?");
        answer("y");
        await done;

        expect(console.log as jest.Mock).toHaveBeenCalledTimes(7);

        expect(console.error as jest.Mock).toHaveBeenCalledTimes(0);

        expect(createClient).toHaveBeenCalledTimes(1);
        expect(getSpace).toHaveBeenCalledTimes(1);
        expect(getEnvironment).toHaveBeenCalledTimes(1);
        expect(getLocales).toHaveBeenCalledTimes(1);

        expect(createEntry).toHaveBeenCalledTimes(1);

        expect(createEntry.mock.calls[0]).toEqual([
          "roofer",
          {
            fields: {
              address: {
                "en-US": "Havenweg 17, AARLE RIXTEL, 5735 SH"
              },
              email: {
                "en-US": "info@aarlesebouwmaterialen.nl"
              },
              entryType: {
                "en-US": "Merchant"
              },
              location: {
                "en-US": {
                  lat: 23,
                  lon: 63
                }
              },
              name: {
                "en-US": "Aarlese Bouwmaterialen"
              },
              phone: {
                "en-US": "0492-383300"
              },
              serviceTypes: {
                "en-US": [
                  {
                    sys: {
                      id: "id-2",
                      linkType: "Entry",
                      type: "Link"
                    }
                  }
                ]
              },
              summary: {
                "en-US": "Test summary"
              },
              website: {
                "en-US": undefined
              }
            }
          }
        ]);

        expect(getEntries).toHaveBeenCalledTimes(1);

        expect(console.log as jest.Mock).lastCalledWith("All done");
      });
    });
  });
});
