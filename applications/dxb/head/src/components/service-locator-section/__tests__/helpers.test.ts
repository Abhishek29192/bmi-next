import * as GoogleMockApi from "@bmi-digital/components";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import {
  calculateCenter,
  createCompanyDetails,
  createMarker,
  filterServices,
  getFilterOptions,
  getResultDataGtm,
  getRooferTypes,
  getTypesFromServices,
  sortServices,
  typeFilter,
  useScrollTo
} from "../helpers";
import {
  BranchTypesEnum,
  EntryTypeEnum,
  MerchantTypesEnum,
  RooferTypesEnum,
  ServiceType
} from "../../Service";
import createService from "../../../__tests__/ServiceHelper";
import * as devLog from "../../../utils/devLog";
import { DEFAULT_MAP_CENTRE, EVENT_CAT_ID_SELECTOR_CARDS } from "../constants";

jest.spyOn(devLog, "devLog");

afterEach(jest.clearAllMocks);

const createActiveFilterMocks = (
  typeOfMock: "roofer" | "branch" | "merchant"
): Record<ServiceType, boolean> => {
  const obj = {
    roofer: RooferTypesEnum,
    merchant: MerchantTypesEnum,
    branch: BranchTypesEnum
  };
  return {
    // eslint-disable-next-line security/detect-object-injection
    ...Object.values(obj[typeOfMock]).reduce(
      (acc, key) => ({
        ...acc,
        [key]: false
      }),
      {}
    )
  };
};

