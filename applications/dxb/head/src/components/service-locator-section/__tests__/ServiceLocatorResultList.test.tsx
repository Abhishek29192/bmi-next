import React from "react";
import { render } from "@testing-library/react";
import { ServiceLocatorResultList } from "../components";
import createService from "../../../__tests__/ServiceHelper";
import { RooferTypesEnum } from "../../Service";

afterEach(() => {
  jest.clearAllMocks();
});
const listItemTestId = "GTMIntegratedLinkCard-test-id";

describe("ServiceLocatorResultList component", () => {
  it("should renders empty list with NO service", () => {
    const { getByRole } = render(
      <ServiceLocatorResultList
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
    const service = createService({ type: [RooferTypesEnum.PITCHED_ROOF] });
    const expectedResult = `${service.name} - ${service.address}${
      service.certification ? ` - ${service.certification}` : ""
    }${
      service.type && service.type.length === 1
        ? ` - ${service.type[0]}`
        : ` - ${service.entryType}`
    } - selected`;
    const { getByTestId } = render(
      <ServiceLocatorResultList
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
    const service = createService({ type: [] });
    const onListItemClick = jest.fn();
    const { getByTestId } = render(
      <ServiceLocatorResultList
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
  it("should trigger popup when selectedRoofer.id === service.id", () => {
    const service = createService({ id: "testServiceId" });
    const onListItemClick = jest.fn();
    const { getByTestId } = render(
      <ServiceLocatorResultList
        roofersList={[service]}
        getCompanyDetails={jest.fn()}
        onCloseCard={jest.fn()}
        onListItemClick={onListItemClick}
        selectedRoofer={service}
        shouldListCertification={true}
      />
    );
    const integratedLinkCard = getByTestId(listItemTestId);

    expect(
      integratedLinkCard.classList.contains("LinkCard--selected")
    ).toBeTruthy();
  });
});