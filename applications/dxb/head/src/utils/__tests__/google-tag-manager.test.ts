import { pushToDataLayer } from "../google-tag-manager";

declare let window: Window & {
  dataLayer: { push: () => {} };
};

const mockPush = jest.fn();
window.dataLayer = {
  push: mockPush
};

describe("pushToDataLayer", () => {
  it("should default event to gtm.click if not provided", () => {
    pushToDataLayer({
      id: "test-id",
      label: "test-label",
      action: "test-action"
    });
    expect(mockPush).toBeCalledWith({
      id: "test-id",
      event: "gtm.click",
      label: "test-label",
      action: "test-action"
    });
  });

  it("should not default label if not provided", () => {
    pushToDataLayer({
      id: "test-id",
      event: "test-event",
      action: "test-action"
    });
    expect(mockPush).toBeCalledWith({
      id: "test-id",
      event: "test-event",
      action: "test-action"
    });
  });

  it("should not default action if not provided", () => {
    pushToDataLayer({
      id: "test-id",
      event: "test-event",
      label: "test-label"
    });
    expect(mockPush).toBeCalledWith({
      id: "test-id",
      event: "test-event",
      label: "test-label"
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
