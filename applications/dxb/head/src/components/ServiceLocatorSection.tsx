import Autocomplete from "@bmi/autocomplete";
import Button from "@bmi/button";
import Card, { CardContent, CardHeader } from "@bmi/card";
import Chip from "@bmi/chip";
import CompanyDetails, {
  DetailProps,
  RoofProLevel
} from "@bmi/company-details";
import GeolocationButton from "@bmi/geolocation-button";
import GoogleApi, {
  computeDistanceBetween,
  GeocoderResult as GoogleGeocoderResult,
  Google,
  LatLngLiteral as GoogleLatLngLiteral,
  loadGoogleApi,
  MarkerOptionsWithData
} from "@bmi/google-api";
import GoogleAutocomplete from "@bmi/google-autocomplete";
import GoogleMap from "@bmi/google-map";
import Grid from "@bmi/grid";
import LinkCard, { Props as LinkCardProps } from "@bmi/link-card";
import Section from "@bmi/section";
import Logo, {
  RoofProElite,
  RoofProExpert,
  RoofProPartnerSmall
} from "@bmi/logo";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import CloseIcon from "@material-ui/icons/Close";
import { graphql } from "gatsby";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { camelCase, intersectionWith } from "lodash";
import { devLog } from "../utils/devLog";
import { getClickableActionFromUrl } from "./Link";
import RichText, { RichTextData } from "./RichText";
import {
  Data as ServiceData,
  ServiceType,
  serviceTypes,
  serviceTypesByEntity
} from "./Service";
import { useSiteContext } from "./Site";
import styles from "./styles/ServiceLocatorSection.module.scss";

export const QUERY_CHIP_FILTER_KEY = "chip";

export type Service = ServiceData & {
  distance?: number;
};
export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  type: "Roofer" | "Branch" | "Merchant";
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

// TODO: Maybe calculate this from `range`?
const PLACE_LEVEL_ZOOM = 8;
const DEFAULT_MAP_CENTRE = {
  lat: 60.47202399999999,
  lng: 8.468945999999999
};
const DEFAULT_LEVEL_ZOOM = 5;

const activeFilterReducer = (
  state: Record<ServiceType, boolean>,
  filter: { name: ServiceType; state?: boolean }
) => ({
  ...state,
  [filter.name]: filter.state ? filter.state : !state[filter.name]
});

