import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Filters from "../";

describe("Filters component", () => {
  it("renders correctly", () => {
    const { container } = render(<Filters filters={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders multiple filters", () => {
    const filters = [
      {
        label: "Label 1",
        name: "product-1",
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2"
          }
        ]
      },
      {
        label: "Label 2",
        name: "product-2",
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2"
          }
        ]
      }
    ];

    const { container } = render(<Filters filters={filters} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders selected filters", () => {
    const filters = [
      {
        label: "Label 1",
        name: "product-1",
        value: ["option-2"],
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2"
          }
        ]
      }
    ];

    const { container } = render(<Filters filters={filters} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders disabled filters", () => {
    const filters = [
      {
        label: "Label 1",
        name: "product-1",
        value: ["option-2"],
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2",
            isDisabled: true
          }
        ]
      }
    ];

    const { container } = render(<Filters filters={filters} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange handler", () => {
    const filters = [
      {
        label: "Label 1",
        name: "product-1",
        value: ["option-3"],
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2",
            isDisabled: true
          },
          {
            label: "Option 3",
            value: "option-3"
          }
        ]
      }
    ];
    const onChange = jest.fn();

    const { getByLabelText } = render(
      <Filters filters={filters} onChange={onChange} />
    );
    fireEvent.click(getByLabelText(filters[0].options[0].label));
    expect(onChange.mock.calls).toMatchSnapshot();
  });

  it("renders correct summaryLabel if filter.label is an empty string", () => {
    const filters = [
      {
        label: "",
        name: "product-1",
        value: ["option-2"],
        options: [
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2",
            isDisabled: true
          }
        ]
      }
    ];

    const { container } = render(<Filters filters={filters} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
