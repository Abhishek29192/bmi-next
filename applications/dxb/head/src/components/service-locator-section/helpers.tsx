import camelCase from "lodash-es/camelCase";
import React, { useEffect, useState } from "react";
import {
  CompanyDetailProps,
  LatLngLiteral,
  RoofProLevel
} from "@bmi/components";
import { computeDistanceBetween, MarkerOptionsWithData } from "@bmi/components";
import { devLog } from "../../utils/devLog";
import {
  EntryTypeEnum,
  ServiceType,
  ServiceTypesEnum,
  ServiceTypesPrefixesEnum
} from "../Service";
import { getClickableActionFromUrl } from "../Link";
import {
  DEFAULT_MAP_CENTRE,
  EVENT_CAT_ID_LINK_CLICKS,
  EVENT_CAT_ID_SELECTOR_CARDS,
  FILTER_RADIUS
} from "./constants";
import { Service } from "./index";

const getMicroCopyForServiceType = (
  service: Service,
  localizationCb: (param: string) => string
) => {
  return Object.keys(ServiceTypesEnum).reduce((acc, nextServiceType) => {
    // eslint-disable-next-line security/detect-object-injection
    if (service[nextServiceType]) {
      // eslint-disable-next-line security/detect-object-injection
      const currentTypeMC = service[nextServiceType]
        .map((type) => {
          // eslint-disable-next-line security/detect-object-injection
          const serviceType = ServiceTypesEnum[nextServiceType];
          // eslint-disable-next-line security/detect-object-injection
          const prefix = ServiceTypesPrefixesEnum[serviceType];
          return localizationCb(`${prefix}.filters.${camelCase(type)}`).replace(
            " roof",
            ""
          );
        })
        .join(" | ");

      return [...acc, currentTypeMC];
    }
    return acc;
  }, []);
};

