import React from "react";
import { render } from "@testing-library/react";
import { ServiceLocatorResultList } from "../components";
import createService from "../../../__tests__/ServiceHelper";

afterEach(() => {
  jest.clearAllMocks();
});
const listItemTestId = "GTMIntegratedLinkCard-test-id";
const handlePageChange = jest.fn();

describe("ServiceLocatorResultList component", () => {
  it("should renders empty list with NO service", () => {
    const { getByRole } = render(
      <ServiceLocatorResultList
        page={1}
        pageCount={1}
        onPageChange={handlePageChange}
        roofersList={[]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={jest.fn}
        selectedRoofer={null}
        shouldListCertification={false}
      />
    );
    const noResultHeading = getByRole("heading", {
      name: /MC: findARoofer.noResults.title/i
    });
    expect(noResultHeading).toBeDefined();
  });
  it("should renders correctly with single service type", () => {
    const service = createService({
      serviceTypes: [
        { __typename: "ContentfulServiceType", name: "Pitched Roof" },
        { __typename: "ContentfulServiceType", name: "Pitched Roof 2" }
      ]
    });
    const expectedResult = `${service.name} - ${service.address}${
      service.certification ? ` - ${service.certification}` : ""
    }${
      service.serviceTypes && service.serviceTypes.length === 1
        ? ` - ${service.serviceTypes[0].name}`
        : ` - ${service.entryType}`
    } - selected`;
    const { getByTestId } = render(
      <ServiceLocatorResultList
        page={1}
        pageCount={1}
        onPageChange={handlePageChange}
        roofersList={[service]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={jest.fn}
        selectedRoofer={null}
        shouldListCertification={false}
      />
    );
    const gtmData = JSON.parse(
      getByTestId(listItemTestId).getAttribute("data-gtm")
    );
    expect(gtmData.label).toEqual(expectedResult);
  });
  it("should execute callback fn when user click on list item", () => {
    const service = createService({ serviceTypes: [] });
    const onListItemClick = jest.fn();
    const { getByTestId } = render(
      <ServiceLocatorResultList
        page={1}
        pageCount={1}
        onPageChange={handlePageChange}
        roofersList={[service]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={onListItemClick}
        selectedRoofer={null}
        shouldListCertification={false}
      />
    );
    const listItem = getByTestId(listItemTestId);
    listItem.click();
    expect(onListItemClick).toBeCalled();
  });
  it("should print subtitle if shouldListCertification === true", () => {
    const service = createService({ certification: "expert" });
    const onListItemClick = jest.fn();
    const { getByText } = render(
      <ServiceLocatorResultList
        page={1}
        pageCount={1}
        onPageChange={handlePageChange}
        roofersList={[service]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={onListItemClick}
        selectedRoofer={null}
        shouldListCertification={true}
      />
    );
    const listItem = getByText("MC: findARoofer.certificationLabel:");

    expect(listItem).toBeDefined();
  });

  it("should render correctly if pageCount larger then 1", () => {
    const service = createService({ certification: "expert" });
    const onListItemClick = jest.fn();
    const { container } = render(
      <ServiceLocatorResultList
        page={5}
        pageCount={5}
        onPageChange={handlePageChange}
        roofersList={[service]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={onListItemClick}
        selectedRoofer={null}
        shouldListCertification={false}
      />
    );

    const pagination = container.querySelector(".pagination");

    expect(pagination).toBeDefined();
  });
  it("should trigger popup when selectedRoofer.id === service.id", () => {
    const service = createService({ id: "testServiceId" });
    const onListItemClick = jest.fn();
    const { getByTestId } = render(
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
    );
    const integratedLinkCard = getByTestId(listItemTestId);
    let hasSelectedClass = false;
    integratedLinkCard.classList.forEach((item) => {
      if (item.startsWith("LinkCard--selected")) {
        hasSelectedClass = true;
      }
    });
    expect(hasSelectedClass).toBeTruthy();
  });
});
