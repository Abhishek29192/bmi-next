import GoogleApi, {
  Google,
  GeocoderResult as GoogleGeocoderResult,
  LatLngLiteral as GoogleLatLngLiteral,
  loadGoogleApi
} from "@bmi-digital/components/google-api";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { usePathname } from "next/navigation";
import { pushToDataLayer } from "../../utils/google-tag-manager";
import RichText from "../RichText";
import { EntryTypeEnum, ServiceTypesPrefixesEnum } from "../Service";
import { useSiteContext } from "../Site";
import {
  SearchLocationBlock,
  ServiceLocatorChips,
  ServiceLocatorMap,
  ServiceLocatorResultList,
  createCompanyDetails
} from "./components";
import {
  DEFAULT_LEVEL_ZOOM,
  PAGE_SIZE,
  PLACE_LEVEL_ZOOM,
  QUERY_CHIP_FILTER_KEY
} from "./constants";
import {
  createMarker,
  filterServices,
  getResultDataGtm,
  getRooferTypes,
  getTypesFromServices,
  sortServices
} from "./helpers";
import {
  Body,
  Controls,
  MapTabPanel,
  ResultListTabPanel,
  StyledTabs,
  classes
} from "./styles/styles";
import type { CompanyDetailProps } from "@bmi-digital/components/company-details";
import type { Data as ServiceType } from "../ServiceType";
import type { Data as ServiceData, ServiceTypeFilter } from "../Service";
import type { RichTextData } from "../RichText";
import type { Data as ContentfulImageData } from "../image/contentful-image/types";

export type Service = Omit<ServiceData, "companyLogo" | "summary"> & {
  distance?: number;
  companyLogo?: ContentfulImageData;
  summary: string | null;
};

export type Data = {
  __typename: "ServiceLocatorSection";
  type: EntryTypeEnum;
  showDefaultResultList: boolean;
  title: string;
  label: string;
  body: RichTextData | null;
  services: Service[] | null;
  position: number;
  centre: {
    lat: number;
    lon: number;
  } | null;
  zoom: number | null;
};

