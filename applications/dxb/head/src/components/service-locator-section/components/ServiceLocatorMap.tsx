import {
  LatLngLiteral as GoogleLatLngLiteral,
  MarkerOptionsWithData
} from "@bmi-digital/components/google-api";
import { CompanyDetailProps } from "@bmi-digital/components/company-details";
import GoogleMap from "@bmi-digital/components/google-map";
import Card from "@bmi-digital/components/card";
import { CardContent, CardHeader } from "@bmi-digital/components/card";
import Button from "@bmi-digital/components/button";
import CloseIcon from "@material-ui/icons/Close";
import CompanyDetails from "@bmi-digital/components/company-details";
import Typography from "@bmi-digital/components/typography";
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
  ) => CompanyDetailProps[];
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
