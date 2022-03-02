import { DetailProps } from "@bmi/company-details";
import GoogleApi, {
  GeocoderResult as GoogleGeocoderResult,
  Google,
  LatLngLiteral as GoogleLatLngLiteral,
  loadGoogleApi
} from "@bmi/google-api";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import { graphql } from "gatsby";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useLocation } from "@reach/router";
import RichText, { RichTextData } from "../RichText";
import {
  Data as ServiceData,
  EntryTypeEnum,
  ServiceType,
  serviceTypesByEntity,
  ServiceTypesPrefixesEnum
} from "../Service";
import { useSiteContext } from "../Site";
import styles from "./styles/ServiceLocatorSection.module.scss";
import {
  SearchLocationBlock,
  ServiceLocatorChips,
  ServiceLocatorMap,
  ServiceLocatorResultList
} from "./components";
import {
  createCompanyDetails,
  createMarker,
  filterServices,
  getRooferTypes,
  getTypesFromServices,
  sortServices
} from "./helpers";
import {
  DEFAULT_LEVEL_ZOOM,
  PLACE_LEVEL_ZOOM,
  QUERY_CHIP_FILTER_KEY
} from "./constants";

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
  const [showResultList, setShowResultList] = useState(showDefaultResultList);
  const [googleApi, setGoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<Service>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral>();
  const [zoom, setZoom] = useState<number>(
    initialMapZoom || DEFAULT_LEVEL_ZOOM
  );
  const [activeSearchString, setActiveSearchString] = useState<string>("");
  const [userPosition, setUserPosition] =
    useState<
      | undefined
      | {
          location: GoogleLatLngLiteral;
        }
    >();

  const serviceTypesByEntityItems: ServiceType[] =
    serviceTypesByEntity(sectionType);

  const activeFilterReducer = (
    state: Record<ServiceType, boolean>,
    filter: {
      name: ServiceType;
      state?: boolean;
    }
  ) => ({
    ...state,
    [filter.name]: filter.state ? filter.state : !state[filter.name]
  });

  const initialActiveFilters = (
    serviceTypesByEntityItems as ServiceType[]
  ).reduce(
    (carry, key: ServiceType) => ({ ...carry, [key]: false }),
    {}
  ) as Record<ServiceType, boolean>;

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
      showResultList ? filteredRoofers.map(createMarker(selectedRoofer)) : [],
    [selectedRoofer, filteredRoofers, showResultList]
  );

  const handleServiceClick = (service: Service) => {
    setSelectedRoofer(service);
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
    eventCategoryId: string,
    service: Service,
    isAddressHidden?: boolean
  ): DetailProps[] => {
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
  };

  const onChipClick = (serviceType) => {
    setUserAction(true);
    setShowResultList(true);
    updateActiveFilters({ name: serviceType });
  };

  const initialise = async () => {
    await loadGoogleApi(process.env.GATSBY_GOOGLE_API_KEY, [
      "places",
      "geometry"
    ]);
    /* global google */
    setGoogleApi(typeof google !== "undefined" ? google : null);
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
    const allServiceTypesFromServices = getTypesFromServices(services);
    const uniqueRooferTypes: ServiceType[] = [
      ...new Set(allServiceTypesFromServices)
    ];
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
        updateActiveFilters({ name: serviceType, state: true });
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
      let queryParams = new URLSearchParams(windowLocation.search);
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
              sectionType={sectionType}
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
              heading={getMicroCopy("findARoofer.listLabel")}
              index="list"
            >
              <ServiceLocatorResultList
                roofersList={filteredRoofers}
                onListItemClick={handleServiceClick}
                onCloseCard={clearRooferAndResetMap}
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
            heading={getMicroCopy("findARoofer.mapLabel")}
            index="map"
          >
            <ServiceLocatorMap
              selectedRoofer={selectedRoofer}
              clearRooferAndResetMap={clearRooferAndResetMap}
              initialMapCentre={initialMapCentre}
              centre={centre}
              markers={markers}
              handleMarkerClick={handleServiceClick}
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
      ...ServiceFragment
    }
    centre {
      lat
      lon
    }
    zoom
  }
`;