declare global {
  interface Window {
    google?: Google;
  }
}

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const {
    type: sectionType,
    showDefaultResultList,
    label,
    body,
    services,
    position,
    centre: initialMapCentre,
    zoom: initialMapZoom
  } = data;

  const shouldEnableSearch = sectionType !== EntryTypeEnum.BRANCH_TYPE;
  const isBranchLocator = sectionType == EntryTypeEnum.BRANCH_TYPE;

  const { getMicroCopy } = useSiteContext();
  const isClient = typeof window !== "undefined";
  const searchParams = useMemo(
    () => new URLSearchParams(isClient ? window.location.search : null),
    [isClient]
  );
  const pathname = usePathname();

  const userQueryString = useMemo(
    () => searchParams.get(QUERY_CHIP_FILTER_KEY),
    [searchParams]
  );
  const [uniqueRoofTypeByData, setUniqueRoofTypeByData] = useState([]);
  const [isUserAction, setUserAction] = useState(false);
  const [page, setPage] = useState(1);
  const [pagedFilteredRoofers, setPagedFilteredRoofers] = useState<Service[]>(
    []
  );
  const [showResultList, setShowResultList] = useState(showDefaultResultList);
  const [googleApi, setGoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<Service | null>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral | undefined>();
  const [zoom, setZoom] = useState<number>(
    initialMapZoom || DEFAULT_LEVEL_ZOOM
  );
  const [activeSearchString, setActiveSearchString] = useState<string>("");
  const [userPosition, setUserPosition] = useState<
    | undefined
    | {
        location: GoogleLatLngLiteral;
      }
  >();

  const nameSearchLabelKey = getMicroCopy(
    `findARoofer.${
      sectionType === EntryTypeEnum.MERCHANT_TYPE
        ? "merchantNameSearchLabel"
        : "companyFieldLabel"
    }`
  );

  const serviceTypesByEntityItems: ServiceType[] = services
    ? getTypesFromServices(services)
    : [];

  const activeFilterReducer = (
    state: ServiceTypeFilter,
    filter: {
      serviceType: ServiceType;
      state?: boolean;
    }
  ) => {
    const result = {
      ...state,
      [filter.serviceType.name]: filter.state
        ? filter.state
        : !state[filter.serviceType.name]
    };
    return result;
  };

  const initialActiveFilters = (
    serviceTypesByEntityItems as ServiceType[]
  ).reduce(
    (carry, key: ServiceType) => ({ ...carry, [key.name]: false }),
    {}
  ) as ServiceTypeFilter;

  const [activeFilters, updateActiveFilters] = useReducer(
    activeFilterReducer,
    initialActiveFilters
  );

  const filteredRoofers = useMemo<Service[]>(
    () =>
      (services || [])
        .reduce(filterServices(centre, activeFilters, activeSearchString), [])
        .sort(sortServices(centre)),
    [activeFilters, activeSearchString, centre, services]
  );

  const markers = useMemo(
    () =>
      showResultList
        ? pagedFilteredRoofers.map(createMarker(selectedRoofer))
        : [],
    [selectedRoofer, pagedFilteredRoofers, showResultList]
  );

  const handlePageChange = (
    _: React.ChangeEvent<HTMLElement>,
    pageNumber: number
  ) => {
    setPagedFilteredRoofers(() => {
      const start = (pageNumber - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      return filteredRoofers.slice(start, end);
    });
    setSelectedRoofer(null);
    setPage(pageNumber);
  };

  useEffect(() => {
    setPagedFilteredRoofers(filteredRoofers.slice(0, PAGE_SIZE));
    setPage(1);
  }, [filteredRoofers]);

  const pageCount = Math.ceil(filteredRoofers.length / PAGE_SIZE);

  const handleServiceClick = (service: Service, isMarker = false) => {
    setSelectedRoofer(service);
    if (isMarker) {
      pushToDataLayer(getResultDataGtm(service, isMarker));
    }
  };

  const handlePlaceChange = (location?: GoogleGeocoderResult) => {
    // We want to clear the service whenever the place changes.
    if (location) {
      setShowResultList(true);
    }
    setSelectedRoofer(null);
    setZoom(location ? PLACE_LEVEL_ZOOM : initialMapZoom || DEFAULT_LEVEL_ZOOM);
    setCentre(
      location && {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng()
      }
    );
  };

  const clearRooferAndResetMap = () => {
    setSelectedRoofer(null);
    setZoom(centre ? PLACE_LEVEL_ZOOM : initialMapZoom || DEFAULT_LEVEL_ZOOM);
    setCentre(centre);
  };

  const getCompanyDetails = (service: Service): CompanyDetailProps => {
    return createCompanyDetails({ sectionType, service, getMicroCopy, centre });
  };

  const getMicroCopyPrefix = (serviceType: EntryTypeEnum) => {
    // eslint-disable-next-line security/detect-object-injection
    return ServiceTypesPrefixesEnum[serviceType];
  };

  const microCopyPrefix = getMicroCopyPrefix(sectionType);

  const handleAutocompleteOnChange = (_, inputValue) => {
    setSelectedRoofer(null);
    setShowResultList(true);
    setActiveSearchString(inputValue || "");
    if (inputValue) {
      pushToDataLayer({
        event: "dxb.button_click",
        id: "filter-service-locator",
        label: nameSearchLabelKey,
        action: inputValue
      });
    }
  };

  const onChipClick = (serviceType: ServiceType) => {
    setUserAction(true);
    setShowResultList(true);
    updateActiveFilters({ serviceType: serviceType });
    setSelectedRoofer(null);
  };

  const initialise = async () => {
    await loadGoogleApi(process.env.NEXT_PUBLIC_GOOGLE_API_KEY, [
      "places",
      "geometry"
    ]);
    setGoogleApi(typeof window?.google !== "undefined" ? window.google : null);
  };

  const getPosition = () => {
    return ({ coords }) => {
      setUserPosition({
        location: {
          lat: coords.latitude,
          lng: coords.longitude
        }
      });
    };
  };

  useEffect(() => {
    if (!services) {
      return;
    }

    const uniqueRooferTypes: ServiceType[] = getTypesFromServices(services);
    setUniqueRoofTypeByData(uniqueRooferTypes);

    if (!userQueryString) {
      return;
    }

    const allQueries = userQueryString.split(",");

    const matchingRooferTypes = getRooferTypes(uniqueRooferTypes, allQueries);

    // there were no matching queries in querystring
    // hence remove all querystring from user and make the url '/find-a-roofer/' again
    if (matchingRooferTypes.length === 0) {
      history.replaceState(null, "", pathname);
    } else {
      // show result list panel on page load if selected chips exist
      matchingRooferTypes.forEach((serviceType: ServiceType) => {
        updateActiveFilters({ serviceType: serviceType, state: true });
      });
      setShowResultList(true);
    }
  }, [services, userQueryString, pathname]);

  useEffect(() => {
    if (!userQueryString) {
      const isEveryChipSelected = Object.keys(activeFilters).every(
        // eslint-disable-next-line security/detect-object-injection
        (key) => activeFilters[key] === true
      );
      if (isEveryChipSelected) {
        return;
      }
    }

    const filteredChips: string[] = Object.keys(activeFilters).filter(
      // eslint-disable-next-line security/detect-object-injection
      (key) => activeFilters[key]
    );

    if (filteredChips.length > 0) {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set(QUERY_CHIP_FILTER_KEY, filteredChips.join(","));
      history.replaceState(null, "", "?" + queryParams.toString());
    }
    if (filteredChips.length === 0 && isUserAction) {
      // Remove the query if there are no selected chips
      // otherwise url will look like `/?chip=`
      history.replaceState(null, "", pathname);
    }
  }, [activeFilters, pathname]);

  useEffect(() => {
    initialise();
  }, []);

  return (
    <Section
      backgroundColor="white"
      data-testid={`service-locator-section-${replaceSpaces(label)}`}
    >
      <GoogleApi.Provider value={googleApi}>
        {(position > 0 || isBranchLocator) && (
          <Section.Title>{label}</Section.Title>
        )}
        {body && (
          <Body>
            <RichText document={body} />
          </Body>
        )}
        <Controls container spacing={3} alignItems="flex-end">
          {shouldEnableSearch && (
            <SearchLocationBlock
              autocompleteLabel={nameSearchLabelKey}
              options={filteredRoofers.map(({ name }) => name)}
              handleAutocompleteOnChange={handleAutocompleteOnChange}
              handlePlaceChange={handlePlaceChange}
              getPosition={getPosition}
              userPosition={userPosition}
            />
          )}
          {uniqueRoofTypeByData.length > 1 && (
            <ServiceLocatorChips
              uniqueRoofTypeByData={uniqueRoofTypeByData}
              onChipClick={onChipClick}
              activeFilters={activeFilters}
              microCopyPrefix={microCopyPrefix}
            />
          )}
        </Controls>
        <StyledTabs
          initialValue="list"
          color="secondary"
          visibleUntil="lg"
          variant="fullWidth"
        >
          {showResultList && (
            <ResultListTabPanel
              className={classes.tabPanel}
              heading={getMicroCopy(microCopy.FIND_A_ROOFER_LIST_LABEL)}
              index="list"
            >
              <ServiceLocatorResultList
                roofersList={pagedFilteredRoofers}
                onListItemClick={handleServiceClick}
                onCloseCard={clearRooferAndResetMap}
                onPageChange={handlePageChange}
                page={page}
                pageCount={pageCount}
                getCompanyDetails={getCompanyDetails}
                selectedRoofer={selectedRoofer}
                shouldListCertification
              />
            </ResultListTabPanel>
          )}
          <MapTabPanel
            className={classes.tabPanel}
            heading={getMicroCopy(microCopy.FIND_A_ROOFER_MAP_LABEL)}
            index="map"
          >
            <ServiceLocatorMap
              selectedRoofer={selectedRoofer}
              clearRooferAndResetMap={clearRooferAndResetMap}
              initialMapCentre={initialMapCentre}
              centre={centre}
              markers={markers}
              handleMarkerClick={(service) => handleServiceClick(service, true)}
              zoom={zoom}
              getCompanyDetails={getCompanyDetails}
            />
          </MapTabPanel>
        </StyledTabs>
      </GoogleApi.Provider>
    </Section>
  );
};

export default ServiceLocatorSection;
