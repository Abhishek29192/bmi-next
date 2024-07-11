import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { MapProps, ServiceLocatorMap } from "../components";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";

jest.mock("@bmi-digital/components/google-map", () => {
  const originalModule = jest.requireActual(
    "@bmi-digital/components/google-map"
  );
  const GoogleMap = jest.fn().mockImplementation(({ children }) => {
    return (
      <div className="GoogleMap">
        <div className="map" />
        {children && <div className="popup">{children}</div>}
      </div>
    );
  });

  return {
    ...originalModule,
    __esModule: true,
    default: GoogleMap
  };
});

const props: MapProps = {
  selectedRoofer: createService(),
  clearRooferAndResetMap: jest.fn(),
  getCompanyDetails: jest.fn(),
  initialMapCentre: { lat: 60.47202, lon: 8.468945 },
  centre: { lat: 49.9874545, lng: 36.2091401 },
  handleMarkerClick: jest.fn(),
  markers: [],
  zoom: 2
};

describe("ServiceLocatorMap component", () => {
  const {
    selectedRoofer,
    clearRooferAndResetMap,
    getCompanyDetails,
    initialMapCentre,
    centre,
    handleMarkerClick,
    markers,
    zoom
  } = props;

  it("should render the company logo if defined", () => {
    renderWithProviders(
      <ServiceLocatorMap
        selectedRoofer={createService({
          companyLogo: {
            __typename: "Image",
            title: "Title",
            altText: "company-logo-alt-text",
            image: {
              fileName: "company-logo-example-filename",
              url: "company/logo/url",
              contentType: "image/jpg",
              width: 100,
              height: 100,
              size: 100
            }
          }
        })}
        getCompanyDetails={getCompanyDetails}
        initialMapCentre={initialMapCentre}
        centre={centre}
        clearRooferAndResetMap={clearRooferAndResetMap}
        handleMarkerClick={handleMarkerClick}
        markers={markers}
        zoom={zoom}
      />
    );
    expect(
      screen.getByTestId("service-locator-service-details-card-logo-roofer_id")
    ).toBeInTheDocument();
  });

  it("should not render the company logo if it's not provided", () => {
    renderWithProviders(
      <ServiceLocatorMap
        selectedRoofer={createService({
          companyLogo: undefined
        })}
        getCompanyDetails={getCompanyDetails}
        initialMapCentre={initialMapCentre}
        centre={centre}
        clearRooferAndResetMap={clearRooferAndResetMap}
        handleMarkerClick={handleMarkerClick}
        markers={markers}
        zoom={zoom}
      />
    );
    expect(
      screen.queryByTestId(
        "service-locator-service-details-card-logo-roofer_id"
      )
    ).not.toBeInTheDocument();
  });

  it("should render popup with card if user select a roofer in list", () => {
    renderWithProviders(
      <ServiceLocatorMap
        selectedRoofer={selectedRoofer}
        getCompanyDetails={getCompanyDetails}
        initialMapCentre={initialMapCentre}
        centre={centre}
        clearRooferAndResetMap={clearRooferAndResetMap}
        handleMarkerClick={handleMarkerClick}
        markers={markers}
        zoom={zoom}
      />
    );

    const popupCloseBtn = screen.getByRole("button", {
      name: "MC: global.close"
    });

    expect(popupCloseBtn).toBeInTheDocument();
    fireEvent.click(popupCloseBtn);
    expect(clearRooferAndResetMap).toHaveBeenCalled();
  });

  it("should invoke getCompanyDetails", () => {
    renderWithProviders(
      <ServiceLocatorMap
        selectedRoofer={selectedRoofer}
        getCompanyDetails={getCompanyDetails}
        initialMapCentre={initialMapCentre}
        centre={centre}
        clearRooferAndResetMap={clearRooferAndResetMap}
        handleMarkerClick={handleMarkerClick}
        markers={markers}
        zoom={zoom}
      />
    );
    expect(getCompanyDetails).toHaveBeenCalled();
  });
});
