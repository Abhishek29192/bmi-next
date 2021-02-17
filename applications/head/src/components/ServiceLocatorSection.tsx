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
  LatLngBounds as GoogleLatLngBounds,
  LatLngBoundsLiteral as GoogleLatLngBoundsLiteral,
  LatLngLiteral as GoogleLatLngLiteral,
  loadGoogleApi,
  MarkerOptionsWithData
} from "@bmi/google-api";
import GoogleAutocomplete from "@bmi/google-autocomplete";
import GoogleMap from "@bmi/google-map";
import Grid from "@bmi/grid";
import LinkCard from "@bmi/link-card";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import Typography from "@bmi/typography";
import CloseIcon from "@material-ui/icons/Close";
import { graphql } from "gatsby";
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";
import { getClickableActionFromUrl, LinkData } from "./Link";
import RichText, { RichTextData } from "./RichText";
import { Data as RooferData, RooferType, rooferTypes } from "./Roofer";
import { SiteContext } from "./Site";
import styles from "./styles/ServiceLocatorSection.module.scss";

type Roofer = RooferData & {
  distance?: number;
};

export type Data = {
  __typename: "ContentfulServiceLocatorSection";
  title: string;
  label: string;
  body: RichTextData | null;
  roofers: Roofer[] | null;
  position: number;
};

// TODO: dynamically set center and boundaries based on market country
// Tracked by: https://bmigroup.atlassian.net/browse/DXB-1561
// Centre for Norway
const initialMapCenter = {
  lat: 60.47202399999999,
  lng: 8.468945999999999
};

// Bounds for Norway
const initialMapBounds = {
  east: 31.3549999,
  north: 71.30780000000001,
  south: 57.8097,
  west: 4.0649
};

// TODO: Cast this properly.
const initialActiveFilters = rooferTypes.reduce(
  (carry, key) => ({ ...carry, [key]: true }),
  {}
) as Record<RooferType, boolean>;

const activeFilterReducer = (
  state: Record<RooferType, boolean>,
  filter: RooferType
) => ({
  ...state,
  [filter]: !state[filter]
});

