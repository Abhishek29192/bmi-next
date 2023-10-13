import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import {
  Catalogue,
  Category,
  Certification,
  Course,
  createCatalogue,
  createCategory,
  createCertification,
  createCourse,
  createExtendedCourse
} from "@bmi/docebo-types";
import { DoceboApiService, PAGE_SIZE } from "../services";
import { DoceboApiServiceParams, DoceboData } from "../types";

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock as typeof fetch;

const getMockedDoceboData = <
  T extends Catalogue | Category | Certification | Course
>(
  data: Partial<DoceboData<T>["data"]> = {}
): DoceboData<T> => ({
  data: {
    count: 1,
    has_more_data: false,
    current_page: 1,
    current_page_size: 50,
    total_page_count: 400,
    total_count: 7,
    sort: [],
    items: [],
    ...data
  }
});

const defaultParams: DoceboApiServiceParams = {
  apiUrl: "https://fake-url/",
  clientId: "abc-123",
  clientSecret: "secret",
  username: "username",
  password: "password"
};
const accessToken = "access-token";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("services", () => {
  describe("fetches data", () => {
    beforeEach(() => {
      jest
        .spyOn(DoceboApiService.prototype, "getAccessToken")
        .mockResolvedValue(accessToken);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe("fetchCourses", () => {
      it("should fetch courses", async () => {
        const course = createCourse();
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: getMockedDoceboData({ items: [course] })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCourses({});
        expect(docepoApi.getAccessToken).toHaveBeenCalled();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/courses?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([course]);
      });

      it("sends request twice if the first request returns has_more_data === true and ignoreNextPage === false", async () => {
        const course1 = createCourse({ id_course: 1 });
        const course2 = createCourse({ id_course: 2 });
        mockResponses(
          fetchMock,
          {
            url: `${defaultParams.apiUrl}learn/v1/courses?page=1&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({ items: [course1], has_more_data: true })
          },
          {
            url: `${defaultParams.apiUrl}learn/v1/courses?page=2&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [course2],
              has_more_data: false
            })
          }
        );

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCourses({ ignoreNextPage: false });
        //because fetchCourses gets called twice in order to fetch all pages
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        //first api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/courses?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        //second api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/courses?page=2&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([course1, course2]);
      });

      it("should not send request twice if the first request returns has_more_data === true and 'ignoreNextPage' property provided", async () => {
        const course = createCourse({ id_course: 1 });
        mockResponses(fetchMock, {
          url: `${defaultParams.apiUrl}learn/v1/courses?page=1&page_size=${PAGE_SIZE}`,
          method: "GET",
          status: 200,
          body: getMockedDoceboData({
            items: [course],
            has_more_data: true
          })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCourses({
          ignoreNextPage: true
        });
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/courses?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([course]);
      });
    });

    describe("fetchCatalogues", () => {
      it("should fetch catalogues", async () => {
        const catalogue = createCatalogue();
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: getMockedDoceboData({ items: [catalogue] })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCatalogues({});
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/catalog?page=1&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([catalogue]);
      });

      it("should only fetch those catalogues", async () => {
        const catalogueIds = [1, 5, 7];
        const mockedCatalogues = [...catalogueIds, 14, 37, 12].map(
          (catalogId) => createCatalogue({ catalogue_id: catalogId })
        );
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: getMockedDoceboData({ items: mockedCatalogues })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const response = await docepoApi.fetchCatalogues({ catalogueIds });
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(1);
        expect(response.length).toEqual(catalogueIds.length);
        response.map(({ catalogue_id }) => {
          expect(catalogueIds.includes(catalogue_id)).toBe(true);
        });
      });

      it("sends request twice if the first request returns has_more_data === true", async () => {
        const catalogue1 = createCatalogue({ catalogue_id: 1 });
        const catalogue2 = createCatalogue({ catalogue_id: 2 });
        mockResponses(
          fetchMock,
          {
            url: `${defaultParams.apiUrl}learn/v1/catalog?page=1&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [catalogue1],
              has_more_data: true
            })
          },
          {
            url: `${defaultParams.apiUrl}learn/v1/catalog?page=2&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [catalogue2],
              has_more_data: false
            })
          }
        );

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCatalogues({});
        //because fetchCatalogues gets called twice in order to fetch all pages
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(2);
        expect(docepoApi.getAccessToken).toHaveBeenCalled();
        expect(fetchMock).toHaveBeenCalledTimes(2);
        //first api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/catalog?page=1&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        //second api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/catalog?page=2&page_size=${PAGE_SIZE}&show_item_list=1&items_per_catalog=99`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([catalogue1, catalogue2]);
      });
    });

    describe("fetchCategories", () => {
      it("should fetch categories", async () => {
        const category = createCategory();
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: getMockedDoceboData({ items: [category] })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const response = await docepoApi.fetchCategories({});
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(1);
        expect(docepoApi.getAccessToken).toHaveBeenCalled();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/categories?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(response).toEqual([category]);
      });

      it("sends request twice if the first request returns has_more_data === true", async () => {
        const category1 = createCategory({ code: "category-1" });
        const category2 = createCourse({ code: "category-2" });
        mockResponses(
          fetchMock,
          {
            url: `${defaultParams.apiUrl}learn/v1/categories?page=1&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [category1],
              has_more_data: true
            })
          },
          {
            url: `${defaultParams.apiUrl}learn/v1/categories?page=2&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [category2],
              has_more_data: false
            })
          }
        );

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCategories({});
        //because fetchCategories gets called twice in order to fetch all pages
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        //first api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/categories?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        //second api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/categories?page=2&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([category1, category2]);
      });
    });

    describe("fetchCertifications", () => {
      it("should fetch certifications", async () => {
        const certification = await createCertification();
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: getMockedDoceboData({ items: [certification] })
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const response = await docepoApi.fetchCertifications({});
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/certification?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(response).toEqual([certification]);
      });

      it("sends request twice if the first request returns has_more_data === true", async () => {
        const certification1 = createCertification({ id_cert: 1 });
        const certification2 = createCertification({ id_cert: 2 });
        mockResponses(
          fetchMock,
          {
            url: `${defaultParams.apiUrl}learn/v1/certification?page=1&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [certification1],
              has_more_data: true
            })
          },
          {
            url: `${defaultParams.apiUrl}learn/v1/certification?page=2&page_size=${PAGE_SIZE}`,
            method: "GET",
            status: 200,
            body: getMockedDoceboData({
              items: [certification2],
              has_more_data: false
            })
          }
        );

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.fetchCertifications({});
        //because fetchCertifications gets called twice in order to fetch all pages
        expect(docepoApi.getAccessToken).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        //first api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/certification?page=1&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        //second api call
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/certification?page=2&page_size=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual([certification1, certification2]);
      });
    });

    describe("getCourseById", () => {
      it("fetches course by id correctly", async () => {
        const coureId = 1;
        const course = createExtendedCourse({ id: coureId });
        mockResponses(fetchMock, {
          url: "*",
          method: "GET",
          status: 200,
          body: { data: course }
        });

        const docepoApi = new DoceboApiService(defaultParams);
        const res = await docepoApi.getCourseById(coureId);
        expect(docepoApi.getAccessToken).toHaveBeenCalled();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${defaultParams.apiUrl}learn/v1/courses/${coureId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        expect(res).toEqual(course);
      });
    });
  });

  describe("getAccessToken", () => {
    it("should return already existing access token", async () => {
      const docepoApi = new DoceboApiService(defaultParams);
      docepoApi.accessToken = accessToken;
      const result = await docepoApi.getAccessToken();

      expect(fetchMock).toHaveBeenCalledTimes(0);
      expect(result).toBe(accessToken);
    });

    it("should send a request for a new token if token does not exist", async () => {
      const newToken = "new-access-token";
      mockResponses(fetchMock, {
        url: "*",
        method: "POST",
        status: 200,
        body: {
          access_token: newToken,
          expires_in: 5,
          token_type: "token_type",
          scope: "scope",
          refresh_token: "refresh_token"
        }
      });

      const docepoApi = new DoceboApiService(defaultParams);
      docepoApi.accessToken = undefined;
      const result = await docepoApi.getAccessToken();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        `${defaultParams.apiUrl}oauth2/token`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            client_id: defaultParams.clientId,
            client_secret: defaultParams.clientSecret,
            grant_type: "password",
            scope: "api",
            username: defaultParams.username,
            password: defaultParams.password
          })
        }
      );
      expect(result).toBe(newToken);
    });
  });
});
