import {
  LatLngLiteral as GoogleLatLngLiteral,
  MarkerOptionsWithData
} from "@bmi/components";
import { CompanyDetailProps } from "@bmi/components";
import { GoogleMap } from "@bmi/components";
import { Card } from "@bmi/components";
import { CardContent, CardHeader } from "@bmi/components";
import { Button } from "@bmi/components";
import { CompanyDetails } from "@bmi/components";
import { Typography } from "@bmi/components";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
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
}: MapProps): React.ReactElement => {
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
              <CompanyDetails details={getCompanyDetails(selectedRoofer)}>
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
