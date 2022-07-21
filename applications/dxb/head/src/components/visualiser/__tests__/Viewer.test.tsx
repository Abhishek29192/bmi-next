import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Viewer, { Props, State } from "../Viewer";

class VieweImpl extends Viewer<Props, State> {
  load() {}
  loadModel(props) {
    return Promise.resolve(props);
  }
}

function getRoundDistance(viewer: VieweImpl) {
  return (
    Math.round(
      viewer.camera.position.distanceTo(viewer.controls.target) * 100
    ) / 100
  );
}

function getRoundPolarAngle(viewer: VieweImpl) {
  return Math.round(viewer.controls.getPolarAngle() * 100) / 100;
}

function getRoundAzimutAngle(viewer: VieweImpl) {
  return Math.round(viewer.controls.getAzimuthalAngle() * 100) / 100;
}

describe("Viewer", () => {
  let viewer: VieweImpl;

  beforeEach(() => {
    viewer = new VieweImpl({} as any, {} as any);
    viewer.renderFrame = jest.fn();
    const camera = new PerspectiveCamera(45, 1920 / 1080, 0.25, 80);
    viewer.camera = camera;
    const controls = new OrbitControls(camera, document.createElement("div"));
    camera.position.set(2, 0, 0);
    viewer.controls = controls;
    viewer.controls.maxDistance = 10;
    viewer.controls.minDistance = 0;
    viewer.controls.target.set(0, 0, 0);
    viewer.controls.update();
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
});
