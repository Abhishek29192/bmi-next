import Add from "@bmi-digital/components/icon/Add";
import ArrowBack from "@bmi-digital/components/icon/ArrowBack";
import ArrowDownward from "@bmi-digital/components/icon/ArrowDownward";
import ArrowForward from "@bmi-digital/components/icon/ArrowForward";
import ArrowUpward from "@bmi-digital/components/icon/ArrowUpward";
import Home from "@bmi-digital/components/icon/Home";
import Remove from "@bmi-digital/components/icon/Remove";
import ThreeDRotation from "@bmi-digital/components/icon/ThreeDRotation";
import Tooltip from "@bmi-digital/components/tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import clamp from "lodash-es/clamp";
import React from "react";
import {
  PerspectiveCamera,
  Scene,
  Texture,
  Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { rotationAngleInRad } from "../constants/visualiser";

import { PIMTile, Siding } from "../Types";
import {
  Canvas,
  Controls,
  ControlsGroup,
  Icon3d,
  Root,
  RotateBottom,
  RotateContainer,
  RotateLeft,
  RotateReset,
  RotateRight,
  RotateTop,
  StyledIcon,
  classes
} from "./styles";

export interface Props {
  tile: PIMTile;
  options: { contentSource: string };
  siding: Siding;
  setIsLoading: (isLoading: boolean) => void;
}

export interface State {
  isLoading: boolean;
  showRotationTooltip?: boolean;
  cameraPosition?: Vector3;
  tileCode?: string;
}

export default abstract class Viewer<
  P extends Props,
  S extends State
> extends React.Component<P, S> {
  scene?: Scene;
  camera?: PerspectiveCamera;
  container?: HTMLDivElement | null;
  renderer?: WebGLRenderer;
  controls?: OrbitControls;
  diffuseImage?: Texture;
  metalicImage?: Texture;
  normalImage?: Texture;
  tooltipContentRef?: React.RefObject<HTMLDivElement>;

  constructor(props: P, state: S) {
    super(props);
    this.state = {
      ...state,
      showRotationTooltip: false
    };
    this.tooltipContentRef = React.createRef();
    this.onWindowResize = this.onWindowResize.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.handleLeftRotation = this.handleLeftRotation.bind(this);
    this.handleRightRotation = this.handleRightRotation.bind(this);
    this.handleTopRotation = this.handleTopRotation.bind(this);
    this.handleBottomRotation = this.handleBottomRotation.bind(this);
    this.handleResetRotation = this.handleResetRotation.bind(this);
    this.handleTooltipClick = this.handleTooltipClick.bind(this);
    this.handleTooltipClose = this.handleTooltipClose.bind(this);
    this.computeCameraPosition = this.computeCameraPosition.bind(this);
    this.saveCameraState = this.saveCameraState.bind(this);
  }

  /**
   * Loads and renders the scene
   */
  abstract load(): void;

  /**
   * Loads the model into the scene
   * @param props properties to use for the model
   */
  abstract loadModel(props: P): Promise<void>;

  /**
   * Check if any property values have changed. By default, this checks for
   * props.tile.
   *
   * @param props Poperties to check if they have changed
   * @returns true if any have changed, false otherwise
   */
  propsChanged(props: P): boolean {
    return props.tile.code !== this.props.tile.code;
  }

  UNSAFE_componentWillReceiveProps(props: P) {
    if (this.propsChanged(props)) {
      this.setIsLoading(true);
      this.loadModel(props);
    }
  }

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.domElement?.parentNode?.removeChild(
        this.renderer.domElement
      );
    }
    window.removeEventListener("resize", this.onWindowResize);
  }

  componentDidMount() {
    this.setIsLoading(true);
    this.load();
    window.addEventListener("resize", this.onWindowResize, false);
  }

  onWindowResize() {
    this.renderFrame();
  }

  setIsLoading(isLoading: boolean) {
    if (this.props.setIsLoading) {
      this.props.setIsLoading(isLoading);
    }
    this.setState({ isLoading });
  }

  isMaxDistance() {
    return this.getRoundDistance() >= this.controls?.maxDistance;
  }

  isMinDistance() {
    return this.getRoundDistance() <= this.controls?.minDistance;
  }

  isMaxPolarAngle() {
    return this.getRoundPolarAngle() >= this.controls?.maxPolarAngle;
  }

  isMinPolarAngle() {
    return this.getRoundPolarAngle() <= this.controls?.minPolarAngle;
  }

  isMaxAzimutAngle() {
    return this.getRoundAzimutAngle() >= this.controls?.maxAzimuthAngle;
  }

  isMinAzimutAngle() {
    return this.getRoundAzimutAngle() <= this.controls?.minAzimuthAngle;
  }

  saveCameraState() {
    if (!this.camera || this.state.cameraPosition) {
      return;
    }

    const cameraPosition = this.camera.position.clone();

    this.setState({
      cameraPosition
    });
  }

  isCameraPositionPristine() {
    if (!this.state.cameraPosition || !this.camera) {
      return false;
    }
    const currentPosition = this.camera.position
      .multiplyScalar(100)
      .round()
      .divideScalar(100);
    const pristinePosition = this.state.cameraPosition
      .multiplyScalar(100)
      .round()
      .divideScalar(100);
    return currentPosition.equals(pristinePosition);
  }

  renderFrame() {
    if (!this.container) {
      return;
    }

    this.saveCameraState();

    const size = this.container.getBoundingClientRect();
    this.camera!.aspect = size.width / size.height;
    this.camera!.updateProjectionMatrix();

    this.renderer!.setSize(size.width, size.height);
    this.renderer!.render(this.scene!, this.camera!);

    this.forceUpdate();
  }

  getRoundDistance() {
    return (
      Math.round(
        this.camera?.position.distanceTo(this.controls?.target) * 100
      ) / 100
    );
  }

  getRoundPolarAngle() {
    return Math.round(this.controls?.getPolarAngle() * 100) / 100;
  }

  getRoundAzimutAngle() {
    return Math.round(this.controls?.getAzimuthalAngle() * 100) / 100;
  }

  computeCameraPosition({
    distanceOffset = 0,
    azimutOffset = 0,
    polarOffset = 0
  }: {
    distanceOffset?: number;
    azimutOffset?: number;
    polarOffset?: number;
  }) {
    const polar = clamp(
      this.controls.getPolarAngle() + polarOffset,
      this.controls.minPolarAngle,
      this.controls.maxPolarAngle
    );
    const azimut = clamp(
      this.controls.getAzimuthalAngle() + azimutOffset,
      this.controls.minAzimuthAngle,
      this.controls.maxAzimuthAngle
    );
    const distance = clamp(
      this.getRoundDistance() + distanceOffset,
      this.controls.minDistance,
      this.controls.maxDistance
    );

    const z = distance * Math.sin(polar) * Math.cos(azimut);
    const x = distance * Math.sin(polar) * Math.sin(azimut);
    const y = distance * Math.cos(polar);

    return new Vector3(x, y, z).add(this.controls.target);
  }

  handleTooltipClick() {
    this.setState((prevState) => ({
      showRotationTooltip: !prevState.showRotationTooltip
    }));
  }

  handleTooltipClose(event) {
    if (!this.tooltipContentRef.current?.contains(event.target)) {
      this.setState({ showRotationTooltip: false });
    }
  }

  handleZoomIn() {
    const distanceOffset =
      ((this.controls.maxDistance - this.controls.minDistance) / 10) * -1;
    const position = this.computeCameraPosition({
      distanceOffset
    });
    this.camera.position.copy(position);
    this.controls?.update();
  }

  handleZoomOut() {
    const distanceOffset =
      (this.controls.maxDistance - this.controls.minDistance) / 10;
    const position = this.computeCameraPosition({ distanceOffset });
    this.camera.position.copy(position);
    this.controls?.update();
  }

  handleLeftRotation() {
    const position = this.computeCameraPosition({
      azimutOffset: -rotationAngleInRad
    });
    this.camera.position.copy(position);
    this.controls.update();
  }

  handleRightRotation() {
    const position = this.computeCameraPosition({
      azimutOffset: rotationAngleInRad
    });
    this.camera.position.copy(position);
    this.controls.update();
  }

  handleTopRotation() {
    const position = this.computeCameraPosition({
      polarOffset: -rotationAngleInRad
    });
    this.camera.position.copy(position);
    this.controls.update();
  }

  handleBottomRotation() {
    const position = this.computeCameraPosition({
      polarOffset: rotationAngleInRad
    });
    this.camera.position.copy(position);
    this.controls.update();
  }

  handleResetRotation() {
    this.camera?.position.copy(this.state.cameraPosition);
    this.controls.update();
  }

  render() {
    return (
      <Root>
        <Canvas
          ref={(r) => {
            this.container = r;
          }}
        />
        <Controls>
          <ControlsGroup>
            <StyledIcon
              source={Add}
              viewBox="4 4 16 16"
              onClick={this.handleZoomIn}
              className={
                this.isMinDistance() ? classes.disabledIcon : undefined
              }
              role="button"
              aria-label="Zoom in"
            />
            <StyledIcon
              source={Remove}
              viewBox="4 4 16 16"
              onClick={this.handleZoomOut}
              className={
                this.isMaxDistance() ? classes.disabledIcon : undefined
              }
              role="button"
              aria-label="Zoom out"
            />
          </ControlsGroup>
          <ControlsGroup>
            <ClickAwayListener onClickAway={this.handleTooltipClose}>
              <Tooltip
                PopperProps={{
                  disablePortal: true
                }}
                title={
                  <RotateContainer ref={this.tooltipContentRef}>
                    <RotateLeft
                      role="button"
                      aria-label="Rotate left"
                      source={ArrowBack}
                      className={`${
                        this.isMinAzimutAngle() ? classes.disabledIcon : ""
                      }`}
                      onClick={this.handleLeftRotation}
                    />
                    <RotateRight
                      role="button"
                      aria-label="Rotate right"
                      source={ArrowForward}
                      className={`${
                        this.isMaxAzimutAngle() ? classes.disabledIcon : ""
                      }`}
                      onClick={this.handleRightRotation}
                    />
                    <RotateTop
                      role="button"
                      aria-label="Rotate top"
                      source={ArrowUpward}
                      className={` ${
                        this.isMinPolarAngle() ? classes.disabledIcon : ""
                      }`}
                      onClick={this.handleTopRotation}
                    />
                    <RotateBottom
                      role="button"
                      aria-label="Rotate bottom"
                      source={ArrowDownward}
                      className={` ${
                        this.isMaxPolarAngle() ? classes.disabledIcon : ""
                      }`}
                      onClick={this.handleBottomRotation}
                    />
                    <RotateReset
                      role="button"
                      aria-label="Reset"
                      source={Home}
                      className={`${
                        this.isCameraPositionPristine()
                          ? classes.disabledIcon
                          : ""
                      }`}
                      onClick={this.handleResetRotation}
                    />
                  </RotateContainer>
                }
                open={this.state.showRotationTooltip}
                placement="left-end"
              >
                <Icon3d
                  role="button"
                  aria-label="Open rotation menu"
                  source={ThreeDRotation}
                  viewBox="-4 -4 32 32"
                  onClick={this.handleTooltipClick}
                  className={`${
                    this.state.showRotationTooltip ? classes.iconIsSelected : ""
                  }`}
                />
              </Tooltip>
            </ClickAwayListener>
          </ControlsGroup>
        </Controls>
      </Root>
    );
  }
}