describe("helpers functions", () => {
  describe("createCompanyDetails", () => {
    const getMicroCopyMock = jest
      .fn()
      .mockImplementation((copy: string) => copy);
    it("should return details array for sectionType = ROOFER_TYPE", () => {
      const service = createService({
        type: [RooferTypesEnum.PITCHED_ROOF]
      });
      const details = createCompanyDetails(
        EntryTypeEnum.ROOFER_TYPE,
        service,
        false,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const typeObject = details.find(
        (item) => item.label === "findARoofer.roofTypeLabel"
      );
      expect(typeObject.label).toBeTruthy();
    });
    it("should return details array for sectionType = BRANCH_TYPE", () => {
      const service = createService();
      const details = createCompanyDetails(
        EntryTypeEnum.BRANCH_TYPE,
        service,
        false,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const faxObject = details.find((item) => item.label === "global.fax");
      expect(faxObject.label).toBeTruthy();
    });
    it("should return details array for sectionType = MERCHANT_TYPE", () => {
      const service = createService();
      const details = createCompanyDetails(
        EntryTypeEnum.MERCHANT_TYPE,
        service,
        false,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const faxObject = details.find((item) => item.label === "global.fax");
      const typeObject = details.find(
        (item) => item.label === "findARoofer.roofTypeLabel"
      );
      expect(faxObject).toBeFalsy();
      expect(typeObject).toBeFalsy();
    });
    it("should return empty details array for sectionType = undefined", () => {
      const service = createService();
      const sectionType = undefined;
      const details = createCompanyDetails(
        sectionType,
        service,
        false,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      expect(devLog.devLog).toHaveBeenCalledWith(
        "Invalid section type passed to service locator:",
        sectionType
      );
      expect(details).toStrictEqual([]);
    });
  });
  describe("getTypesFromServices", () => {
    it("should collect types from services", () => {
      const services = [
        createService({
          type: [RooferTypesEnum.FLAT_ROOF, RooferTypesEnum.PITCHED_ROOF]
        }),
        createService({
          branchType: [
            BranchTypesEnum.COUNTRY_OFFICES,
            BranchTypesEnum.HEADQUARTERS
          ]
        }),
        createService({
          merchantType: [MerchantTypesEnum.BMI_ICOPAL_FLAT_ROOF_SYSTEMS]
        }),
        createService()
      ];
      const types = getTypesFromServices(services);
      expect(types).toEqual([
        ...services[0].type,
        ...services[1].branchType,
        ...services[2].merchantType
      ]);
    });
  });
  describe("getRooferTypes", () => {
    it("should filter uniqRoofersTypes array", () => {
      const uniqRooferTypesByDataMock = [...Object.values(RooferTypesEnum)];
      const allQueriesMock = [
        RooferTypesEnum.FLAT_ROOF,
        RooferTypesEnum.PITCHED_ROOF_TILE_ROOFS
      ];
      const resultRooferTypes = getRooferTypes(
        uniqRooferTypesByDataMock,
        allQueriesMock
      );
      expect(resultRooferTypes).toStrictEqual(allQueriesMock);
    });
    it("should return empty array if there is no specific service types", () => {
      const uniqRooferTypesByDataMock = [
        ...Object.values(RooferTypesEnum).splice(2)
      ];
      const allQueriesMock = [
        RooferTypesEnum.PITCHED_ROOF,
        RooferTypesEnum.FLAT_ROOF
      ];
      const resultRooferTypes = getRooferTypes(
        uniqRooferTypesByDataMock,
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
            mockServiceA,
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
      it("should return 1 if serviceNameA > serviceNameB", () => {
        const sortResult = sortServices(null)(mockServiceA, {
          mockServiceB,
          ...{ name: "AServiceB_name" }
        });
        expect(sortResult).toStrictEqual(1);
      });
    });
  });
  describe("typeFilter", () => {
    const typeDataMock = {
      type: [
        RooferTypesEnum.PITCHED_ROOF_ROOF_COATERS,
        RooferTypesEnum.PITCHED_ROOF_TILE_ROOFS
      ],
      branchType: null,
      merchantType: null
    };
    const branchTypeDataMock = {
      type: null,
      branchType: [
        BranchTypesEnum.HEADQUARTERS,
        BranchTypesEnum.COUNTRY_OFFICES
      ],
      merchantType: null
    };
    const merchantTypeDataMock = {
      type: null,
      branchType: null,
      merchantType: [
        MerchantTypesEnum.DISTRIBUTEURS_SIPLAST,
        MerchantTypesEnum.DISTRIBUTEURS_MONIER
      ]
    };
    describe('typeData = Service["type"]', () => {
      it("should return true if all chips unselected", () => {
        const rooferTypesFiltersMock = createActiveFilterMocks("roofer");
        const typeFilters = typeFilter(typeDataMock, rooferTypesFiltersMock);
        expect(typeFilters).toBeTruthy();
      });
      it("should return true if some chip is selected", () => {
        const rooferTypesFiltersMock = createActiveFilterMocks("roofer");
        const filtersMock = {
          ...rooferTypesFiltersMock,
          [RooferTypesEnum.PITCHED_ROOF_TILE_ROOFS]: true
        };
        const typeFilters = typeFilter(typeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    describe('typeData = Service["branchType"]', () => {
      it("should return true if some chip is selected", () => {
        const branchTypesFiltersMock = createActiveFilterMocks("branch");
        const filtersMock = {
          ...branchTypesFiltersMock,
          [BranchTypesEnum.HEADQUARTERS]: true
        };
        const typeFilters = typeFilter(branchTypeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    describe('typeData = Service["merchantType"]', () => {
      it("should return true if some chip is selected", () => {
        const merchantTypesFiltersMock = createActiveFilterMocks("merchant");
        const filtersMock = {
          ...merchantTypesFiltersMock,
          [MerchantTypesEnum.DISTRIBUTEURS_MONIER]: true
        };
        const typeFilters = typeFilter(merchantTypeDataMock, filtersMock);
        expect(typeFilters).toBeTruthy();
      });
    });
    it("should return true if service's types are null", () => {
      const typesData = {
        type: null,
        branchType: null,
        merchantType: null
      };
      const typeFilters = typeFilter(
        typesData,
        createActiveFilterMocks("roofer")
      );
      expect(typeFilters).toBeTruthy();
    });
  });
  describe("filterServices", () => {
    it("should return array of services with distance field if service is in radius", () => {
      const distanceMock = 30000;
      jest
        .spyOn(GoogleMockApi, "computeDistanceBetween")
        .mockReturnValue(distanceMock);
      const servicesMock = [createService({ distance: undefined })];
      const centerMock = { lat: 59, lng: 10 };
      const activeFiltersMock = createActiveFilterMocks("roofer");
      const result = servicesMock.reduce(
        filterServices(centerMock, activeFiltersMock, ""),
        []
      );
      expect(result[0].distance).toStrictEqual(distanceMock);
    });
    it("should return array of services without distance field if service isn't in radius", () => {
      const distanceMock = 1000000;
      jest
        .spyOn(GoogleMockApi, "computeDistanceBetween")
        .mockReturnValue(distanceMock);
      const servicesMock = [createService({ distance: undefined })];
      const centerMock = { lat: 59, lng: 10 };
      const activeFiltersMock = createActiveFilterMocks("roofer");
      const result = servicesMock.reduce(
        filterServices(centerMock, activeFiltersMock, ""),
        []
      );
      expect(result.length).toBe(0);
    });
  });
  describe("getResultDataGtm", () => {
    const serviceMock = createService({ certification: "expert" });
    const { name, address, certification, type, entryType } = serviceMock;
    it("should return dataGtm object with service.certification in label if matches === true", () => {
      const result = getResultDataGtm(serviceMock, true);
      const expectResult = {
        id: EVENT_CAT_ID_SELECTOR_CARDS,
        label: `${name} - ${address} - ${certification}${
          type && type.length === 1 ? ` - ${type[0]}` : ` - ${entryType}`
        } - selected`,
        action: "Expanded company details"
      };
      expect(result).toEqual(expectResult);
    });
    it("should return dataGtm object without service.certification in label if matches === false", () => {
      const result = getResultDataGtm(serviceMock, false);
      const expectResult = {
        id: EVENT_CAT_ID_SELECTOR_CARDS,
        label: `${name} - ${address}${
          type && type.length === 1 ? ` - ${type[0]}` : ` - ${entryType}`
        } - selected`,
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
  describe("calculateCenter", () => {
    const centreMock = { lat: 10, lng: 20 };
    const initialMapCentreMock = { lat: 1, lon: 30 };
    it("should return centre = centreMock", () => {
      const centre = calculateCenter(centreMock, initialMapCentreMock);
      expect(centre).toEqual(centreMock);
    });
    it("should return centre = initialMapCentreMock", () => {
      const modifiedInitialMapCentre = {
        lat: initialMapCentreMock.lat,
        lng: initialMapCentreMock.lon
      };
      const centre = calculateCenter(null, initialMapCentreMock);
      expect(centre).toEqual(modifiedInitialMapCentre);
    });
    it("should return centre = DEFAULT_MAP_CENTRE", () => {
      const centre = calculateCenter(null, null);
      expect(centre).toEqual(DEFAULT_MAP_CENTRE);
    });
  });
  describe("useScrollTo", () => {
    it("should execute scrollTo function if card expansion completed", () => {
      React.useState = jest.fn().mockReturnValueOnce([true, {}]);
      const ref = {
        current: {
          parentElement: { scrollTo: jest.fn() }
        }
      };
      renderHook(() => useScrollTo(true, ref));
      expect(ref.current.parentElement.scrollTo).toHaveBeenCalledTimes(1);
    });
    it("shouldn't execute scrollTo function if card expansion didn't completed", () => {
      React.useState = jest.fn().mockReturnValueOnce([false, {}]);
      const ref = {
        current: {
          parentElement: { scrollTo: jest.fn() }
        }
      };
      renderHook(() => useScrollTo(true, ref));
      expect(ref.current.parentElement.scrollTo).toHaveBeenCalledTimes(0);
    });
  });
});