const ServiceLocatorSection = ({ data }: { data: Data }) => {
  const { label, body, roofers, position } = data;
  const radius = 50; // @todo: To come from CMS.
  const FILTER_RADIUS = radius ? radius * 1000 : Infinity;
  const { getMicroCopy, countryCode } = useContext(SiteContext);
  const [googleApi, setgoogleApi] = useState<Google>(null);
  const [selectedRoofer, setSelectedRoofer] = useState<string>(null);
  const [centre, setCentre] = useState<GoogleLatLngLiteral>();
  const [bounds, setBounds] = useState<
    GoogleLatLngBounds | GoogleLatLngBoundsLiteral
  >(initialMapBounds);
  const [zoom, setZoom] = useState<number>(5);
  const [activeSearchString, setActiveSearchString] = useState<string>("");
  const [rooferPopup, setRooferPopup] = useState<RooferData>(null);
  const [activeFilters, updateActiveFilters] = useReducer(
    activeFilterReducer,
    initialActiveFilters
  );

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

  const typeFilter = (type: Roofer["type"]) =>
    type?.length ? type.some((filter) => activeFilters[filter]) : true;

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
        ({ id, name, location }: RooferData): MarkerOptionsWithData => ({
          id,
          title: name,
          position: {
            lat: location.lat,
            lng: location.lon
          },
          isActive: id === selectedRoofer
        })
      ),
    [selectedRoofer, filteredRoofers]
  );

  const handleListCloseClick = () => setSelectedRoofer(null);

  const handleListClick = (roofer: Roofer) => {
    setSelectedRoofer(roofer.id);
    setRooferPopup(roofer);
  };

  const handlePlaceChange = (location: GoogleGeocoderResult) => {
    setBounds(location ? location.geometry.viewport : initialMapBounds);
    setCentre(
      location
        ? {
            lat: location.geometry.location.lat(),
            lng: location.geometry.location.lng()
          }
        : null
    );
  };

  const handleMarkerClick = (id: string) => {
    const clickedRoofer = roofers.find((roofer) => roofer.id === id);

    setRooferPopup(clickedRoofer);
    setSelectedRoofer(id);
  };

  const handleCloseRooferPopup = () => setRooferPopup(null);

  const getUrlClickableAction = (url: LinkData["url"]) =>
    getClickableActionFromUrl(null, url, countryCode);

  const getCompanyDetails = (roofer: Roofer): DetailProps[] => {
    const googleURLLatLng = centre ? `${centre.lat},+${centre.lng}` : "";

    return [
      {
        type: "address",
        text: roofer.address,
        label: getMicroCopy("findARoofer.address")
      },
      {
        // TODO: resolve types assertions of creating DetailProps array
        type: "cta" as "cta",
        text: getMicroCopy("findARoofer.getDirectionsLabel"),
        action: getUrlClickableAction(
          `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
            roofer.address
          )}/`
        ),
        label: getMicroCopy("findARoofer.getDirectionsLabel")
      },
      ...(roofer.distance !== undefined
        ? [
            {
              type: "distance" as "distance",
              text: `${Math.floor(roofer.distance) / 1000}km`,
              label: getMicroCopy("findARoofer.distanceLabel")
            }
          ]
        : []),
      ...(roofer.phone
        ? [
            {
              type: "phone" as "phone",
              text: roofer.phone,
              action: getUrlClickableAction(`tel:${roofer.phone}`),
              label: getMicroCopy("findARoofer.telephoneLabel")
            }
          ]
        : []),
      ...(roofer.email
        ? [
            {
              type: "email" as "email",
              text: roofer.email,
              action: getUrlClickableAction(`mailto:${roofer.email}`),
              label: getMicroCopy("findARoofer.emailLabel")
            }
          ]
        : []),
      ...(roofer.website
        ? [
            {
              type: "website" as "website",
              text: getMicroCopy("findARoofer.websiteLabel"),
              action: getUrlClickableAction(roofer.website),
              label: getMicroCopy("findARoofer.websiteLabel")
            }
          ]
        : []),
      ...(roofer.type
        ? [
            {
              type: "content" as "content",
              label: getMicroCopy("findARoofer.roofTypeLabel"),
              text: <b>{roofer.type}</b>
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
          <Grid item xs={12} md={4} className={styles["search"]}>
            <Autocomplete
              size="small"
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
              options={(roofers || []).map(({ name }) => name)}
              freeSolo
            />
            <Typography className={styles["and-or-label"]}>
              {getMicroCopy("findARoofer.andOr")}
            </Typography>
            <GoogleAutocomplete
              size="small"
              id="location-autocomplete"
              label={getMicroCopy("findARoofer.locationFieldLabel")}
              noOptionsText={getMicroCopy("findARoofer.noResultsLabel")}
              className={styles["location-autocomplete"]}
              onPlaceChange={handlePlaceChange}
              freeSolo
            />
            <GeolocationButton
              onPosition={({ coords }) => {
                setZoom(coords.accuracy / 10);
                setCentre({
                  lat: coords.latitude,
                  lng: coords.longitude
                });
              }}
            >
              {getMicroCopy("findARoofer.geolocationButton")}
            </GeolocationButton>
          </Grid>
          <Grid item xs={12} md={8}>
            <div className={styles["filters"]}>
              <Typography variant="h6">
                {getMicroCopy("findARoofer.filtersLabel")}
              </Typography>
              <div className={styles["chips"]}>
                {rooferTypes.map((rooferType, index) => (
                  <Chip
                    key={index}
                    type="selectable"
                    onClick={() => updateActiveFilters(rooferType)}
                    isSelected={activeFilters[rooferType]}
                  >
                    {rooferType}
                  </Chip>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
        <Tabs
          initialValue="list"
          className={styles["tab-bar"]}
          theme="secondary"
          visibleUntil="md"
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
                  <LinkCard
                    key={roofer.id}
                    onClick={() => handleListClick(roofer)}
                    onCloseClick={handleListCloseClick}
                    isOpen={selectedRoofer === roofer.id}
                    title={roofer.name}
                    subtitle={roofer.address}
                  >
                    <CompanyDetails details={getCompanyDetails(roofer)}>
                      <Typography>{roofer.summary}</Typography>
                    </CompanyDetails>
                  </LinkCard>
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
                bounds={bounds}
                center={centre || initialMapCenter}
                markers={markers}
                onMarkerClick={handleMarkerClick}
                zoom={zoom}
              >
                {rooferPopup && (
                  <Card>
                    <CardHeader
                      title={rooferPopup.name}
                      action={
                        <Button
                          isIconButton
                          variant="text"
                          accessibilityLabel={getMicroCopy("global.close")}
                          onClick={handleCloseRooferPopup}
                        >
                          <CloseIcon />
                        </Button>
                      }
                    ></CardHeader>
                    <CardContent>
                      <CompanyDetails details={getCompanyDetails(rooferPopup)}>
                        <Typography>{rooferPopup.summary}</Typography>
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
  }
`;
