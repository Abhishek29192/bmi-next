import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import createService from "../../../../../__tests__/helpers/ServiceHelper";
import { selectedRooferMock } from "../../../__mocks__/markers";
import { ServiceLocatorResultList } from "../../../components";

afterEach(() => {
  jest.clearAllMocks();
});
const listItemTestId = "GTMIntegratedLinkCard-test-id";
const handlePageChange = jest.fn();
const onListItemClick = jest.fn();

describe("ServiceLocatorResultList component", () => {
  it("should render empty list with NO service", () => {
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={{ ...selectedRooferMock }}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );
    const noResultHeading = screen.getByRole("heading", {
      name: /MC: findARoofer.noResults.title/i
    });
    expect(noResultHeading).toBeDefined();
  });

  it("should render correctly with single service type", () => {
    const service = createService({
      serviceTypes: [
        { __typename: "ServiceType", name: "Pitched Roof" },
        { __typename: "ServiceType", name: "Pitched Roof 2" }
      ]
    });
    const expectedResult = `${service.name} - ${service.address}${
      service.certification ? ` - ${service.certification}` : ""
    }${
      service.serviceTypes && service.serviceTypes.length === 1
        ? ` - ${service.serviceTypes[0].name}`
        : ` - ${service.entryType}`
    } - selected`;
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={service}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );
    const gtmData = JSON.parse(
      screen.getByTestId(listItemTestId).getAttribute("data-gtm")!
    );
    expect(gtmData.label).toEqual(expectedResult);
  });

  it("should execute callback fn when user click on list item", () => {
    const service = createService({ serviceTypes: [] });
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={{ ...selectedRooferMock }}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );
    const listItem = screen.getByTestId(listItemTestId);
    fireEvent.click(listItem);
    expect(onListItemClick).toHaveBeenCalled();
  });

  it("should print subtitle if shouldListCertification === true", () => {
    const service = createService({ certification: "Expert" });
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={service}
          shouldListCertification={true}
        />
      </ThemeProvider>
    );
    const listItem = screen.getByText("MC: findARoofer.certificationLabel:");

    expect(listItem).toBeInTheDocument();
  });

  it("should not print subtitle if shouldListCertification === false", () => {
    const service = createService({ certification: "Expert" });
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={service}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );

    expect(
      screen.queryByText("MC: findARoofer.certificationLabel:")
    ).not.toBeInTheDocument();
  });

  it("should render correctly if pageCount larger then 1", () => {
    const service = createService({ certification: "Expert" });
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={5}
          pageCount={5}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={service}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );

    const pagination = screen.getByTestId("pagination-root");

    expect(pagination).toBeDefined();
  });

  it("should trigger popup when selectedRoofer.id === service.id", () => {
    const service = createService({ id: "testServiceId" });
    render(
      <ThemeProvider>
        <ServiceLocatorResultList
          page={1}
          pageCount={1}
          onPageChange={handlePageChange}
          roofersList={[service]}
          getCompanyDetails={jest.fn()}
          onCloseCard={jest.fn()}
          onListItemClick={onListItemClick}
          selectedRoofer={service}
          shouldListCertification={false}
        />
      </ThemeProvider>
    );
    const integratedLinkCard = screen.getByTestId(listItemTestId);
    let hasSelectedClass = false;
    integratedLinkCard.classList.forEach((item) => {
      if (item.startsWith("LinkCard-open")) {
        hasSelectedClass = true;
      }
    });
    expect(hasSelectedClass).toBeTruthy();
  });
});
