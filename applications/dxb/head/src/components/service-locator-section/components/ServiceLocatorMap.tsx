import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CompanyDetailProps,
  CompanyDetails,
  GoogleMap,
  LatLngLiteral as GoogleLatLngLiteral,
  MarkerOptionsWithData,
  Typography
} from "@bmi-digital/components";
import CloseIcon from "@mui/icons-material/Close";
import classnames from "classnames";
import React from "react";
import { microCopy } from "../../../constants/microCopies";
import Image from "../../Image";
import { useSiteContext } from "../../Site";
import { calculateCentre } from "../helpers";
import { Service } from "../index";
import styles from "../styles/ServiceLocatorSection.module.scss";

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
        center={calculateCentre(centre, initialMapCentre)}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        zoom={zoom}
      >
        {selectedRoofer && (
          <Card
            className={classnames(styles["product-details-card"], {
              // eslint-disable-next-line security/detect-object-injection
              [styles["product-details-card--with_logo"]]:
                selectedRoofer.companyLogo
            })}
          >
            <CardHeader
              avatar={
                <Image
                  data={selectedRoofer.companyLogo}
                  className={styles["company-logo--card"]}
                />
              }
              title={selectedRoofer.name}
              action={
                <Button
                  isIconButton
                  variant="text"
                  accessibilityLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
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
