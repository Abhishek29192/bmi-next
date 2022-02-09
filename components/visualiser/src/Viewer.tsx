import React from "react";
import { PerspectiveCamera, Scene, Texture, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Colour, Siding, Tile } from "./Types";
import styles from "./styles/Viewer.module.scss";

export interface Props {
  tile: Tile;
  colour: Colour;
  options: { contentSource: string };
  siding: Siding;
  setIsLoading: (isLoading: boolean) => void;
}

export interface State {
  isLoading: boolean;
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

  constructor(props: P, state: S) {
    super(props);
    this.state = state;
    this.onWindowResize = this.onWindowResize.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
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
   * props.tile and props.colour.
   *
   * @param props Poperties to check if they have changed
   * @returns true if any have changed, false otherwise
   */
  propsChanged(props: P): boolean {
    return props.tile !== this.props.tile || props.colour !== this.props.colour;
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

  renderFrame() {
    if (!this.container) {
      return;
    }

    const size = this.container.getBoundingClientRect();
    this.camera!.aspect = size.width / size.height;
    this.camera!.updateProjectionMatrix();

    this.renderer!.setSize(size.width, size.height);
    this.renderer!.render(this.scene!, this.camera!);
  }

  render() {
    return (
      <div className={styles["viewer"]}>
        <div
          ref={(r) => {
            this.container = r;
          }}
        />
      </div>
    );
  }
}
