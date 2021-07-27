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
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";
import { camelCase, intersectionWith } from "lodash";
import { getClickableActionFromUrl } from "./Link";
import RichText, { RichTextData } from "./RichText";
import { Data as RooferData, RooferType, rooferTypes } from "./Roofer";
import { SiteContext } from "./Site";
import styles from "./styles/ServiceLocatorSection.module.scss";

export const QUERY_CHIP_FILTER_KEY = "chip";

export type Roofer = RooferData & {
  distance?: number;
};
export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  title: string;
  label: string;
  body: RichTextData | null;
  roofers: Roofer[] | null;
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

// TODO: Cast this properly.
const initialActiveFilters = rooferTypes.reduce(
  (carry, key) => ({ ...carry, [key]: false }),
  {}
) as Record<RooferType, boolean>;

const activeFilterReducer = (
  state: Record<RooferType, boolean>,
  filter: { name: RooferType; state?: boolean }
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
    label,
    body,
    roofers,
    position,
    centre: initialMapCentre,
    zoom: initialMapZoom
  } = data;

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

  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const [googleApi, setgoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<Roofer>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral>();
  const [zoom, setZoom] = useState<number>(
    initialMapZoom || DEFAULT_LEVEL_ZOOM
  );
  const [activeSearchString, setActiveSearchString] = useState<string>("");
  const [activeFilters, updateActiveFilters] = useReducer(
    activeFilterReducer,
    initialActiveFilters
  );

  useEffect(() => {
    if (!roofers) {
      return;
    }
    const uniqueRooferTypes: RooferType[] = Array.from(
      new Set(roofers.flatMap((roofer) => roofer.type))
    ).filter((x) => x !== null);

    setUniqueRoofTypeByData(uniqueRooferTypes);

    if (!userQueryString) {
      return;
    }

    const allQueries = userQueryString.split(",");

    const matchingRooferTypes: RooferType[] = intersectionWith(
      uniqueRooferTypes,
      allQueries,
      (a, b) => a.toLowerCase() === b.toLowerCase()
    );
    matchingRooferTypes.forEach((rooferType: RooferType) => {
      updateActiveFilters({ name: rooferType, state: true });
    });

    // there were no matching queries in querystring
    // hence remove all querystring from user and make the url '/find-a-roofer/' again
    if (typeof window !== `undefined` && matchingRooferTypes.length === 0) {
      history.replaceState(null, null, window.location.pathname);
    }
  }, [roofers]);

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

  const typeFilter = (type: Roofer["type"]): boolean => {
    // user has not selected any chip(s) to filter hence show all roofers
    // i.e initial load or user has de-selected ALL chips
    if (
      Object.keys(activeFilters).every((key) => activeFilters[key] === false)
    ) {
      return true;
    }

    // user has selcted the filter chip the roofer must have type and it must match
    if (Object.keys(activeFilters).some((key) => activeFilters[key] === true)) {
      return type && type.some((filter) => activeFilters[filter]);
    }
    // roofer's type is null hence return true
    return type?.length ? type.some((filter) => activeFilters[filter]) : true;
  };

  const nameFilter = (name: Roofer["name"]) =>
    name.includes(activeSearchString);

  const distanceFilter = (distance: Roofer["distance"]) =>
    distance ? distance < FILTER_RADIUS : true;

  const filteredRoofers = useMemo<Roofer[]>(
    () =>
      (roofers || [])
        .reduce((carry, current) => {
          const { name, location, type } = current;
          const distance = computeDistanceBetween(centre, {
            lat: location.lat,
            lng: location.lon
          });
          if (
            typeFilter(type) &&
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
        .sort((rooferA, rooferB) => {
          const distanceSort = centre ? rooferA.distance - rooferB.distance : 0;

          if (distanceSort === 0) {
            const rooferNameA = rooferA.name.toLowerCase();
            const rooferNameB = rooferB.name.toLowerCase();

            if (rooferNameA === rooferNameB) {
              return 0;
            } else {
              return rooferNameA < rooferNameB ? -1 : 1;
            }
          }

          return distanceSort;
        }),
    [activeFilters, activeSearchString, centre]
  );

  const markers = useMemo(
    () =>
      filteredRoofers.map(
        (roofer: Roofer): MarkerOptionsWithData<Roofer> => ({
          title: roofer.name,
          position: {
            lat: roofer.location.lat,
            lng: roofer.location.lon
          },
          isActive: selectedRoofer && selectedRoofer.id === roofer.id,
          data: roofer
        })
      ),
    [selectedRoofer, filteredRoofers]
  );

  const handleListClick = (roofer: Roofer) => {
    setSelectedRoofer(roofer);
  };

  const handlePlaceChange = (location?: GoogleGeocoderResult) => {
    // We want to clear the roofer whenever the place changes.
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

  const handleMarkerClick = (roofer: Roofer) => {
    setSelectedRoofer(roofer);
  };

  const clearRooferAndResetMap = () => {
    setSelectedRoofer(null);
    setZoom(centre ? PLACE_LEVEL_ZOOM : initialMapZoom || DEFAULT_LEVEL_ZOOM);
    setCentre(centre || null);
  };

  const getCompanyDetails = (
    roofer: Roofer,
    isAddressHidden?: boolean
  ): DetailProps[] => {
    const googleURLLatLng = centre ? `${centre.lat},+${centre.lng}` : "";

    const address: DetailProps = {
      type: "address",
      text: roofer.address,
      label: getMicroCopy("findARoofer.address")
    };

    const companyDetails: DetailProps[] = [
      ...(roofer.distance !== undefined
        ? [
            {
              type: "distance" as "distance",
              text: `${Math.floor(roofer.distance) / 1000}km`,
              label: getMicroCopy("findARoofer.distanceLabel")
            }
          ]
        : []),
      {
        // TODO: resolve types assertions of creating DetailProps array
        type: "cta" as "cta",
        text: getMicroCopy("findARoofer.getDirectionsLabel"),
        action: getClickableActionFromUrl(
          null,
          `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
            roofer.address
          )}/`,
          countryCode,
          null,
          getMicroCopy("findARoofer.getDirectionsLabel")
        ),
        label: getMicroCopy("findARoofer.getDirectionsLabel")
      },
      ...(roofer.phone
        ? [
            {
              type: "phone" as "phone",
              text: roofer.phone,
              action: getClickableActionFromUrl(
                null,
                `tel:${roofer.phone}`,
                countryCode,
                null,
                getMicroCopy("findARoofer.telephoneLabel")
              ),
              label: getMicroCopy("findARoofer.telephoneLabel")
            }
          ]
        : []),
      ...(roofer.email
        ? [
            {
              type: "email" as "email",
              text: roofer.email,
              action: getClickableActionFromUrl(
                null,
                `mailto:${roofer.email}`,
                countryCode,
                null,
                getMicroCopy("findARoofer.emailLabel")
              ),
              label: getMicroCopy("findARoofer.emailLabel")
            }
          ]
        : []),
      ...(roofer.website
        ? [
            {
              type: "website" as "website",
              text: getMicroCopy("findARoofer.websiteLabel"),
              action: getClickableActionFromUrl(
                null,
                roofer.website,
                countryCode,
                null,
                getMicroCopy("findARoofer.websiteLabel")
              ),
              label: getMicroCopy("findARoofer.websiteLabel")
            }
          ]
        : []),
      ...(roofer.type
        ? [
            {
              type: "content" as "content",
              label: getMicroCopy("findARoofer.roofTypeLabel"),
              text: (
                <b>
                  {roofer.type
                    .map((type) =>
                      getMicroCopy(
                        `findARoofer.filters.${camelCase(type)}`
                      ).replace(" roof", "")
                    )
                    .join(" | ")}
                </b>
              )
            }
          ]
        : []),
      ...(roofer.certification
        ? [
            {
              type: "roofProLevel" as "roofProLevel",
              label: getMicroCopy("findARoofer.certificationLabel"),
              level: roofer.certification.toLowerCase() as RoofProLevel
            }
          ]
        : [])
    ];

    return isAddressHidden ? companyDetails : [address, ...companyDetails];
  };

  const iconSourceMap: Record<RoofProLevel, SVGImport> = {
    expert: RoofProExpert,
    partner: RoofProPartnerSmall,
    elite: RoofProElite
  };

  return (
    <Section
      backgroundColor="white"
      className={styles["ServiceLocationSection"]}
    >
      <GoogleApi.Provider value={googleApi}>
        {position > 0 && <Section.Title>{label}</Section.Title>}
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
            <Autocomplete
              id="company-autocomplete"
              label={getMicroCopy("findARoofer.companyFieldLabel")}
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
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            {uniqueRoofTypeByData.length > 1 && (
              <div className={styles["filters"]}>
                <div className={styles["chips"]}>
                  <Typography variant="h6" className={styles["chips-label"]}>
                    {getMicroCopy("findARoofer.filtersLabel")}
                  </Typography>
                  {uniqueRoofTypeByData.map((rooferType, index) => (
                    <Chip
                      key={index}
                      type="selectable"
                      onClick={() => {
                        setUserAction(true);
                        updateActiveFilters({ name: rooferType });
                      }}
                      isSelected={activeFilters[rooferType]}
                    >
                      {getMicroCopy(
                        `findARoofer.filters.${camelCase(rooferType)}`
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
                filteredRoofers.map((roofer) => (
                  <IntegratedLinkCard
                    key={roofer.id}
                    onClick={() => handleListClick(roofer)}
                    onCloseClick={clearRooferAndResetMap}
                    isOpen={selectedRoofer && selectedRoofer.id === roofer.id}
                    title={roofer.name}
                    subtitle={
                      <>
                        {roofer.address}
                        {roofer.certification && (
                          <div className={styles["roofpro-certification"]}>
                            {getMicroCopy("findARoofer.certificationLabel")}:
                            <Logo
                              source={
                                iconSourceMap[
                                  roofer.certification.toLowerCase()
                                ]
                              }
                              className={styles["roofpro-icon"]}
                            />
                          </div>
                        )}
                      </>
                    }
                  >
                    <CompanyDetails details={getCompanyDetails(roofer, true)}>
                      <Typography>{roofer.summary}</Typography>
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
    title
    label
    body {
      ...RichTextFragment
    }
    roofers {
      ...RooferFragment
    }
    centre {
      lat
      lon
    }
    zoom
  }
`;
