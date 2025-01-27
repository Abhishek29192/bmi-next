import { CardHeader } from "@bmi-digital/components/card";
import CompanyDetails, {
  CompanyDetailProps
} from "@bmi-digital/components/company-details";
import {
  LatLngLiteral as GoogleLatLngLiteral,
  MarkerOptionsWithData
} from "@bmi-digital/components/google-api";
import GoogleMap from "@bmi-digital/components/google-map";
import CloseIcon from "@bmi-digital/components/icon/Close";
import { microCopy } from "@bmi/microcopies";
import classnames from "classnames";
import React, { useState } from "react";
import { useSiteContext } from "../../Site";
import { calculateCentre } from "../helpers";
import { Service } from "../index";
import {
  CloseBtn,
  CompanyLogo,
  ProductDetailsCard,
  ProductDetailsCardBody,
  StyledServiceLocatorMap,
  companyLogoClasses,
  productDetailsCardClasses
} from "../styles/styles";

export interface MapProps {
  initialMapCentre: { lat: number; lon: number };
  markers: MarkerOptionsWithData<Service>[];
  zoom: number;
  selectedRoofer: Service | null;
  handleMarkerClick: (service: Service) => void;
  clearRooferAndResetMap: () => void;
  centre: GoogleLatLngLiteral;
  getCompanyDetails: (service: Service) => CompanyDetailProps;
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
  const [newCentre, setNewCentre] = useState<GoogleLatLngLiteral>();

  return (
    <StyledServiceLocatorMap>
      <GoogleMap
        center={calculateCentre(newCentre ?? centre, initialMapCentre)}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        zoom={zoom}
        selectedMarkerName={selectedRoofer && selectedRoofer.name}
        passNewCenter={(c: google.maps.LatLng) => setNewCentre(c.toJSON())}
        handleCloseCard={clearRooferAndResetMap}
      >
        {selectedRoofer && (
          <ProductDetailsCard
            className={classnames(
              selectedRoofer.companyLogo && productDetailsCardClasses.withLogo
            )}
            data-testid={`service-locator-service-details-card-${selectedRoofer.id}`}
          >
            <CardHeader
              avatar={
                selectedRoofer.companyLogo && (
                  <CompanyLogo
                    className={companyLogoClasses.card}
                    data-testid={`service-locator-service-details-card-logo-${selectedRoofer.id}`}
                    widths={[561, 321, 381, 446, 330]}
                    {...selectedRoofer.companyLogo}
                  />
                )
              }
              title={selectedRoofer.name}
              action={
                <CloseBtn
                  variant="text"
                  accessibilityLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
                  onClick={clearRooferAndResetMap}
                >
                  <CloseIcon />
                </CloseBtn>
              }
            />
            <ProductDetailsCardBody>
              <CompanyDetails {...getCompanyDetails(selectedRoofer)} />
            </ProductDetailsCardBody>
          </ProductDetailsCard>
        )}
      </GoogleMap>
    </StyledServiceLocatorMap>
  );
};
