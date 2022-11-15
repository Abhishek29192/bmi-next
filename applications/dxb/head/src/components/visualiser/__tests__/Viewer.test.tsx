import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Viewer, { Props, State } from "../Viewer";
import tileMock from "./__mocks__/tile";
import sidingMock from "./__mocks__/siding";

class ViewerImpl extends Viewer<Props, State> {
  load() {}
  loadModel(props) {
    return Promise.resolve(props);
  }
}

function getRoundDistance(viewer: ViewerImpl) {
  return (
    Math.round(
      viewer.camera.position.distanceTo(viewer.controls.target) * 100
    ) / 100
  );
}

function getRoundPolarAngle(viewer: ViewerImpl) {
  return Math.round(viewer.controls.getPolarAngle() * 100) / 100;
}

function getRoundAzimutAngle(viewer: ViewerImpl) {
  return Math.round(viewer.controls.getAzimuthalAngle() * 100) / 100;
}

describe("Viewer methods", () => {
  let viewer: ViewerImpl;

  beforeEach(() => {
    viewer = new ViewerImpl({ tile: tileMock } as Props, {} as State);
    const camera = new PerspectiveCamera(45, 1920 / 1080, 0.25, 80);
    viewer.camera = camera;
    const controls = new OrbitControls(camera, document.createElement("div"));
    camera.position.set(2, 0, 0);
    viewer.controls = controls;
    viewer.controls.maxDistance = 10;
    viewer.controls.minDistance = 0;
    viewer.controls.target.set(0, 0, 0);
    viewer.controls.update();
    viewer.renderer = {
      domElement: document.createElement("div"),
      setSize: jest.fn(),
      render: jest.fn()
    } as any;
    viewer.onWindowResize = jest.fn().mockImplementation(viewer.onWindowResize);
  });

  afterEach(() => {
    viewer = null;
  });

  describe("handle zoom out", () => {
    // It could be 0.999998 so I have to round before compare
    it("should zoom out by ~10% of min/max difference (1)", () => {
      expect(getRoundDistance(viewer)).toBe(2);
      viewer.handleZoomOut();
      expect(getRoundDistance(viewer)).toBe(3);
    });

    describe('when it"s already max zoom distance', () => {
      beforeEach(() => {
        viewer.camera.position.set(10, 0, 0);
        viewer.controls.update();
      });

      it("should return true from isMaxDistance", () => {
        expect(viewer.isMaxDistance()).toBe(true);
      });

      it("should not zoom more than max distance", () => {
        expect(getRoundDistance(viewer)).toBe(10);
        viewer.handleZoomOut();
        expect(getRoundDistance(viewer)).toBe(10);
      });
    });
  });

  describe("handle zoom in", () => {
    it("should zoom in by ~10% of min/max difference (1)", () => {
      expect(getRoundDistance(viewer)).toBe(2);
      viewer.handleZoomIn();
      expect(getRoundDistance(viewer)).toBe(1);
    });

    describe('when it"s already min zoom distance', () => {
      beforeEach(() => {
        viewer.camera.position.set(0, 0, 0);
        viewer.controls.update();
      });

      it("should return true from isMinDistance", () => {
        expect(viewer.isMinDistance()).toBe(true);
      });

      it("should not zoom less than min distance", () => {
        expect(getRoundDistance(viewer)).toBe(0);
        viewer.handleZoomIn();
        expect(getRoundDistance(viewer)).toBe(0);
      });
    });
  });

  describe("handle left rotation", () => {
    it("should rotate by ~15 degrees (0.26 rad) left", () => {
      expect(getRoundAzimutAngle(viewer)).toBe(1.57);
      viewer.handleLeftRotation();
      expect(getRoundAzimutAngle(viewer)).toBe(1.31);
    });

    describe('when it"s already min azimut angle', () => {
      beforeEach(() => {
        viewer.controls.minAzimuthAngle = 1.57;
        viewer.controls.update();
      });

      it("should return true from isMinAzimutAngle", () => {
        expect(viewer.isMinAzimutAngle()).toBe(true);
      });

      it("should not rotate left", () => {
        expect(getRoundAzimutAngle(viewer)).toBe(1.57);
        viewer.handleLeftRotation();
        expect(getRoundAzimutAngle(viewer)).toBe(1.57);
      });
    });
  });

  describe("handle right rotation", () => {
    it("should rotate by ~15 degrees (0.26 rad) right", () => {
      expect(getRoundAzimutAngle(viewer)).toBe(1.57);
      viewer.handleRightRotation();
      expect(getRoundAzimutAngle(viewer)).toBe(1.83);
    });

    describe('when it"s already max azimut angle', () => {
      beforeEach(() => {
        viewer.controls.maxAzimuthAngle = 1.57;
        viewer.controls.update();
      });

      it("should return true from isMaxAzimutAngle", () => {
        expect(viewer.isMaxAzimutAngle()).toBe(true);
      });

      it("should not rotate right", () => {
        expect(getRoundAzimutAngle(viewer)).toBe(1.57);
        viewer.handleRightRotation();
        expect(getRoundAzimutAngle(viewer)).toBe(1.57);
      });
    });
  });

  describe("handle top rotation", () => {
    it("should rotate by ~15 degrees (0.26 rad) top", () => {
      expect(getRoundPolarAngle(viewer)).toBe(1.57);
      viewer.handleTopRotation();
      expect(getRoundPolarAngle(viewer)).toBe(1.31);
    });

    describe('when it"s already min azimut angle', () => {
      beforeEach(() => {
        viewer.controls.minPolarAngle = 1.57;
        viewer.controls.update();
      });

      it("should return true from isMinPolarAngel", () => {
        expect(viewer.isMinPolarAngle()).toBe(true);
      });

      it("should not rotate left", () => {
        expect(getRoundPolarAngle(viewer)).toBe(1.57);
        viewer.handleTopRotation();
        expect(getRoundPolarAngle(viewer)).toBe(1.57);
      });
    });
  });

  describe("handle bottom rotation", () => {
    it("should rotate by ~15 degrees (0.26 rad) right", () => {
      expect(getRoundPolarAngle(viewer)).toBe(1.57);
      viewer.handleBottomRotation();
      expect(getRoundPolarAngle(viewer)).toBe(1.83);
    });

    describe('when it"s already max polar angle', () => {
      beforeEach(() => {
        viewer.controls.maxPolarAngle = 1.57;
        viewer.controls.update();
      });

      it("should return true from isMaxPolarAngel", () => {
        expect(viewer.isMaxPolarAngle()).toBe(true);
      });

      it("should not rotate right", () => {
        expect(getRoundPolarAngle(viewer)).toBe(1.57);
        viewer.handleBottomRotation();
        expect(getRoundPolarAngle(viewer)).toBe(1.57);
      });
    });
  });

  describe("is camera position pristine", () => {
    beforeEach(() => {
      viewer.setState = function (state) {
        viewer.state = { ...viewer.state, ...state };
      };
    });

    describe("when cameraPosition is not in state", () => {
      it("should return false", () => {
        expect(viewer.isCameraPositionPristine()).toBe(false);
      });
    });

    describe("when state camera position is equal to current position", () => {
      beforeEach(() => {
        viewer.setState({ cameraPosition: new Vector3(2, 0, 0) });
      });

      it("should return true", () => {
        expect(viewer.isCameraPositionPristine()).toBe(true);
      });
    });

    describe("when state camera position is not equal to current position", () => {
      beforeEach(() => {
        viewer.setState({ cameraPosition: new Vector3(2, 2, 0) });
      });

      it("should return false", () => {
        expect(viewer.isCameraPositionPristine()).toBe(false);
      });
    });
  });

  describe("handle reset rotation", () => {
    it("should reset current camera position to saved in state", () => {
      viewer.setState = function (state) {
        viewer.state = { ...viewer.state, ...state };
      };
      const statePosition = new Vector3(1, 1, 1);
      viewer.setState({ cameraPosition: statePosition });
      viewer.handleResetRotation();
      expect(
        viewer.camera.position.multiplyScalar(100).round().divideScalar(100)
      ).toEqual({
        x: 1,
        y: 1,
        z: 1
      });
    });
  });

  describe("handle tooltip click", () => {
    it("should toggle state by click on tooltip", () => {
      viewer.setState = function (state) {
        if (typeof state === "function") {
          const newState = state(viewer.state, viewer.props);
          viewer.state = { ...viewer.state, ...newState };
        }
      };
      expect(viewer.state.showRotationTooltip).toBe(false);
      viewer.handleTooltipClick();
      expect(viewer.state.showRotationTooltip).toBe(true);
    });
  });

  describe("save camera position", () => {
    beforeEach(() => {
      viewer.setState = function (state) {
        viewer.state = { ...viewer.state, ...state };
      };
    });
    describe("when there is saved position", () => {
      it("shouldn't save new position", () => {
        viewer.camera.position.set(1, 1, 1);
        viewer.saveCameraState();
        viewer.camera.position.set(2, 2, 2);
        viewer.saveCameraState();
        expect(viewer.state.cameraPosition).toEqual({ x: 1, y: 1, z: 1 });
      });
    });
    describe("when there is not saved position yet", () => {
      it("should save position to state", () => {
        viewer.camera.position.set(1, 1, 1);
        viewer.saveCameraState();
        expect(viewer.state.cameraPosition).toEqual({ x: 1, y: 1, z: 1 });
      });
    });
  });

  describe("propsChanged", () => {
    it("returns false", () => {
      const res = viewer.propsChanged({ tile: tileMock } as Props);
      expect(res).toBe(false);
    });

    it("returns true", () => {
      const res = viewer.propsChanged({
        tile: { ...tileMock, code: "mock_code" }
      } as Props);
      expect(res).toBe(true);
    });
  });

  describe("onWidowResize", () => {
    it("calls onWindowResize method", () => {
      viewer.componentDidMount();
      window.dispatchEvent(new Event("resize"));
      expect(viewer.onWindowResize).toHaveBeenCalled();
    });
  });

  describe("renderFrame", () => {
    it("should not call saveCameraState if container or tile doesn't exist", () => {
      viewer.container = null;
      viewer.saveCameraState = jest.fn();

      viewer.renderFrame();
      expect(viewer.saveCameraState).not.toHaveBeenCalled();
    });

    it(" calls saveCameraState if container or tile doesn't exist", () => {
      viewer.container = document.createElement("div");
      viewer.saveCameraState = jest.fn();

      viewer.renderFrame();
      expect(viewer.saveCameraState).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Viewer component", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("disables zoomIn button if isMinDistance returns true", () => {
    jest.spyOn(Viewer.prototype, "isMinDistance").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Zoom in")).toHaveClass("disabled");
  });

  it("disables zoomOut button if isMaxDistance returns true", () => {
    jest.spyOn(Viewer.prototype, "isMaxDistance").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Zoom out")).toHaveClass("disabled");
  });

  it("opens tooltip and disables rotate left button", () => {
    jest.spyOn(Viewer.prototype, "isMinAzimutAngle").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    expect(screen.getByLabelText("Rotate left")).toHaveClass("disabled");
  });

  it("opens tooltip and disables rotate right button", () => {
    jest.spyOn(Viewer.prototype, "isMaxAzimutAngle").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    expect(screen.getByLabelText("Rotate right")).toHaveClass("disabled");
  });

  it("opens tooltip and disables rotate top button", () => {
    jest.spyOn(Viewer.prototype, "isMinPolarAngle").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    expect(screen.getByLabelText("Rotate top")).toHaveClass("disabled");
  });

  it("opens tooltip and disables rotate bottom button", () => {
    jest.spyOn(Viewer.prototype, "isMaxPolarAngle").mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    expect(screen.getByLabelText("Rotate bottom")).toHaveClass("disabled");
  });

  it("resets rotations", () => {
    const resetRotationSpy = jest
      .spyOn(Viewer.prototype, "handleResetRotation")
      .mockImplementation(() => jest.fn());
    jest
      .spyOn(Viewer.prototype, "isCameraPositionPristine")
      .mockReturnValue(true);

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    fireEvent.click(screen.getByLabelText("Reset"));
    expect(resetRotationSpy).toHaveBeenCalled();
  });

  it("opens and closes the tooltip with rotation buttons", async () => {
    jest
      .spyOn(Viewer.prototype, "handleZoomIn")
      .mockImplementation(() => jest.fn());

    render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );
    jest.runAllTimers();

    fireEvent.click(screen.getByLabelText("Open rotation menu"));
    expect(screen.getByLabelText("Rotate top")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Zoom in"));
    jest.runAllTimers();

    expect(screen.queryByLabelText("Rotate top")).not.toBeInTheDocument();
  });

  it("calls loadModel if user changes tile", () => {
    const loadModelSpy = jest.spyOn(ViewerImpl.prototype, "loadModel");

    const { rerender } = render(
      <ViewerImpl
        tile={tileMock}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    rerender(
      <ViewerImpl
        tile={{ ...tileMock, code: "second_tile" }}
        options={{ contentSource: "" }}
        siding={sidingMock}
        setIsLoading={jest.fn()}
      />
    );

    expect(loadModelSpy).toHaveBeenCalledTimes(1);
  });
});
