import * as GoogleMockApi from "@bmi-digital/components";
import * as devLog from "../../../utils/devLog";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { ServiceTypeFilter } from "../../Service";
import { Data as ServiceType } from "../../ServiceType";
import {
  DEFAULT_MAP_CENTRE,
  EVENT_CAT_ID_SELECTOR_CARDS,
  EVENT_CAT_ID_SELECTOR_CARDS_MAP_PIN
} from "../constants";
import {
  calculateCentre,
  createMarker,
  filterServices,
  getFilterOptions,
  getResultDataGtm,
  getRooferTypes,
  getTypesFromServices,
  sortServices,
  typeFilter
} from "../helpers";

jest.spyOn(devLog, "devLog");

afterEach(jest.clearAllMocks);

const createActiveFilterMocks = (serviceTypesByEntityItems: ServiceType[]) => {
  return serviceTypesByEntityItems.reduce(
    (carry, key: ServiceType) => ({ ...carry, [key.name]: false }),
    {}
  ) as ServiceTypeFilter;
};

describe("helpers functions", () => {
  describe("getTypesFromServices", () => {
    it("should collect types from services", () => {
      const services = [
        createService({
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ]
        }),
        createService({
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Country Offices" },
            { __typename: "ContentfulServiceType", name: "Headquarters" }
          ]
        }),
        createService({
          serviceTypes: [
            {
              __typename: "ContentfulServiceType",
              name: "BMI Icopal Flat Roof Systems"
            }
          ]
        }),
        createService()
      ];
      const types = getTypesFromServices(services);
      expect(types).toEqual([
        ...services[0].serviceTypes,
        ...services[1].serviceTypes,
        ...services[2].serviceTypes
      ]);
    });
  });
  describe("getRooferTypes", () => {
    it("should filter uniqRoofersTypes array", () => {
      const uniqRooferTypesByDataMock: ServiceType[] = [
        { __typename: "ContentfulServiceType", name: "Flat Roof" },
        { __typename: "ContentfulServiceType", name: "Pitched Roof" }
      ];
      const allQueriesMock = ["Flat Roof", "Pitched Roof"];
      const resultRooferTypes = getRooferTypes(
        uniqRooferTypesByDataMock,
        allQueriesMock
      );
      expect(resultRooferTypes).toStrictEqual(uniqRooferTypesByDataMock);
    });
    it("should return empty array if there is no specific service types", () => {
      const uniqRooferTypesByDataMock = [
        { __typename: "ContentfulServiceType", name: "Flat Roof" },
        { __typename: "ContentfulServiceType", name: "Pitched Roof" }
      ];
      const allQueriesMock = ["Flat Roof 2"];
      const resultRooferTypes = getRooferTypes(
        uniqRooferTypesByDataMock as ServiceType[],
        allQueriesMock
      );
      expect(resultRooferTypes).toStrictEqual([]);
    });
  });
  describe("createMarker", () => {
    const selectedRooferMock = createService({ name: "selectedRoofer" });
    const serviceMock = createService({
      name: "service_mock_name"
    });
    it("should return callback function", () => {
      const createMarkerCb = createMarker(selectedRooferMock);
      expect(typeof createMarkerCb).toEqual("function");
    });
    it("should execute callback and return marker object", () => {
      const marker = createMarker(null)(serviceMock);
      expect(marker.title).toEqual("service_mock_name");
      expect(marker.isActive).toBeFalsy();
    });
    it("should return marker object with isActive = true if selectedRoofer.id === service.id", () => {
      const marker = createMarker(selectedRooferMock)(serviceMock);
      expect(marker.isActive).toBeTruthy();
    });
  });
  describe("sortServices", () => {
    const mockServiceA = createService({ name: "serviceA_name" });
    const mockServiceB = createService({ name: "serviceB_name", distance: 5 });
    it("should return distance between two services if centre !== null", () => {
      const sortResult = sortServices({ lat: 50, lng: 60 })(
        mockServiceA,
        mockServiceB
      );
      expect(sortResult).toStrictEqual(
        mockServiceA.distance - mockServiceB.distance
      );
    });
    describe("centre = null", () => {
      it("should return 0 if we have 2 services with the same name", () => {
        const sortResult = sortServices(null)(
          {
            ...mockServiceA,
            ...{
              name: mockServiceB.name
            }
          },
          mockServiceB
        );
        expect(sortResult).toStrictEqual(0);
      });
      it("should return -1 if serviceNameA < serviceNameB", () => {
        const sortResult = sortServices(null)(mockServiceA, mockServiceB);
        expect(sortResult).toStrictEqual(-1);
      });
      it("should return -1 if serviceNameA < serviceNameB for name with umlauts", () => {
        const sortResult = sortServices(null)(
          {
            ...mockServiceA,
            ...{
              name: "Çanakkale"
            }
          },
          mockServiceB
        );
        expect(sortResult).toStrictEqual(-1);
      });
      it("should return 1 if serviceNameA > serviceNameB", () => {
        const sortResult = sortServices(null)(mockServiceA, {
          ...mockServiceB,
          ...{ name: "AServiceB_name" }
        });
        expect(sortResult).toStrictEqual(1);
      });
      it("should return 1 if serviceNameA > serviceNameB for name with umlauts", () => {
        const sortResult = sortServices(null)(mockServiceA, {
          ...mockServiceB,
          ...{
            name: "Şırnak"
          }
        });
        expect(sortResult).toStrictEqual(-1);
      });
    });
  });
  describe("typeFilter", () => {
    const typeDataMock: ServiceType[] = [
      { __typename: "ContentfulServiceType", name: "Roof Coaters" },
      {
        __typename: "ContentfulServiceType",
        name: "Tile Roofs"
      }
    ];
    const branchTypeDataMock: ServiceType[] = [
      {
        __typename: "ContentfulServiceType",
        name: "Headquarters"
      },
      { __typename: "ContentfulServiceType", name: "Country offices" }
    ];
    const merchantTypeDataMock: ServiceType[] = [
      { __typename: "ContentfulServiceType", name: "Distributers Siplast" },
      { __typename: "ContentfulServiceType", name: "Distributers Monier" }
    ];
    describe('typeData = Service["type"]', () => {
      it("should return true if all chips unselected", () => {
        const rooferTypesFiltersMock = createActiveFilterMocks(typeDataMock);
        const typeFilters = typeFilter(typeDataMock, rooferTypesFiltersMock);
        expect(typeFilters).toBeTruthy();
      });
      it("should return true if some chip is selected", () => {
        const rooferTypesFiltersMock = createActiveFilterMocks([
          { __typename: "ContentfulServiceType", name: "roofer" }
        ]);
        const filtersMock = {
          ...rooferTypesFiltersMock,
          "Tile Roofs": true
        };
        const typeFilters = typeFilter(typeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    describe('typeData = Service["branchType"]', () => {
      it("should return true if some chip is selected", () => {
        const branchTypesFiltersMock = createActiveFilterMocks([
          { __typename: "ContentfulServiceType", name: "branch" }
        ]);
        const filtersMock = {
          ...branchTypesFiltersMock,
          Headquarters: true
        };
        const typeFilters = typeFilter(branchTypeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    describe('typeData = Service["merchantType"]', () => {
      it("should return true if some chip is selected", () => {
        const merchantTypesFiltersMock = createActiveFilterMocks([
          { __typename: "ContentfulServiceType", name: "merchant" }
        ]);
        const filtersMock = {
          ...merchantTypesFiltersMock,
          "Distributers Monier": true
        };
        const typeFilters = typeFilter(merchantTypeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    it("should return true if service's types are null", () => {
      const typesData = null;
      const typeFilters = typeFilter(
        typesData,
        createActiveFilterMocks([
          { __typename: "ContentfulServiceType", name: "roofer" }
        ])
      );
      expect(typeFilters).toBeTruthy();
    });
  });
  describe("filterServices", () => {
    it("should return array of services with distance field if service is in radius", () => {
      const distanceMock = 30000;
      const computeDistanceBetweenMock = jest.spyOn(
        GoogleMockApi,
        "computeDistanceBetween"
      );
      computeDistanceBetweenMock.mockReturnValue(distanceMock);
      const servicesMock = [createService({ distance: undefined })];
      const centreMock = { lat: 59, lng: 10 };
      const activeFiltersMock = createActiveFilterMocks([
        { __typename: "ContentfulServiceType", name: "roofer" }
      ]);
      const result = servicesMock.reduce(
        filterServices(centreMock, activeFiltersMock, ""),
        []
      );
      expect(result[0].distance).toStrictEqual(distanceMock);
      expect(computeDistanceBetweenMock).toHaveBeenCalledWith(centreMock, {
        lat: servicesMock[0].location.lat,
        lng: servicesMock[0].location.lon
      });
    });
    it("should return array of services without distance field if service isn't in radius", () => {
      const distanceMock = 1000000;
      const computeDistanceBetweenMock = jest.spyOn(
        GoogleMockApi,
        "computeDistanceBetween"
      );
      computeDistanceBetweenMock.mockReturnValue(distanceMock);
      const servicesMock = [createService({ distance: undefined })];
      const centreMock = { lat: 59, lng: 10 };
      const activeFiltersMock = createActiveFilterMocks([
        { __typename: "ContentfulServiceType", name: "roofer" }
      ]);
      const result = servicesMock.reduce(
        filterServices(centreMock, activeFiltersMock, ""),
        []
      );
      expect(result.length).toBe(0);
      expect(computeDistanceBetweenMock).toHaveBeenCalledWith(centreMock, {
        lat: servicesMock[0].location.lat,
        lng: servicesMock[0].location.lon
      });
    });
    it("should return array of services with distance field if centre is null", () => {
      const computeDistanceBetweenMock = jest.spyOn(
        GoogleMockApi,
        "computeDistanceBetween"
      );
      const servicesMock = [createService({ distance: undefined })];
      const activeFiltersMock = createActiveFilterMocks([
        { __typename: "ContentfulServiceType", name: "roofer" }
      ]);
      const result = servicesMock.reduce(
        filterServices(null, activeFiltersMock, ""),
        []
      );
      expect(result[0].distance).toStrictEqual(undefined);
      expect(computeDistanceBetweenMock).not.toHaveBeenCalled();
    });
  });
  describe("getResultDataGtm", () => {
    const serviceMock = createService({ certification: "expert" });
    const { name, address, certification, serviceTypes, entryType } =
      serviceMock;
    it("should return dataGtm object with service.certification in label if matches === true", () => {
      const result = getResultDataGtm(serviceMock, true);
      const expectResult = {
        id: EVENT_CAT_ID_SELECTOR_CARDS,
        label: `${name} - ${address} - ${certification}${
          serviceTypes && serviceTypes.length === 1
            ? ` - ${serviceTypes[0].name}`
            : ` - ${entryType}`
        } - selected`,
        event: "dxb.button_click",
        action: "Expanded company details"
      };
      expect(result).toEqual(expectResult);
    });
    it("should return dataGtm object without service.certification in label if matches === false", () => {
      const result = getResultDataGtm(serviceMock, false);
      const expectResult = {
        id: EVENT_CAT_ID_SELECTOR_CARDS,
        label: `${name} - ${address}${
          serviceTypes && serviceTypes.length === 1
            ? ` - ${serviceTypes[0].name}`
            : ` - ${entryType}`
        } - selected`,
        event: "dxb.button_click",
        action: "Expanded company details"
      };
      expect(result).toEqual(expectResult);
    });
    it("should return dataGtm object for marker with service.certification in label if matches === true", () => {
      const result = getResultDataGtm(serviceMock, true, true);
      const expectResult = {
        id: EVENT_CAT_ID_SELECTOR_CARDS_MAP_PIN,
        label: `${name} - ${address} - ${certification}${
          serviceTypes && serviceTypes.length === 1
            ? ` - ${serviceTypes[0].name}`
            : ` - ${entryType}`
        } - selected`,
        event: "dxb.button_click",
        action: "Expanded company details"
      };
      expect(result).toEqual(expectResult);
    });
  });
  describe("getFilterOptions", () => {
    it("should return false if input value length < 2", () => {
      const options = ["test", "1test", "2test"];
      const inputValue = "t";
      const res = getFilterOptions()(options, { inputValue });
      expect(res).toBeFalsy();
    });
    it("should return false if input value length > 2", () => {
      const options = ["test", "1 test", "2 test"];
      const inputValue = "1 te";
      const res = getFilterOptions()(options, { inputValue });
      expect(res).toStrictEqual(["1 test"]);
    });
  });
  describe("calculateCentre", () => {
    const centreMock = { lat: 10, lng: 20 };
    const initialMapCentreMock = { lat: 1, lon: 30 };
    it("should return centre = centreMock", () => {
      const centre = calculateCentre(centreMock, initialMapCentreMock);
      expect(centre).toEqual(centreMock);
    });
    it("should return centre = initialMapCentreMock", () => {
      const modifiedInitialMapCentre = {
        lat: initialMapCentreMock.lat,
        lng: initialMapCentreMock.lon
      };
      const centre = calculateCentre(null, initialMapCentreMock);
      expect(centre).toEqual(modifiedInitialMapCentre);
    });
    it("should return centre = DEFAULT_MAP_CENTRE", () => {
      const centre = calculateCentre(null, null);
      expect(centre).toEqual(DEFAULT_MAP_CENTRE);
    });
  });
});
