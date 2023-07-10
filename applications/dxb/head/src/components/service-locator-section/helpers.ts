import {
  computeDistanceBetween,
  LatLngLiteral,
  MarkerOptionsWithData
} from "@bmi-digital/components";
import uniqBy from "lodash-es/uniqBy";
import { ServiceTypeFilter } from "../Service";
import { Data as ServiceType } from "../ServiceType";
import {
  DEFAULT_MAP_CENTRE,
  EVENT_CAT_ID_SELECTOR_CARDS,
  EVENT_CAT_ID_SELECTOR_CARDS_MAP_PIN,
  FILTER_RADIUS
} from "./constants";
import { Service } from "./index";

export const getTypesFromServices = (services: Service[]): ServiceType[] => {
  return uniqBy(
    services.reduce<ServiceType[]>((acc, service) => {
      if (service.serviceTypes) {
        return [...acc, ...service.serviceTypes];
      }
      return acc;
    }, []),
    "name"
  );
};

export const getRooferTypes = (
  uniqueRoofTypeByData: ServiceType[],
  allQueries: string[]
): ServiceType[] => {
  return uniqueRoofTypeByData.reduce<ServiceType[]>((types, type) => {
    allQueries.find(
      (query) => query.toLowerCase() === type.name.toLowerCase()
    ) && types.push(type);
    return types;
  }, []);
};

export const createMarker = (selectedRoofer: Service | null) => {
  return (service: Service): MarkerOptionsWithData<Service> => ({
    title: service.name,
    position: {
      lat: service.location.lat,
      lng: service.location.lon
    },
    isActive: selectedRoofer?.id === service.id,
    data: service,
    "data-gtm": JSON.stringify(getResultDataGtm(service, true))
  });
};

export const getDistanceSort = (
  centre: LatLngLiteral | null,
  serviceA: Service,
  serviceB: Service
): number => {
  const distanceSort = centre
    ? (serviceA.distance ?? 0) - (serviceB.distance ?? 0)
    : 0;

  return distanceSort;
};

export const sortServices = (centre: LatLngLiteral | null) => {
  return (serviceA: Service, serviceB: Service): number => {
    if (getDistanceSort(centre, serviceA, serviceB) === 0) {
      const serviceNameA = serviceA.name.toLowerCase();
      const serviceNameB = serviceB.name.toLowerCase();

      if (serviceNameA === serviceNameB) {
        return 0;
      } else {
        // according to the issue (https://bmigroup.atlassian.net/browse/DXB-3542) with special characters Ç Ş changed rule for sorting to localeCompare
        return serviceNameA.localeCompare(serviceNameB);
      }
    }

    return getDistanceSort(centre, serviceA, serviceB);
  };
};

export const typeFilter = (
  typeData: ServiceType[],
  activeFilters: ServiceTypeFilter
): boolean => {
  // const { type, branchType, merchantType } = typeData;
  // user has not selected any chip(s) to filter hence show all services
  // i.e initial load or user has de-selected ALL chips
  const allChipsUnSelected = Object.keys(activeFilters).every(
    // eslint-disable-next-line security/detect-object-injection
    (key) => activeFilters[key] === false
  );

  if (allChipsUnSelected) {
    return true;
  }

  // user has selected the filter chip the service must have type and it must match
  const isSomeChipSelected = Object.keys(activeFilters).some(
    // eslint-disable-next-line security/detect-object-injection
    (key) => activeFilters[key] === true
  );

  if (isSomeChipSelected) {
    // eslint-disable-next-line security/detect-object-injection
    return typeData?.some((filter) => activeFilters[filter.name]) || false;
  }
  // service's types are null hence return true
  return true;
};

export const filterServices = (
  centre: LatLngLiteral | null,
  activeFilters: ServiceTypeFilter,
  activeSearchString: string
): ((carry: Service[], current: Service) => Service[]) => {
  return (carry, current) => {
    const { name, location, serviceTypes } = current;
    const isServiceNameIncludingSearchStr = name.includes(activeSearchString);
    const distance = centre
      ? computeDistanceBetween(centre, {
          lat: location.lat,
          lng: location.lon
        })
      : undefined;
    const isServiceInRadius = distance ? distance < FILTER_RADIUS : true;
    const isServiceTypeChosen = typeFilter(serviceTypes, activeFilters);
    if (
      isServiceTypeChosen &&
      isServiceNameIncludingSearchStr &&
      isServiceInRadius
    ) {
      return [
        ...carry,
        {
          ...current,
          distance
        }
      ];
    }

    return carry;
  };
};

export const getResultDataGtm = (
  service: Service,
  isMarker = false
): { id: string; label: string; action: string; event: string } => {
  const { name, address, certification, serviceTypes, entryType } = service;
  const label = `${name} - ${address}${
    certification ? ` - ${certification}` : ""
  }${
    serviceTypes && serviceTypes.length === 1
      ? ` - ${serviceTypes[0].name}`
      : ` - ${entryType}`
  } - selected`;
  return {
    id: isMarker
      ? EVENT_CAT_ID_SELECTOR_CARDS_MAP_PIN
      : EVENT_CAT_ID_SELECTOR_CARDS,
    event: "dxb.button_click",
    label: label,
    action: "Expanded company details"
  };
};

export const getFilterOptions = (options, { inputValue }) => {
  if (inputValue.length < 2) {
    return [];
  }

  return options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );
};

export const calculateCentre = (
  centre: LatLngLiteral | null,
  initialMapCentre: { lat: number; lon: number } | null
): google.maps.LatLngLiteral => {
  return (
    centre ||
    (initialMapCentre && {
      lat: initialMapCentre.lat,
      lng: initialMapCentre.lon
    }) ||
    DEFAULT_MAP_CENTRE
  );
};
