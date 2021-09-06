import React from "react";
import { mockAddress } from "../../../fixtures/address";
import { render, screen } from "../../../lib/tests/utils";
import { Address } from "..";

describe("Address", () => {
  it("should render null if no address is provided", () => {
    const { container } = render(<Address address={null} />);
    expect(container.firstChild).toEqual(null);
  });

  it("should render firstLine", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-firstLine")).toBeInTheDocument();
    expect(screen.getByText("Nursery Rd")).toBeInTheDocument();
  });
  it("should render secondLine", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-secondLine")).toBeInTheDocument();
    expect(screen.getByText("Brixton")).toBeInTheDocument();
  });
  it("should render town", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-town")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
  });
  it("should render region", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-region")).toBeInTheDocument();
    expect(screen.getByText("Some Region")).toBeInTheDocument();
  });
  it("should render country", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-country")).toBeInTheDocument();
    expect(screen.getByText("UK")).toBeInTheDocument();
  });
  it("should render postcode", () => {
    render(<Address address={mockAddress} />);
    expect(screen.getByTestId("addressLine-postcode")).toBeInTheDocument();
    expect(screen.getByText("SW9 8BP")).toBeInTheDocument();
  });

  it("should not render empty fields", () => {
    render(<Address address={{ ...mockAddress, region: null }} />);
    expect(screen.queryByTestId("addressLine-region")).toBeNull();
  });
});
