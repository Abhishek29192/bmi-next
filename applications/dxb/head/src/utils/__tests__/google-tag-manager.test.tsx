const mockContext = jest.fn().mockReturnValue({ idMap: {} });
import { fireEvent, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import * as GTM from "../google-tag-manager";

const withGTM = GTM.default;
const pushToDataLayer = GTM.pushToDataLayer;
const useGTM = GTM.useGTM;

jest.mock("react", () => ({
  ...(jest.requireActual("react") as any),
  useContext: mockContext
}));

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
    <div data-testid="test-component" {...props} />
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

    render(<GtmComponent gtm={gtm} />);

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(
      <GtmComponent
        custom-event={"test-event"}
        custom-id={"test-id"}
        custom-label={"test-label"}
        custom-action={"test-action"}
      />
    );

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(
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

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(<GtmComponent action={{ "data-gtm": JSON.stringify(gtm) }} />);

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(
      <GtmComponent
        custom-id={"custom-props-id"}
        custom-label={"custom-props-label"}
        custom-action={"custom-props-action"}
        gtm={gtm}
      />
    );

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(
      <GtmComponent
        action={{ "data-gtm": JSON.stringify(actionDataGtm) }}
        custom-id={"custom-props-id"}
        custom-label={"custom-props-label"}
        custom-action={"custom-props-action"}
      />
    );

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(
      <GtmComponent
        action={{ "data-gtm": JSON.stringify(actionDataGtm) }}
        custom-id={"custom-props-id"}
        custom-action={"custom-props-action"}
        gtm={gtm}
      />
    );

    expect(screen.getByTestId("test-component")).toHaveAttribute(
      "data-gtm",
      JSON.stringify(expectedGtm)
    );
  });

  it("should only include data provided", () => {
    const gtm = {
      id: "gtm-id"
    };
    const GtmComponent = withGTM<TestComponentProps>(TestComponent);

    render(<GtmComponent gtm={gtm} />);

    expect(screen.getByTestId("test-component")).toHaveAttribute(
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

    render(<GtmComponent gtm={gtm} />);
    fireEvent.click(screen.getByTestId("test-component"));

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

    render(<GtmComponent gtm={gtm} onClick={onClick} />);
    fireEvent.click(screen.getByTestId("test-component"));

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

    render(<GtmComponent gtm={gtm} />);
    fireEvent.click(screen.getByTestId("test-component"));

    expect(screen.getByTestId("test-component")).not.toHaveAttribute(
      "data-gtm"
    );
    expect(mockPush).toHaveBeenCalledTimes(0);
  });
});

describe("useGTM", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const gtm = {
    id: "gtm-id",
    label: "gtm-label",
    action: "Click"
  };
  describe("when gtm id exists in gtm context id map", () => {
    it("should use value from idMap for dataGTM", () => {
      mockContext.mockReturnValueOnce({ idMap: { "gtm-id": "context-id" } });
      const { result } = renderHook(() => useGTM(gtm));
      expect(result.current.dataGTM).toEqual({
        id: "context-id",
        label: "gtm-label",
        action: "Click"
      });
    });
  });

  describe("when gtm id doesn't exists in gtm context id map", () => {
    it("should use value passed with gtm object", () => {
      const { result } = renderHook(() => useGTM(gtm));
      expect(result.current.dataGTM).toEqual({
        id: "gtm-id",
        label: "gtm-label",
        action: "Click"
      });
    });
  });

  describe("when GATSBY_PREVIEW env undefined", () => {
    beforeAll(() => {
      delete process.env.GATSBY_PREVIEW;
    });

    describe("and pushGTMEvent triggered", () => {
      it("should call pushToDataLayer", () => {
        jest.spyOn(GTM, "pushToDataLayer");
        const { result } = renderHook(() => useGTM(gtm));
        result.current.pushGTMEvent();

        expect(GTM.pushToDataLayer).toBeCalledWith(gtm);
      });
    });
  });

  describe("when GATSBY_PREVIEW env is not undefined", () => {
    beforeEach(() => {
      process.env.GATSBY_PREVIEW = "true";
    });

    describe("and pushGTMEvent triggered", () => {
      it("shouldn't call pushToDataLayer", () => {
        jest.spyOn(GTM, "pushToDataLayer");
        const { result } = renderHook(() => useGTM(gtm));
        result.current.pushGTMEvent();

        expect(GTM.pushToDataLayer).not.toBeCalled();
      });
    });
  });
});
