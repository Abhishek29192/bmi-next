import {
  CompanyDetailProps,
  GeocoderResult as GoogleGeocoderResult,
  Google,
  GoogleApi,
  Grid,
  LatLngLiteral as GoogleLatLngLiteral,
  loadGoogleApi,
  Section,
  Tabs
} from "@bmi/components";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { microCopy } from "../../constants/microCopies";
import { pushToDataLayer } from "../../utils/google-tag-manager";
import RichText, { RichTextData } from "../RichText";
import {
  Data as ServiceData,
  EntryTypeEnum,
  ServiceTypeFilter,
  ServiceTypesPrefixesEnum
} from "../Service";
import { Data as ServiceType } from "../ServiceType";
import { useSiteContext } from "../Site";
import {
  createCompanyDetails,
  SearchLocationBlock,
  ServiceLocatorChips,
  ServiceLocatorMap,
  ServiceLocatorResultList
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
import styles from "./styles/ServiceLocatorSection.module.scss";

export type Service = ServiceData & {
  distance?: number;
};
export type Data = {
  __typename: "ContentfulServiceLocatorSection";
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
  const shouldListCertification = sectionType === EntryTypeEnum.ROOFER_TYPE;
  const isBranchLocator = sectionType == EntryTypeEnum.BRANCH_TYPE;

  const { getMicroCopy, countryCode } = useSiteContext();
  const theme = useTheme();
  const windowLocation = useLocation();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const params = new URLSearchParams(windowLocation.search);
  const userQueryString = useMemo(
    () => params.get(QUERY_CHIP_FILTER_KEY),
    [params]
  );
  const [uniqueRoofTypeByData, setUniqueRoofTypeByData] = useState([]);
  const [isUserAction, setUserAction] = useState(false);
  const [page, setPage] = useState(1);
  const [pagedFilteredRoofers, setPagedFilteredRoofers] = useState<Service[]>(
    []
  );
  const [showResultList, setShowResultList] = useState(showDefaultResultList);
  const [googleApi, setGoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<Service>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral>();
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
    [activeFilters, activeSearchString, centre]
  );

  const markers = useMemo(
    () =>
      showResultList
        ? pagedFilteredRoofers.map(createMarker(selectedRoofer, matches))
        : [],
    [selectedRoofer, pagedFilteredRoofers, showResultList, matches]
  );

  const handlePageChange = (_, pageNumber: number) => {
    setPagedFilteredRoofers(() => {
      const start = (pageNumber - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      return filteredRoofers.slice(start, end);
    });
    setPage(pageNumber);
  };

  useEffect(() => {
    setPagedFilteredRoofers(filteredRoofers.slice(0, PAGE_SIZE));
    setPage(1);
  }, [filteredRoofers]);

  const pageCount = Math.ceil(filteredRoofers.length / PAGE_SIZE);

  const handleServiceClick = (service: Service, isMarker = false) => {
    setSelectedRoofer(service);
    if (matches && isMarker) {
      pushToDataLayer(getResultDataGtm(service, matches, isMarker));
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
      location
        ? {
            lat: location.geometry.location.lat(),
            lng: location.geometry.location.lng()
          }
        : null
    );
  };

  const clearRooferAndResetMap = () => {
    setSelectedRoofer(null);
    setZoom(centre ? PLACE_LEVEL_ZOOM : initialMapZoom || DEFAULT_LEVEL_ZOOM);
    setCentre(centre || null);
  };

  const getCompanyDetails = (
    service: Service,
    isAddressHidden?: boolean
  ): CompanyDetailProps[] => {
    const googleURLLatLng = centre ? `${centre.lat},+${centre.lng}` : "";

    return createCompanyDetails(
      sectionType,
      service,
      matches,
      countryCode,
      getMicroCopy,
      isAddressHidden,
      googleURLLatLng
    );
  };

  const getMicroCopyPrefix = (serviceType: EntryTypeEnum) => {
    // eslint-disable-next-line security/detect-object-injection
    return ServiceTypesPrefixesEnum[serviceType];
  };

  const microCopyPrefix = getMicroCopyPrefix(sectionType);

  const handleAutocompleteOnChange = (_, inputValue) => {
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
  };

  const initialise = async () => {
    await loadGoogleApi(process.env.GATSBY_GOOGLE_API_KEY, [
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
      history.replaceState(null, null, windowLocation.pathname);
    } else {
      // show result list panel on page load if selected chips exist
      matchingRooferTypes.forEach((serviceType: ServiceType) => {
        updateActiveFilters({ serviceType: serviceType, state: true });
      });
      setShowResultList(true);
    }
  }, [services, userQueryString]);

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
      const queryParams = new URLSearchParams(windowLocation.search);
      queryParams.set(QUERY_CHIP_FILTER_KEY, filteredChips.join(","));
      history.replaceState(null, null, "?" + queryParams.toString());
    }
    if (filteredChips.length === 0 && isUserAction) {
      // Remove the query if there are no selected chips
      // otherwise url will look like `/?chip=`
      history.replaceState(null, null, windowLocation.pathname);
    }
  }, [activeFilters]);

  useEffect(() => {
    initialise();
  }, []);

  return (
    <Section
      backgroundColor="white"
      className={styles["ServiceLocationSection"]}
    >
      <GoogleApi.Provider value={googleApi}>
        {(position > 0 || isBranchLocator) && (
          <Section.Title>{label}</Section.Title>
        )}
        {body && (
          <div className={styles["body"]}>
            <RichText document={body} />
          </div>
        )}
        <Grid
          container
          spacing={3}
          alignItems="flex-end"
          className={styles["controls"]}
        >
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
        </Grid>
        <Tabs
          initialValue="list"
          className={styles["tabs"]}
          theme="secondary"
          visibleUntil="md"
          variant="fullWidth"
        >
          {showResultList && (
            <Tabs.TabPanel
              md={12}
              lg={4}
              className={styles["tab-panel"]}
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
                shouldListCertification={shouldListCertification}
                selectedRoofer={selectedRoofer}
              />
            </Tabs.TabPanel>
          )}
          <Tabs.TabPanel
            md={12}
            lg={showResultList ? 8 : 12}
            className={styles["tab-panel"]}
            heading={getMicroCopy(microCopy.FIND_A_ROOFER_MAP_LABEL)}
            index="map"
          >
            {console.log(markers)}
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
          </Tabs.TabPanel>
        </Tabs>
      </GoogleApi.Provider>
    </Section>
  );
};

export default ServiceLocatorSection;

export const query = graphql`
  fragment ServiceLocatorSectionFragment on ContentfulServiceLocatorSection {
    __typename
    type
    showDefaultResultList
    title
    label
    body {
      ...RichTextFragment
    }
    services {
      ... on ContentfulService {
        ...ServiceFragment
      }
    }
    centre {
      lat
      lon
    }
    zoom
  }
`;
