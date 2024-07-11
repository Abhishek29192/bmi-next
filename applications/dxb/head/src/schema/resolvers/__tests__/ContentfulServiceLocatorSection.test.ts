import resolveServiceLocatorSection from "../ContentfulServiceLocatorSection";
import originalGetContentfulData from "../../../utils/getContentfulData";
import createContentfulServiceLocatorSection, {
  createContentfulService
} from "../types/helpers/ContentfulServiceLocatorSectionHelper";
import {
  Data as ServiceData,
  EntryTypeEnum
} from "../../../components/Service";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import type { ContentfulRichText } from "../types/RichText";

const richTextResolverMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => richTextResolverMock(richText)
}));

const getContentfulDataMock = jest.fn();
jest.mock("../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

const getTagMock = jest.fn();
jest.mock("../../../utils/getTagFilter", () => ({
  __esModule: true,
  default: () => getTagMock()
}));
afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  richTextResolverMock.mockResolvedValue("resolved-rich-text");
  getTagMock.mockReturnValue({ tag: "market__tag" });
});

describe("ContentfulServiceLocatorSection resolver", () => {
  it("should not call rich text resolver if body is not provided", async () => {
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      createContentfulServiceLocatorSection({ body: null })
    );
    expect(resolvedServiceLocatorSection.body).toBeNull();
    expect(richTextResolverMock).not.toHaveBeenCalled();
  });

  it("should call rich text resolver if body provided", async () => {
    const richText = createContentfulRichText();
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      createContentfulServiceLocatorSection({ body: richText })
    );
    expect(resolvedServiceLocatorSection.body).toBe("resolved-rich-text");
    expect(richTextResolverMock).toHaveBeenCalledWith(richText);
  });

  it("returns an empty array of services and logs a corresponding message if services request fails", async () => {
    const error = new Error("Services request failed");
    getContentfulDataMock.mockRejectedValue(error);
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      createContentfulServiceLocatorSection()
    );

    expect(resolvedServiceLocatorSection.services).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      `Did not manage to get services with the following error - ${error.message}`
    );
  });

  it("returns an empty array of services and logs a corresponding message if services request returns an array of errors", async () => {
    const errors = ["error-1", "error-2"];
    getContentfulDataMock.mockResolvedValue({ errors });
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      createContentfulServiceLocatorSection()
    );

    expect(resolvedServiceLocatorSection.services).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(errors);
  });

  it("should send only one request for services if there are less than 100 services", async () => {
    const service = createContentfulService();
    getContentfulDataMock.mockResolvedValue({
      data: {
        rooferCollection: { total: 99, items: new Array(99).fill(service) }
      }
    });
    const serviceLocatorSection = createContentfulServiceLocatorSection();
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      serviceLocatorSection
    );

    const { sys, serviceTypesCollection, ...rest } = service;
    const expectedService: ServiceData = {
      id: sys.id,
      serviceTypes: serviceTypesCollection.items,
      ...rest
    };

    expect(resolvedServiceLocatorSection.services).toEqual(
      new Array(99).fill(expectedService)
    );
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      rooferFilter: {
        entryType: serviceLocatorSection.type,
        tag: "market__tag"
      },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: 100,
      skip: 0
    });
  });

  it("should send only one request for services if there are 100 services", async () => {
    const service = createContentfulService();
    getContentfulDataMock.mockResolvedValue({
      data: {
        rooferCollection: { total: 100, items: new Array(100).fill(service) }
      }
    });
    const serviceLocatorSection = createContentfulServiceLocatorSection();
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      serviceLocatorSection
    );

    const { sys, serviceTypesCollection, ...rest } = service;
    const expectedService: ServiceData = {
      id: sys.id,
      serviceTypes: serviceTypesCollection.items,
      ...rest
    };

    expect(resolvedServiceLocatorSection.services).toEqual(
      new Array(100).fill(expectedService)
    );
    expect(getContentfulDataMock).toHaveBeenCalledTimes(1);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      rooferFilter: {
        entryType: serviceLocatorSection.type,
        tag: "market__tag"
      },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: 100,
      skip: 0
    });
  });

  it("should send API requests recursively if there are more than 100 services", async () => {
    const service = createContentfulService();
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        rooferCollection: { total: 101, items: new Array(100).fill(service) }
      }
    });
    getContentfulDataMock.mockResolvedValueOnce({
      data: {
        rooferCollection: { total: 101, items: [service] }
      }
    });
    const serviceLocatorSection = createContentfulServiceLocatorSection();
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      serviceLocatorSection
    );

    const { sys, serviceTypesCollection, ...rest } = service;
    const expectedService: ServiceData = {
      id: sys.id,
      serviceTypes: serviceTypesCollection.items,
      ...rest
    };

    expect(resolvedServiceLocatorSection.services).toEqual(
      new Array(101).fill(expectedService)
    );
    expect(getContentfulDataMock).toHaveBeenCalledTimes(2);
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      rooferFilter: {
        entryType: serviceLocatorSection.type,
        tag: "market__tag"
      },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: 100,
      skip: 0
    });
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      rooferFilter: {
        entryType: serviceLocatorSection.type,
        tag: "market__tag"
      },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: 100,
      skip: 100
    });
  });

  it("returns correct data if all the allowed fields provided", async () => {
    const service = createContentfulService();
    getContentfulDataMock.mockResolvedValue({
      data: {
        rooferCollection: { total: 10, items: new Array(10).fill(service) }
      }
    });
    const serviceLocatorSection = createContentfulServiceLocatorSection({
      __typename: "ServiceLocatorSection",
      body: createContentfulRichText(),
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "Title",
      label: "Label",
      position: 100,
      centre: {
        lat: 11,
        lon: 11
      },
      zoom: 8
    });
    const resolvedServiceLocatorSection = await resolveServiceLocatorSection(
      serviceLocatorSection
    );

    const { sys, serviceTypesCollection, ...rest } = service;
    const expectedService: ServiceData = {
      id: sys.id,
      serviceTypes: serviceTypesCollection.items,
      ...rest
    };

    expect(resolvedServiceLocatorSection).toEqual({
      __typename: "ServiceLocatorSection",
      body: "resolved-rich-text",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "Title",
      label: "Label",
      position: 100,
      centre: {
        lat: 11,
        lon: 11
      },
      zoom: 8,
      services: new Array(10).fill(expectedService)
    });
    expect(richTextResolverMock).toHaveBeenCalledWith(
      serviceLocatorSection.body
    );
    expect(getContentfulDataMock).toHaveBeenCalledWith(expect.any(String), {
      rooferFilter: {
        entryType: serviceLocatorSection.type,
        tag: "market__tag"
      },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: 100,
      skip: 0
    });
  });
});
