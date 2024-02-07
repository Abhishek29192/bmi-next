import {
  createCatalogue,
  createCourseSession,
  createExtendedCourse
} from "@bmi/docebo-types";
import { fetchDoceboData } from "../doceboDataHandler";

const fetchCataloguesMock = jest.fn();
const getCourseByIdMock = jest.fn();
const getCurrencyMock = jest.fn();

jest.mock("@bmi/docebo-api", () => ({
  ...jest.requireActual("@bmi/docebo-api"),
  getCachedDoceboApi: () => ({
    fetchCatalogues: fetchCataloguesMock,
    getCourseById: getCourseByIdMock,
    getCurrency: getCurrencyMock
  })
}));

afterEach(() => {
  jest.resetAllMocks();
});

const catalogue = createCatalogue();
beforeEach(() => {
  fetchCataloguesMock.mockResolvedValue([catalogue]);
  getCurrencyMock.mockResolvedValue({
    currency_currency: "EUR",
    currency_symbol: "€"
  });
});

describe("fetchDoceboData", () => {
  it("throws an error if 'fetchCatalogues' request fails", async () => {
    const error = new Error("An error occurred");
    fetchCataloguesMock.mockRejectedValue(error);
    await expect(fetchDoceboData(1, [])).rejects.toThrow(
      `Did not manage to pull Docebo data: ${JSON.stringify(error)}`
    );
  });

  it("returns an empty array if 'fetchCatalogues' returns undefined", async () => {
    fetchCataloguesMock.mockResolvedValue(undefined);
    const res = await fetchDoceboData(1, ["1", "2"]);
    expect(res).toEqual([]);
  });

  it("returns an empty array if 'fetchCatalogues' returns an empty array", async () => {
    fetchCataloguesMock.mockResolvedValue([]);
    const res = await fetchDoceboData(1, ["1", "2"]);
    expect(res).toEqual([]);
  });

  it("throws an error if getCourseById request fails", async () => {
    const error = new Error("Expected error");
    getCourseByIdMock.mockRejectedValue(error);
    await expect(fetchDoceboData(1, ["1", "2"])).rejects.toThrow(
      `Did not manage to pull Docebo data: ${JSON.stringify(error)}`
    );
  });

  it("returns an empty array if course does not have sessions", async () => {
    getCourseByIdMock.mockResolvedValue(
      createExtendedCourse({ sessions: undefined })
    );

    const res = await fetchDoceboData(1, ["1"]);
    expect(res).toEqual([]);
  });

  it("throws error correctly if getCurrency request fails", async () => {
    const error = new Error("Currency does not exist");
    getCurrencyMock.mockRejectedValue(error);

    await expect(fetchDoceboData(1, ["1", "2"])).rejects.toThrow(
      `Did not manage to pull Docebo data: ${JSON.stringify(error)}`
    );
  });

  it("returns an empty array if getCurrency request returns undefined", async () => {
    getCurrencyMock.mockResolvedValue(undefined);
    const res = await fetchDoceboData(1, ["1", "2"]);
    expect(res).toEqual([]);
  });

  it("filters out outdated sessions", async () => {
    const upcomingDate = new Date();
    upcomingDate.setSeconds(upcomingDate.getSeconds() + 3600);
    const session1 = createCourseSession({
      id_session: 1,
      start_date: upcomingDate.toString()
    });
    const session2 = createCourseSession({
      id_session: 2,
      start_date: "2022-09-13 23:59:59"
    });
    const course = createExtendedCourse({
      id: 1,
      sessions: [session1, session2]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    getCourseByIdMock.mockResolvedValue(course);

    const res = await fetchDoceboData(1, ["1"]);
    expect(res).toEqual([
      {
        id: `${catalogue.catalogue_id}-${course.id}-${session1.id_session}`,
        sessionId: session1.id_session,
        sessionName: session1.name,
        sessionSlug: session1.slug_name,
        startDate: session1.start_date,
        endDate: session1.end_date,
        courseId: course.id,
        courseName: course.name,
        courseSlug: course.slug_name,
        courseCode: course.code,
        courseType: course.type,
        courseImg: course.thumbnail,
        category: "Flat",
        onSale: course.on_sale,
        price: course.price,
        currency: "EUR",
        currencySymbol: "€",
        catalogueId: catalogue.catalogue_id.toString(),
        catalogueName: catalogue.catalogue_name,
        catalogueDescription: catalogue.catalogue_description
      }
    ]);
  });
});
