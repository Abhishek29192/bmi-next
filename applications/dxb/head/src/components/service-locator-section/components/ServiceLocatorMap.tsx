import {
  CardHeader,
  CompanyDetailProps,
  CompanyDetails,
  LatLngLiteral as GoogleLatLngLiteral,
  GoogleMap,
  MarkerOptionsWithData
} from "@bmi-digital/components";
import { Close as CloseIcon } from "@mui/icons-material";
import classnames from "classnames";
import React from "react";
import { microCopy } from "../../../constants/microCopies";
import Image from "../../Image";
import { useSiteContext } from "../../Site";
import { calculateCentre } from "../helpers";
import { Service } from "../index";
import {
  CloseBtn,
  companyLogoClasses,
  ProductDetailsCard,
  ProductDetailsCardBody,
  productDetailsCardClasses,
  ProductDetailsCardSummary,
  StyledServiceLocatorMap
} from "../styles/styles";

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
    <StyledServiceLocatorMap>
      <GoogleMap
        center={calculateCentre(centre, initialMapCentre)}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        zoom={zoom}
        selectedMarkerName={selectedRoofer && selectedRoofer.name}
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
                  <Image
                    className={companyLogoClasses.card}
                    {...selectedRoofer.companyLogo}
                  />
                )
              }
              title={selectedRoofer.name}
              action={
                <CloseBtn
                  isIconButton
                  variant="text"
                  accessibilityLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
                  onClick={clearRooferAndResetMap}
                >
                  <CloseIcon />
                </CloseBtn>
              }
            />
            <ProductDetailsCardBody>
              <CompanyDetails details={getCompanyDetails(selectedRoofer)}>
                {selectedRoofer.summary && (
                  <ProductDetailsCardSummary>
                    {selectedRoofer.summary}
                  </ProductDetailsCardSummary>
                )}
              </CompanyDetails>
            </ProductDetailsCardBody>
          </ProductDetailsCard>
        )}
      </GoogleMap>
    </StyledServiceLocatorMap>
  );
};
