import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MapProps, ServiceLocatorMap } from "../components";
import { imageData, selectedRooferMock } from "../__mocks__/markers";

jest.mock("@bmi-digital/components", () => ({
  ...jest.requireActual("@bmi-digital/components"),
  GoogleMap: jest.fn().mockImplementation(({ children }) => {
    return (
      <div className="GoogleMap">
        <div className="map" />
        {children && <div className="popup">{children}</div>}
      </div>
    );
  })
}));

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
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

describe("ServiceLocatorMap component", () => {
  it("should render company logo inside card", () => {
    renderWithGoogleProvider({
      selectedRoofer: {
        ...selectedRooferMock,
        companyLogo: { ...imageData }
      }
    });
    expect(screen.getByAltText(imageData.altText)).toBeInTheDocument();
  });

  it("should NOT render popup with card", () => {
    renderWithGoogleProvider({});
    const popupCloseBtn = screen.queryByRole("button", {
      name: "MC: global.close"
    });
    expect(popupCloseBtn).not.toBeInTheDocument();
  });

  it("should NOT render popup card title and CompanyDetails summary", () => {
    renderWithGoogleProvider({
      selectedRoofer: {
        ...selectedRooferMock,
        name: undefined,
        summary: undefined
      }
    });
    const title = screen.queryByText(selectedRooferMock.name);
    const summary = screen.queryByText(selectedRooferMock.summary);
    expect(title).toBeNull();
    expect(summary).toBeNull();
  });

  describe("When a service is selected", () => {
    it("should render popup with card", () => {
      const clearRooferAndResetMap = jest.fn();
      renderWithGoogleProvider({
        selectedRoofer: selectedRooferMock,
        clearRooferAndResetMap: clearRooferAndResetMap
      });
      const popupCloseBtn = screen.getByRole("button", {
        name: "MC: global.close"
      });
      expect(popupCloseBtn).toBeInTheDocument();
      fireEvent.click(popupCloseBtn);
      expect(clearRooferAndResetMap).toHaveBeenCalled();
    });

    it("should render popup card title and CompanyDetails summary", () => {
      renderWithGoogleProvider({
        selectedRoofer: selectedRooferMock
      });
      const title = screen.getByText(selectedRooferMock.name);
      const summary = screen.getByText(selectedRooferMock.summary);
      expect(title).toBeInTheDocument();
      expect(summary).toBeInTheDocument();
    });

    describe("When company details contain social media links", () => {
      describe("When a social-media link is clicked", () => {
        it("should call 'onClick' handler", () => {
          const channel = "facebook";
          const mockOnClick = jest.fn();

          renderWithGoogleProvider({
            selectedRoofer: {
              ...selectedRooferMock,
              [channel]: "foo.com"
            },
            getCompanyDetails: () => [
              {
                channels: { facebook: "blah" },
                label: "Connect",
                onClick: mockOnClick,
                type: "socialMedia"
              }
            ]
          });

          fireEvent.click(screen.getByRole("link", { name: channel }));
          expect(mockOnClick).toBeCalledTimes(1);
          expect(mockOnClick).toBeCalledWith({ channel });
        });
      });
    });
  });
});