export const createCompanyDetails = (
  sectionType: EntryTypeEnum | undefined,
  service: Service,
  matches: boolean,
  countryCode: string,
  localizationCb: (s: string) => string,
  isAddressHidden: boolean,
  googleURLLatLng: string
) => {
  const shouldShowIcons = sectionType === EntryTypeEnum.ROOFER_TYPE;
  const isAddressClickable = sectionType === EntryTypeEnum.BRANCH_TYPE;
  const shouldShowWebsiteLinkAsLabel =
    sectionType === EntryTypeEnum.MERCHANT_TYPE;

  const localization = {
    globalAddress: localizationCb("global.address"),
    distanceLabel: localizationCb("findARoofer.distanceLabel"),
    directionsLabel: localizationCb("findARoofer.getDirectionsLabel"),
    globalTelephone: localizationCb("global.telephone"),
    globalEmail: localizationCb("global.email"),
    websiteLabel: localizationCb("findARoofer.websiteLabel"),
    globalWebsite: localizationCb("global.website"),
    faxLabel: localizationCb("global.fax"),
    roofTypeLabel: localizationCb("findARoofer.roofTypeLabel"),
    certificationLabel: localizationCb("findARoofer.certificationLabel")
  };

  const getServiceDataGTM = (action: string, linkOrButtonText?: string) => {
    const serviceType =
      (service?.type?.length && service?.type[0]) || service?.entryType;
    const label = `${service?.name} - ${service?.address}${
      service?.certification ? ` - ${service?.certification}` : ""
    } - ${serviceType}`;
    if (matches || sectionType !== EntryTypeEnum.ROOFER_TYPE) {
      return {
        id: EVENT_CAT_ID_LINK_CLICKS,
        label: `${label}${linkOrButtonText ? ` - ${linkOrButtonText}` : ""}`,
        action
      };
    } else {
      return { id: EVENT_CAT_ID_LINK_CLICKS, label, action };
    }
  };

  const actions = {
    address: getClickableActionFromUrl(
      undefined,
      `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
        service.address
      )}/`,
      countryCode,
      undefined,
      localization.globalAddress,
      undefined,
      undefined,
      getServiceDataGTM(
        `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
          service.address
        )}/`,
        localization.globalAddress
      )
    ),
    directions: getClickableActionFromUrl(
      undefined,
      `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
        service.address
      )}/`,
      countryCode,
      undefined,
      localization.directionsLabel,
      undefined,
      undefined,
      getServiceDataGTM(
        `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
          service.address
        )}/`,
        localization.directionsLabel
      )
    ),
    phone: getClickableActionFromUrl(
      undefined,
      `tel:${service.phone}`,
      countryCode,
      undefined,
      localization.globalTelephone,
      undefined,
      undefined,
      getServiceDataGTM(`tel:${service.phone}`, localization.globalTelephone)
    ),
    website: getClickableActionFromUrl(
      undefined,
      service.website,
      countryCode,
      undefined,
      shouldShowWebsiteLinkAsLabel
        ? localization.globalWebsite
        : localization.websiteLabel,
      undefined,
      undefined,
      getServiceDataGTM(
        service.website,
        shouldShowWebsiteLinkAsLabel
          ? localization.globalWebsite
          : localization.websiteLabel
      )
    ),
    email: getClickableActionFromUrl(
      undefined,
      `mailto:${service.email}`,
      countryCode,
      undefined,
      localization.globalEmail,
      undefined,
      undefined,
      getServiceDataGTM(`mailto:${service.email}`, localization.globalEmail)
    )
  };
  const address: CompanyDetailProps = {
    type: "address",
    display: shouldShowIcons ? "icon" : "contentOnly",
    text: service.address,
    label: localization.globalAddress,
    action: isAddressClickable ? actions.address : undefined
  };
  const detailsStart = isAddressHidden ? [] : [address];

  const distance: CompanyDetailProps | undefined =
    service.distance !== undefined
      ? {
          type: "distance",
          display: shouldShowIcons ? "icon" : "label",
          text: `${Math.floor(service.distance) / 1000}km`,
          label: localization.distanceLabel
        }
      : undefined;
  const directions: CompanyDetailProps | undefined = {
    type: "cta",
    text: localization.directionsLabel,
    action: actions.directions,
    label: localization.directionsLabel
  };
  const phone: CompanyDetailProps | undefined = service.phone
    ? {
        type: "phone",
        display: shouldShowIcons ? "icon" : "label",
        text: service.phone,
        action: actions.phone,
        label: localization.globalTelephone
      }
    : undefined;
  const email: CompanyDetailProps | undefined = service.email
    ? {
        type: "email",
        display: shouldShowIcons ? "icon" : "label",
        text: service.email,
        action: actions.email,
        label: localization.globalEmail
      }
    : undefined;
  const website: CompanyDetailProps | undefined = service.website
    ? {
        type: "website",
        display: shouldShowIcons ? "icon" : "label",
        text: shouldShowWebsiteLinkAsLabel
          ? service.website
          : localization.websiteLabel,
        action: actions.website,
        label: shouldShowWebsiteLinkAsLabel
          ? localization.globalWebsite
          : localization.websiteLabel
      }
    : undefined;
  const fax: CompanyDetailProps | undefined = service.fax
    ? {
        type: "content",
        text: service.fax,
        textStyle: "bold",
        label: localization.faxLabel
      }
    : undefined;
  const type: CompanyDetailProps | undefined =
    service.type || service.branchType || service.merchantType
      ? {
          type: "content",
          label: localization.roofTypeLabel,
          text: <b>{getMicroCopyForServiceType(service, localizationCb)}</b>
        }
      : undefined;

  const certification: CompanyDetailProps = service.certification
    ? {
        type: "roofProLevel",
        label: localization.certificationLabel,
        level: service.certification.toLowerCase() as RoofProLevel
      }
    : undefined;

  switch (sectionType) {
    case EntryTypeEnum.ROOFER_TYPE:
      return [
        ...detailsStart,
        distance,
        directions,
        phone,
        email,
        website,
        type,
        certification
      ].filter(Boolean);
    case EntryTypeEnum.BRANCH_TYPE:
      return [...detailsStart, distance, phone, email, fax, directions].filter(
        Boolean
      );
    case EntryTypeEnum.MERCHANT_TYPE:
      return [
        ...detailsStart,
        distance,
        phone,
        email,
        website,
        directions
      ].filter(Boolean);
    default:
      devLog("Invalid section type passed to service locator:", sectionType);
      return [];
  }
};

