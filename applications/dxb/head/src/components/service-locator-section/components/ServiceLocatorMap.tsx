import {
  LatLngLiteral as GoogleLatLngLiteral,
  MarkerOptionsWithData
} from "@bmi/google-api/src";
import { DetailProps } from "@bmi/company-details/src";
import GoogleMap from "@bmi/google-map";
import Card from "@bmi/card";
import { CardContent, CardHeader } from "@bmi/card";
import Button from "@bmi/button";
import CloseIcon from "@material-ui/icons/Close";
import CompanyDetails from "@bmi/company-details";
import Typography from "@bmi/typography";
import React from "react";
import { EVENT_CAT_ID_LINK_CLICKS } from "../constants";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { useSiteContext } from "../../Site";
import { Service } from "../index";
import { calculateCenter } from "../helpers";

export interface MapProps {
  initialMapCentre: { lat: number; lon: number };
  markers: MarkerOptionsWithData<Service>[];
  zoom: number;
  selectedRoofer: Service;
  handleMarkerClick: (service: Service) => void;
  clearRooferAndResetMap: () => void;
  centre: GoogleLatLngLiteral;
  getCompanyDetails: (
    eventCategoryId: string,
    service: Service,
    isAddressHidden?: boolean
  ) => DetailProps[];
}

export const ServiceLocatorMap = ({
  initialMapCentre,
  markers,
  zoom,
  selectedRoofer,
  handleMarkerClick,
  clearRooferAndResetMap,
  centre,
  getCompanyDetails
}: MapProps) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <div className={styles["map"]}>
      <GoogleMap
        center={calculateCenter(centre, initialMapCentre)}
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
                  className={styles["product-details-card__close-button"]}
                >
                  <CloseIcon />
                </Button>
              }
            />
            <CardContent>
              <CompanyDetails
                details={getCompanyDetails(
                  EVENT_CAT_ID_LINK_CLICKS,
                  selectedRoofer
                )}
              >
                {selectedRoofer.summary && (
                  <Typography>{selectedRoofer.summary}</Typography>
                )}
              </CompanyDetails>
            </CardContent>
          </Card>
        )}
      </GoogleMap>
    </div>
  );
};
