import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { MapProps, ServiceLocatorMap } from "../components";
import "@testing-library/jest-dom";
import { selectedRooferMock } from "../__mocks__/mocks";

jest.mock("@bmi-digital/components/google-map", () => {
  const GoogleMap = jest.fn().mockImplementation(({ children }) => {
    return (
      <div className="GoogleMap">
        <div className="map"></div>
        {children && <div className="popup">{children}</div>}
      </div>
    );
  });

  return {
    __esModule: true,
    default: GoogleMap
  };
});

const renderWithGoogleProvider = ({
  selectedRoofer = null,
  clearRooferAndResetMap = jest.fn(),
  getCompanyDetails = jest.fn(),
  initialMapCentre = { lat: 60.47202, lon: 8.468945 },
  centre = { lat: 49.9874545, lng: 36.2091401 },
  handleMarkerClick = jest.fn(),
  markers = [],
  zoom = 2
}: Partial<MapProps>) => {
  return render(
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
};

describe("ServiceLocatorMap component", () => {
  it("should not render popup with card if user didn't select a roofer in list", () => {
    const { container } = renderWithGoogleProvider({});
    const popupContainer = container.querySelector("popup");
    expect(popupContainer).not.toBeInTheDocument();
  });
  it("should render popup with card if user select a roofer in list", () => {
    const clearRooferAndResetMap = jest.fn();
    const { getByRole } = renderWithGoogleProvider({
      selectedRoofer: selectedRooferMock,
      clearRooferAndResetMap: clearRooferAndResetMap
    });
    const popupCloseBtn = getByRole("button", { name: "MC: global.close" });
    expect(popupCloseBtn).toBeInTheDocument();
    fireEvent.click(popupCloseBtn);
    expect(clearRooferAndResetMap).toHaveBeenCalled();
  });
  it("should not render popup card title and CompanyDetails summary", () => {
    const { getByText } = renderWithGoogleProvider({
      selectedRoofer: selectedRooferMock
    });
    const title = getByText(selectedRooferMock.name);
    const summary = getByText(selectedRooferMock.summary);
    expect(title).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
  });
  it("should render popup card title and CompanyDetails summary", () => {
    const { queryByText } = renderWithGoogleProvider({
      selectedRoofer: {
        ...selectedRooferMock,
        name: undefined,
        summary: undefined
      }
    });
    const title = queryByText(selectedRooferMock.name);
    const summary = queryByText(selectedRooferMock.summary);
    expect(title).toBeNull();
    expect(summary).toBeNull();
  });
  it("should invoke getCompanyDetails", () => {
    const getCompanyDetails = jest.fn();
    renderWithGoogleProvider({
      selectedRoofer: selectedRooferMock,
      getCompanyDetails: getCompanyDetails
    });
    expect(getCompanyDetails).toHaveBeenCalled();
  });
});