export const getTypesFromServices = (services: Service[]): ServiceType[] => {
  return services.reduce((acc, service) => {
    if (service.type) {
      return [...acc, ...service.type];
    }
    if (service.branchType) {
      return [...acc, ...service.branchType];
    }
    if (service.merchantType) {
      return [...acc, ...service.merchantType];
    }
    return acc;
  }, []);
};

export const getRooferTypes = (
  uniqueRoofTypeByData: ServiceType[],
  allQueries: string[]
): ServiceType[] => {
  return uniqueRoofTypeByData.reduce((types, type) => {
    allQueries.find((query) => query.toLowerCase() === type.toLowerCase()) &&
      types.push(type);
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
    isActive: selectedRoofer && selectedRoofer.id === service.id,
    data: service
  });
};

export const sortServices = (centre: LatLngLiteral | null) => {
  return (serviceA, serviceB) => {
    const distanceSort = centre ? serviceA.distance - serviceB.distance : 0;

    if (distanceSort === 0) {
      const serviceNameA = serviceA.name.toLowerCase();
      const serviceNameB = serviceB.name.toLowerCase();

      if (serviceNameA === serviceNameB) {
        return 0;
      } else {
        return serviceNameA < serviceNameB ? -1 : 1;
      }
    }

    return distanceSort;
  };
};

export const typeFilter = (
  typeData: {
    type: Service["type"] | null;
    branchType: Service["branchType"] | null;
    merchantType: Service["merchantType"] | null;
  },
  activeFilters: Record<ServiceType, boolean>
): boolean => {
  const { type, branchType, merchantType } = typeData;
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
    return (
      // eslint-disable-next-line security/detect-object-injection
      (type?.length && type.some((filter) => activeFilters[filter])) ||
      (branchType?.length &&
        // eslint-disable-next-line security/detect-object-injection
        branchType.some((filter) => activeFilters[filter])) ||
      (merchantType?.length &&
        // eslint-disable-next-line security/detect-object-injection
        merchantType.some((filter) => activeFilters[filter]))
    );
  }
  // service's types are null hence return true
  return true;
};

export const filterServices = (
  centre: LatLngLiteral | null,
  activeFilters: Record<ServiceType, boolean>,
  activeSearchString
) => {
  return (carry, current) => {
    const { name, location, type, branchType, merchantType } = current;
    const isServiceNameIncludingSearchStr = name.includes(activeSearchString);
    const distance = computeDistanceBetween(centre, {
      lat: location.lat,
      lng: location.lon
    });
    const isServiceInRadius = distance ? distance < FILTER_RADIUS : true;
    const isServiceTypeChosen = typeFilter(
      { type, branchType, merchantType },
      activeFilters
    );
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

export const getResultDataGtm = (service: Service, matches: boolean) => {
  const { name, address, certification, type, entryType } = service;
  const label = `${name} - ${address}${
    matches && certification ? ` - ${certification}` : ""
  }${
    type && type.length === 1 ? ` - ${type[0]}` : ` - ${entryType}`
  } - selected`;
  return {
    id: EVENT_CAT_ID_SELECTOR_CARDS,
    label: label,
    action: "Expanded company details"
  };
};

export const getFilterOptions = () => {
  return (options, { inputValue }) => {
    if (inputValue.length > 2) {
      return options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    // @todo Returning `false` from this function is the *only* way
    // this works to hide the dropdown but is not typed as such in
    // MaterialUI.
    return false as any;
  };
};

export const calculateCenter = (
  centre: LatLngLiteral | null,
  initialMapCentre: { lat: number; lon: number } | null
) => {
  return (
    centre ||
    (initialMapCentre && {
      lat: initialMapCentre.lat,
      lng: initialMapCentre.lon
    }) ||
    DEFAULT_MAP_CENTRE
  );
};

export const useScrollTo = (isOpen: boolean, linkCardElement: any) => {
  const [hasCardExpansionCompleted, setCardExpansionCompleted] =
    useState(false);
  useEffect(() => {
    if (isOpen && linkCardElement.current && hasCardExpansionCompleted) {
      linkCardElement.current.parentElement.scrollTo({
        top: linkCardElement.current.offsetTop + 1,
        behavior: "smooth"
      });
    }
  }, [isOpen, hasCardExpansionCompleted, linkCardElement.current]);
  return [setCardExpansionCompleted];
};
