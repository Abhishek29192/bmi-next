import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import withGTM, { pushToDataLayer } from "../google-tag-manager";

declare let window: Window & {
  dataLayer: {
    push: () => {
      // no-op
    };
  };
};

const mockPush = jest.fn();
window.dataLayer = {
  push: mockPush
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  delete process.env.GATSBY_PREVIEW;
});

describe("pushToDataLayer", () => {
  it("should pass on only provided data to the data layer", () => {
    pushToDataLayer({
      id: "test-id"
    });
    expect(mockPush).toBeCalledWith({
      id: "test-id"
    });
  });

  it("should pass on all data to the data layer", () => {
    pushToDataLayer({
      id: "test-id",
      event: "test-event",
      label: "test-label",
      action: "test-action"
    });
    expect(mockPush).toBeCalledWith({
      id: "test-id",
      event: "test-event",
      label: "test-label",
      action: "test-action"
    });
  });
});

describe("withGTM", () => {
  type TestComponentProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  const TestComponent = ({ ...props }: TestComponentProps) => (
    <div {...props} />
  );

  it("should throw error if no GTM data added", () => {
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    try {
      render(<GtmComponent />);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toStrictEqual("No GTM data provided.");
    }
  });

  it("should add gtm data as data-gtm attribute to component", () => {
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      ...expectedGtm,
      event: "test-event"
    };

    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    const { container } = render(<GtmComponent gtm={gtm} />);

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should add custom props data as data-gtm attribute to component", () => {
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      event: "custom-event",
      id: "custom-id",
      label: "custom-label",
      action: "custom-action"
    };

    const GtmComponent = withGTM<TestComponentProps>(TestComponent, gtm);

    const { container } = render(
      <GtmComponent
        custom-event={"test-event"}
        custom-id={"test-id"}
        custom-label={"test-label"}
        custom-action={"test-action"}
      />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should convert custom props data to strings if they are not strings", () => {
    const expectedGtm = {
      id: "[object Object]",
      label: "[object Object]",
      action:
        '() => {\n                console.log("do something");\n            }'
    };
    const gtm = {
      event: "children",
      id: "children",
      label: "children",
      action: "onClick"
    };

    const GtmComponent = withGTM<TestComponentProps>(TestComponent, gtm);

    const { container } = render(
      <GtmComponent
        onClick={() => {
          console.log("do something");
        }}
      >
        <div>
          <span>some text</span>
        </div>
      </GtmComponent>
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should add action data-gtm data as data-gtm attribute to component", () => {
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      ...expectedGtm,
      event: "test-event"
    };

    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    const { container } = render(
      <GtmComponent action={{ "data-gtm": JSON.stringify(gtm) }} />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should prefer gtm over custom props to populate data-gtm attribute", () => {
    const gtm = {
      event: "gtm-event",
      id: "gtm-id",
      label: "gtm-label",
      action: "gtm-action"
    };
    const customProps = {
      event: "custom-event",
      id: "custom-id",
      label: "custom-label",
      action: "custom-action"
    };
    const expectedGtm = {
      id: "gtm-id",
      label: "gtm-label",
      action: "gtm-action"
    };
    const GtmComponent = withGTM<TestComponentProps>(
      TestComponent,
      customProps
    );

    const { container } = render(
      <GtmComponent
        custom-id={"custom-props-id"}
        custom-label={"custom-props-label"}
        custom-action={"custom-props-action"}
        gtm={gtm}
      />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should prefer custom props over action data-gtm to populate data-gtm attribute", () => {
    const customProps = {
      event: "custom-event",
      id: "custom-id",
      label: "custom-label",
      action: "custom-action"
    };
    const actionDataGtm = {
      event: "action-event",
      id: "action-id",
      label: "action-label",
      action: "action-action"
    };
    const expectedGtm = {
      id: "custom-props-id",
      label: "custom-props-label",
      action: "custom-props-action"
    };
    const GtmComponent = withGTM<TestComponentProps>(
      TestComponent,
      customProps
    );

    const { container } = render(
      <GtmComponent
        action={{ "data-gtm": JSON.stringify(actionDataGtm) }}
        custom-id={"custom-props-id"}
        custom-label={"custom-props-label"}
        custom-action={"custom-props-action"}
      />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should use data wherever possible to populate data-gtm attribute", () => {
    const gtm = {
      event: "gtm-event",
      id: "gtm-id"
    };
    const customProps = {
      event: "custom-event",
      id: "custom-id",
      action: "custom-action"
    };
    const actionDataGtm = {
      event: "action-event",
      id: "action-id",
      label: "action-label",
      action: "action-action"
    };
    const expectedGtm = {
      id: "gtm-id",
      label: "action-label",
      action: "custom-props-action"
    };
    const GtmComponent = withGTM<TestComponentProps>(
      TestComponent,
      customProps
    );

    const { container } = render(
      <GtmComponent
        action={{ "data-gtm": JSON.stringify(actionDataGtm) }}
        custom-id={"custom-props-id"}
        custom-action={"custom-props-action"}
        gtm={gtm}
      />
    );

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should only include data provided", () => {
    const gtm = {
      id: "gtm-id"
    };
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    const { container } = render(<GtmComponent gtm={gtm} />);

    expect(container.firstChild).toHaveAttribute(
      "data-gtm",
      JSON.stringify(gtm)
    );
  });

  it("should push gtm data to dataLayer on click", () => {
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      ...expectedGtm,
      event: "test-event"
    };
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    const { container } = render(<GtmComponent gtm={gtm} />);
    fireEvent.click(container.firstChild);

    expect(mockPush).toHaveBeenCalledWith(expectedGtm);
  });

  it("should not overwrite desired onClick behaviour", () => {
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      ...expectedGtm,
      event: "test-event"
    };
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);
    const onClick = jest.fn();

    const { container } = render(<GtmComponent gtm={gtm} onClick={onClick} />);
    fireEvent.click(container.firstChild);

    expect(mockPush).toHaveBeenCalledWith(expectedGtm);
    expect(onClick).toHaveBeenCalled();
  });

  it("should do nothing if GATSBY_PREVIEW is true", () => {
    process.env.GATSBY_PREVIEW = "true";
    const expectedGtm = {
      id: "test-id",
      label: "test-label",
      action: "test-action"
    };
    const gtm = {
      ...expectedGtm,
      event: "test-event"
    };
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    const { container } = render(<GtmComponent gtm={gtm} />);
    fireEvent.click(container.firstChild);

    expect(container.firstChild).not.toHaveAttribute("data-gtm");
    expect(mockPush).toHaveBeenCalledTimes(0);
  });
});