const IntegratedLinkCard = ({
  isOpen,
  onExpandCompleted,
  ...rest
}: LinkCardProps) => {
  const linkCardElement = useRef<HTMLElement>(null);
  const [hasCardExpansionCompleted, setCardExpansionCompleted] =
    useState(false);

  if (isOpen && linkCardElement.current && hasCardExpansionCompleted) {
    linkCardElement.current.parentElement.scrollTo({
      top: linkCardElement.current.offsetTop + 1,
      behavior: "smooth"
    });
  }
  return (
    <LinkCard
      isOpen={isOpen}
      ref={linkCardElement}
      {...rest}
      onExpandCompleted={() => {
        setCardExpansionCompleted(true);
      }}
    />
  );
};

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const {
    type: sectionType,
    label,
    body,
    services,
    position,
    centre: initialMapCentre,
    zoom: initialMapZoom
  } = data;

  const shouldEnableSearch = sectionType !== "Branch";
  const shouldListCertification = sectionType === "Roofer";
  const isBranchLocator = sectionType == "Branch";

  const nameSearchLabelKey =
    sectionType === "Merchant"
      ? "merchantNameSearchLabel"
      : "companyFieldLabel";

  const radius = 50; // @todo: To come from CMS.
  const FILTER_RADIUS = radius ? radius * 1000 : Infinity;

  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );
  const userQueryString = useMemo(
    () => params.get(QUERY_CHIP_FILTER_KEY),
    [params]
  );
  const [uniqueRoofTypeByData, setUniqueRoofTypeByData] = useState([]);
  const [isUserAction, setUserAction] = useState(false);

  const { getMicroCopy, countryCode } = useSiteContext();
  const [googleApi, setgoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<Service>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral>();
  const [zoom, setZoom] = useState<number>(
    initialMapZoom || DEFAULT_LEVEL_ZOOM
  );

  const initialActiveFilters = serviceTypesByEntity(sectionType).reduce(
    (carry, key) => ({ ...carry, [key]: false }),
    {}
  ) as Record<ServiceType, boolean>;

  const [activeSearchString, setActiveSearchString] = useState<string>("");
  const [activeFilters, updateActiveFilters] = useReducer(
    activeFilterReducer,
    initialActiveFilters
  );

  useEffect(() => {
    if (!services) {
      return;
    }
    const uniqueRooferTypes: ServiceType[] = Array.from(
      new Set(services.flatMap((service) => service.type || service.branchType))
    ).filter((x) => x !== null);

    setUniqueRoofTypeByData(uniqueRooferTypes);

    if (!userQueryString) {
      return;
    }

    const allQueries = userQueryString.split(",");

    const matchingRooferTypes: ServiceType[] = intersectionWith(
      uniqueRooferTypes,
      allQueries,
      (a, b) => a.toLowerCase() === b.toLowerCase()
    );
    matchingRooferTypes.forEach((serviceType: ServiceType) => {
      updateActiveFilters({ name: serviceType, state: true });
    });

    // there were no matching queries in querystring
    // hence remove all querystring from user and make the url '/find-a-roofer/' again
    if (typeof window !== `undefined` && matchingRooferTypes.length === 0) {
      history.replaceState(null, null, window.location.pathname);
    }
  }, [services]);

  useEffect(() => {
    if (!userQueryString) {
      const isEveryChipSelected = Object.keys(activeFilters).every(
        (key) => activeFilters[key] === true
      );
      if (isEveryChipSelected) {
        return;
      }
    }

    if (typeof window !== `undefined`) {
      const filteredChips: string[] = Object.keys(activeFilters).filter(
        (key) => activeFilters[key]
      );
      if (filteredChips.length > 0) {
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set(QUERY_CHIP_FILTER_KEY, filteredChips.join(","));
        history.replaceState(null, null, "?" + queryParams.toString());
      }
      if (filteredChips.length === 0 && isUserAction) {
        // Remove the query if there are no selected chips
        // otherwise url will look like `/?chip=`
        history.replaceState(null, null, window.location.pathname);
      }
    }
  }, [activeFilters]);

  const [userPosition, setUserPosition] =
    useState<
      | undefined
      | {
          location: GoogleLatLngLiteral;
        }
    >();

  const initialise = async () => {
    await loadGoogleApi(process.env.GATSBY_GOOGLE_API_KEY, [
      "places",
      "geometry"
    ]);
    /* global google */
    setgoogleApi(typeof google !== "undefined" ? google : null);
  };

  useEffect(() => {
    initialise();
  }, []);

  const typeFilter = (
    type: Service["type"],
    branchType: Service["branchType"]
  ): boolean => {
    // user has not selected any chip(s) to filter hence show all services
    // i.e initial load or user has de-selected ALL chips
    if (
      Object.keys(activeFilters).every((key) => activeFilters[key] === false)
    ) {
      return true;
    }

    // user has selcted the filter chip the service must have type and it must match
    if (Object.keys(activeFilters).some((key) => activeFilters[key] === true)) {
      return (
        (type?.length && type.some((filter) => activeFilters[filter])) ||
        (branchType?.length &&
          branchType.some((filter) => activeFilters[filter]))
      );
    }
    // service's types are null hence return true
    return true;
  };

  const nameFilter = (name: Service["name"]) =>
    name.includes(activeSearchString);

  const distanceFilter = (distance: Service["distance"]) =>
    distance ? distance < FILTER_RADIUS : true;

  const filteredRoofers = useMemo<Service[]>(
    () =>
      (services || [])
        .reduce((carry, current) => {
          const { name, location, type, branchType } = current;
          const distance = computeDistanceBetween(centre, {
            lat: location.lat,
            lng: location.lon
          });
          if (
            typeFilter(type, branchType) &&
            nameFilter(name) &&
            distanceFilter(distance)
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
        }, [])
        .sort((serviceA, serviceB) => {
          const distanceSort = centre
            ? serviceA.distance - serviceB.distance
            : 0;

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
        }),
    [activeFilters, activeSearchString, centre]
  );

  const markers = useMemo(
    () =>
      filteredRoofers.map(
        (service: Service): MarkerOptionsWithData<Service> => ({
          title: service.name,
          position: {
            lat: service.location.lat,
            lng: service.location.lon
          },
          isActive: selectedRoofer && selectedRoofer.id === service.id,
          data: service
        })
      ),
    [selectedRoofer, filteredRoofers]
  );

  const handleListClick = (service: Service) => {
    setSelectedRoofer(service);
  };

  const handlePlaceChange = (location?: GoogleGeocoderResult) => {
    // We want to clear the service whenever the place changes.
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

  const handleMarkerClick = (service: Service) => {
    setSelectedRoofer(service);
  };

  const clearRooferAndResetMap = () => {
    setSelectedRoofer(null);
    setZoom(centre ? PLACE_LEVEL_ZOOM : initialMapZoom || DEFAULT_LEVEL_ZOOM);
    setCentre(centre || null);
  };

  const getCompanyDetails = (
    service: Service,
    isAddressHidden?: boolean
  ): DetailProps[] => {
    const shouldShowIcons = sectionType === "Roofer";
    const isAddressClickable = sectionType === "Branch";
    const shouldShowWebsiteLinkAsLabel = sectionType === "Merchant";

    const googleURLLatLng = centre ? `${centre.lat},+${centre.lng}` : "";

    const address: DetailProps = {
      type: "address",
      display: shouldShowIcons ? "icon" : "contentOnly",
      text: service.address,
      label: getMicroCopy("global.address"),
      action: isAddressClickable
        ? getClickableActionFromUrl(
            null,
            `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
              service.address
            )}/`,
            countryCode,
            null,
            getMicroCopy("global.address")
          )
        : undefined
    };

    const distance: DetailProps | undefined =
      service.distance !== undefined
        ? {
            type: "distance",
            display: shouldShowIcons ? "icon" : "label",
            text: `${Math.floor(service.distance) / 1000}km`,
            label: getMicroCopy("findARoofer.distanceLabel")
          }
        : undefined;

    const directions: DetailProps | undefined = {
      type: "cta",
      text: getMicroCopy("findARoofer.getDirectionsLabel"),
      action: getClickableActionFromUrl(
        null,
        `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
          service.address
        )}/`,
        countryCode,
        null,
        getMicroCopy("findARoofer.getDirectionsLabel")
      ),
      label: getMicroCopy("findARoofer.getDirectionsLabel")
    };

    const phone: DetailProps | undefined = service.phone
      ? {
          type: "phone",
          display: shouldShowIcons ? "icon" : "label",
          text: service.phone,
          action: getClickableActionFromUrl(
            null,
            `tel:${service.phone}`,
            countryCode,
            null,
            getMicroCopy("global.telephone")
          ),
          label: getMicroCopy("global.telephone")
        }
      : undefined;

    const email: DetailProps | undefined = service.email
      ? {
          type: "email",
          display: shouldShowIcons ? "icon" : "label",
          text: service.email,
          action: getClickableActionFromUrl(
            null,
            `mailto:${service.email}`,
            countryCode,
            null,
            getMicroCopy("global.email")
          ),
          label: getMicroCopy("global.email")
        }
      : undefined;

    const website: DetailProps | undefined = service.website
      ? {
          type: "website",
          display: shouldShowIcons ? "icon" : "label",
          text: shouldShowWebsiteLinkAsLabel
            ? service.website
            : getMicroCopy("findARoofer.websiteLabel"),
          action: getClickableActionFromUrl(
            null,
            service.website,
            countryCode,
            null,
            shouldShowWebsiteLinkAsLabel
              ? getMicroCopy("global.website")
              : getMicroCopy("findARoofer.websiteLabel")
          ),
          label: shouldShowWebsiteLinkAsLabel
            ? getMicroCopy("global.website")
            : getMicroCopy("findARoofer.websiteLabel")
        }
      : undefined;

    const fax: DetailProps | undefined = service.fax
      ? {
          type: "content",
          text: service.fax,
          textStyle: "bold",
          label: getMicroCopy("global.fax")
        }
      : undefined;

    const type: DetailProps | undefined =
      service.type || service.branchType
        ? {
            type: "content",
            label: getMicroCopy("findARoofer.roofTypeLabel"),
            text: (
              <b>
                {service.type
                  ? service.type
                      .map((type) =>
                        getMicroCopy(
                          `findARoofer.filters.${camelCase(type)}`
                        ).replace(" roof", "")
                      )
                      .join(" | ")
                  : ""}
                {service.branchType
                  ? service.branchType
                      .map((type) =>
                        getMicroCopy(
                          `findABranch.filters.${camelCase(type)}`
                        ).replace(" roof", "")
                      )
                      .join(" | ")
                  : ""}
              </b>
            )
          }
        : undefined;

    const certification: DetailProps = service.certification
      ? {
          type: "roofProLevel",
          label: getMicroCopy("findARoofer.certificationLabel"),
          level: service.certification.toLowerCase() as RoofProLevel
        }
      : undefined;

    const detailsStart = isAddressHidden ? [] : [address];

    switch (sectionType) {
      case "Roofer":
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
      case "Branch":
        return [
          ...detailsStart,
          distance,
          phone,
          email,
          fax,
          directions
        ].filter(Boolean);
      case "Merchant":
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

  const iconSourceMap: Record<RoofProLevel, SVGImport> = {
    expert: RoofProExpert,
    partner: RoofProPartnerSmall,
    elite: RoofProElite
  };
  const microcopyPrefix = isBranchLocator ? "findABranch" : "findARoofer";

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
          <Grid item xs={12} md={6} lg={4} className={styles["search"]}>
            {shouldEnableSearch ? (
              <>
                <Autocomplete
                  id="company-autocomplete"
                  label={getMicroCopy(`findARoofer.${nameSearchLabelKey}`)}
                  noOptionsText={getMicroCopy("findARoofer.noResultsLabel")}
                  className={styles["company-autocomplete"]}
                  onChange={(_, inputValue) => {
                    setActiveSearchString(inputValue || "");
                  }}
                  filterOptions={(options, { inputValue }) => {
                    if (inputValue.length > 2) {
                      return options.filter((option) =>
                        option.toLowerCase().includes(inputValue.toLowerCase())
                      );
                    }
                    // @todo Returning `false` from this function is the *only* way
                    // this works to hide the dropdown but is not typed as such in
                    // MaterialUI.
                    return false as any;
                  }}
                  options={filteredRoofers.map(({ name }) => name)}
                  freeSolo
                  startAdornmentIcon="HardHatHead"
                />
                <Typography className={styles["and-or-label"]}>
                  <span>{getMicroCopy("findARoofer.andOr")}</span>
                </Typography>
                <GoogleAutocomplete
                  id="location-autocomplete"
                  label={getMicroCopy("findARoofer.locationFieldLabel")}
                  noOptionsText={getMicroCopy("findARoofer.noResultsLabel")}
                  className={styles["location-autocomplete"]}
                  onPlaceChange={handlePlaceChange}
                  freeSolo
                  startAdornmentIcon="LocationOn"
                  controlledValue={userPosition}
                />
                <GeolocationButton
                  onPosition={({ coords }) => {
                    setUserPosition({
                      location: {
                        lat: coords.latitude,
                        lng: coords.longitude
                      }
                    });
                  }}
                >
                  {getMicroCopy("findARoofer.geolocationButton")}
                </GeolocationButton>
              </>
            ) : undefined}
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            {uniqueRoofTypeByData.length > 1 && (
              <div className={styles["filters"]}>
                <div className={styles["chips"]}>
                  <Typography variant="h6" className={styles["chips-label"]}>
                    {getMicroCopy(`${microcopyPrefix}.filtersLabel`)}
                  </Typography>
                  {uniqueRoofTypeByData.map((serviceType, index) => (
                    <Chip
                      key={index}
                      type="selectable"
                      onClick={() => {
                        setUserAction(true);
                        updateActiveFilters({ name: serviceType });
                      }}
                      isSelected={activeFilters[serviceType]}
                    >
                      {getMicroCopy(
                        `${microcopyPrefix}.filters.${camelCase(serviceType)}`
                      )}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </Grid>
        </Grid>
        <Tabs
          initialValue="list"
          className={styles["tabs"]}
          theme="secondary"
          visibleUntil="md"
          variant="fullWidth"
        >
          <Tabs.TabPanel
            md={12}
            lg={4}
            className={styles["tab-panel"]}
            heading={getMicroCopy("findARoofer.listLabel")}
            index="list"
          >
            <div className={styles["list"]}>
              {filteredRoofers.length ? (
                filteredRoofers.map((service) => (
                  <IntegratedLinkCard
                    key={service.id}
                    onClick={() => handleListClick(service)}
                    onCloseClick={clearRooferAndResetMap}
                    isOpen={selectedRoofer && selectedRoofer.id === service.id}
                    title={service.name}
                    subtitle={
                      <>
                        {service.address}
                        {service.certification && shouldListCertification && (
                          <div className={styles["roofpro-certification"]}>
                            {getMicroCopy("findARoofer.certificationLabel")}:
                            <Logo
                              source={
                                iconSourceMap[
                                  service.certification.toLowerCase()
                                ]
                              }
                              className={styles["roofpro-icon"]}
                            />
                          </div>
                        )}
                      </>
                    }
                  >
                    <CompanyDetails details={getCompanyDetails(service, true)}>
                      <Typography>{service.summary}</Typography>
                    </CompanyDetails>
                  </IntegratedLinkCard>
                ))
              ) : (
                <div className={styles["no-results"]}>
                  <Typography
                    variant="h4"
                    className={styles["no-results-heading"]}
                  >
                    {getMicroCopy("findARoofer.noResults.title")}
                  </Typography>
                  <Typography>
                    {getMicroCopy("findARoofer.noResults.subtitle")}
                  </Typography>
                </div>
              )}
            </div>
          </Tabs.TabPanel>
          <Tabs.TabPanel
            md={12}
            lg={8}
            className={styles["tab-panel"]}
            heading={getMicroCopy("findARoofer.mapLabel")}
            index="map"
          >
            <div className={styles["map"]}>
              <GoogleMap
                center={
                  centre ||
                  (initialMapCentre && {
                    lat: initialMapCentre.lat,
                    lng: initialMapCentre.lon
                  }) ||
                  DEFAULT_MAP_CENTRE
                }
                markers={markers}
                onMarkerClick={handleMarkerClick}
                zoom={zoom}
              >
                {selectedRoofer && (
                  <Card className={styles["product-details-card"]}>
                    <CardHeader
                      title={selectedRoofer.name}
                      action={
                        <Button
                          isIconButton
                          variant="text"
                          accessibilityLabel={getMicroCopy("global.close")}
                          onClick={clearRooferAndResetMap}
                          className={
                            styles["product-details-card__close-button"]
                          }
                        >
                          <CloseIcon />
                        </Button>
                      }
                    ></CardHeader>
                    <CardContent>
                      <CompanyDetails
                        details={getCompanyDetails(selectedRoofer)}
                      >
                        <Typography>{selectedRoofer.summary}</Typography>
                      </CompanyDetails>
                    </CardContent>
                  </Card>
                )}
              </GoogleMap>
            </div>
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
