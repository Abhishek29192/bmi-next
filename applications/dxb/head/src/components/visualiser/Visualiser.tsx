import {
  BMI,
  Button,
  ContainerDialog,
  Grid,
  Logo,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  TileColour,
  ToggleCard,
  Typography
} from "@bmi/components";
import { useMediaQuery } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Popover from "@material-ui/core/Popover";
import SvgIcon from "@material-ui/core/SvgIcon";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShareIcon from "@material-ui/icons/Share";
import classnames from "classnames";
import React, {
  Dispatch,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { microCopy } from "./constants/microCopy";
import getRef from "./GetRef";
import { useMicroCopy } from "./helpers/useMicroCopy";
import HouseViewer from "./HouseViewer";
import HouseViewerOld from "./HouseViewerOld";
import styles from "./styles/Visualiser.module.scss";
import TileViewer from "./TileViewer";
import { Colour, HouseType, Material, Siding, Tile } from "./Types";

const MATERIAL_NAME_MAP: {
  [material in Material]: string;
} = {
  "1": microCopy.materials.material1,
  "2": microCopy.materials.material2,
  "3": microCopy.materials.material3
};

export type Parameters = {
  tileId?: number;
  colourId?: number;
  sidingId?: number;
  viewMode?: "tile" | "roof";
  tiles: Tile[];
  sidings: Siding[];
};

type Props = {
  contentSource: string;
  open: boolean;
  onClose: () => any;
  onChange?: (params: Partial<Parameters & { isOpen: boolean }>) => void;
  shareWidget?: React.ReactNode;
  houseTypes: HouseType[] | null;
  onClick: (
    params: Partial<Parameters> & {
      type: string;
      label: string;
      data?: Record<string, any>;
    }
  ) => void;
} & Parameters;

type TileProps = Omit<Tile, "colours"> & { colour: Colour };

type TileSectorDialogProps = {
  activeTile: Tile;
  activeColour: Colour;
  contentSource: string;
  open: boolean;
  onCloseClick: (isTileSelectorOpen: boolean) => void;
  onButtonClick: (data: {
    tileId: number;
    colourId: number;
    label: string;
  }) => void;
  tiles: Tile[];
};

const Actions = ({
  toggleTileSelector,
  toggleSidingsSelector,
  setViewMode,
  viewMode,
  onButtonClick
}: {
  toggleTileSelector: Dispatch<(previousTileSelectorOpen: boolean) => boolean>;
  toggleSidingsSelector: Dispatch<
    (previousSidingsSelectorOpen: boolean) => boolean
  >;
  setViewMode: (data: { viewMode: Props["viewMode"] }) => void;
  viewMode: Props["viewMode"];
  onButtonClick: (data: { type: string; label: string }) => void;
}) => {
  const isXsMobile = useMediaQuery("(max-width: 376px)");
  const { getMicroCopy } = useMicroCopy();
  return (
    <nav className={styles["actions"]}>
      <Button
        hasDarkBackground
        variant="text"
        startIcon={<SvgIcon component={TileColour} />}
        onClick={() => {
          toggleTileSelector(
            (previousTileSelectorOpen: boolean) => !previousTileSelectorOpen
          );
          onButtonClick({
            type: "bottom-menu",
            label: getMicroCopy(microCopy.actions.selectProduct)
          });
        }}
      >
        {!isXsMobile && getMicroCopy(microCopy.actions.selectProduct)}
      </Button>
      <Button
        hasDarkBackground
        variant="text"
        startIcon={<SvgIcon component={SelectWallColour} />}
        disabled={viewMode !== "roof"}
        onClick={() => {
          toggleSidingsSelector(
            (previousSidingsSelectorOpen: boolean) =>
              !previousSidingsSelectorOpen
          );
          onButtonClick({
            type: "bottom-menu",
            label: getMicroCopy(microCopy.actions.wallColor)
          });
        }}
      >
        {!isXsMobile && getMicroCopy(microCopy.actions.wallColor)}
      </Button>
      {viewMode === "tile" && (
        <Button
          hasDarkBackground
          variant="text"
          startIcon={<SvgIcon component={SelectRoof} />}
          onClick={() => {
            setViewMode({ viewMode: "roof" });
            onButtonClick({
              type: "bottom-menu",
              label: getMicroCopy(microCopy.actions.roofMode)
            });
          }}
        >
          {!isXsMobile && getMicroCopy(microCopy.actions.roofMode)}
        </Button>
      )}
      {viewMode === "roof" && (
        <Button
          hasDarkBackground
          variant="text"
          startIcon={<SvgIcon component={SelectTile} />}
          onClick={() => {
            setViewMode({ viewMode: "tile" });
            onButtonClick({
              type: "bottom-menu",
              label: getMicroCopy(microCopy.actions.tileMode)
            });
          }}
        >
          {!isXsMobile && getMicroCopy(microCopy.actions.tileMode)}
        </Button>
      )}
    </nav>
  );
};

const SelectionOptions = ({
  contentSource,
  defaultValue,
  products,
  title,
  onClick
}: {
  contentSource: string;
  defaultValue: string;
  products: TileProps[];
  title: string;
  onClick: (data: { tileId: number; colourId: number; label: string }) => any;
}) => {
  const { getMicroCopy } = useMicroCopy();

  return (
    <div className={styles["select-options"]}>
      <Typography variant="h5" component="h3" className={styles["group-title"]}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {products.map(({ colour, id, name }) => (
          <Grid key={`${id}-${colour.id}`} item xs={6} md={4} lg={2}>
            <ToggleCard
              component="button"
              title={name}
              imageSource={getRef(colour.previewRef, {
                size: "128",
                contentSource
              })}
              onClick={() =>
                onClick({
                  tileId: id,
                  colourId: colour.id,
                  label: `${name} + ${colour.name}`
                })
              }
              className={classnames(
                defaultValue === `${id}-${colour.id}` &&
                  styles["active-selection-option"]
              )}
              aria-label={
                defaultValue === `${id}-${colour.id}`
                  ? getMicroCopy(microCopy.selectionOptions.default)
                  : undefined
              }
            >
              <ToggleCard.Paragraph>{colour.name}</ToggleCard.Paragraph>
            </ToggleCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const TileSectorDialog = ({
  activeTile,
  activeColour,
  contentSource,
  open,
  onCloseClick,
  onButtonClick,
  tiles
}: TileSectorDialogProps) => {
  const { getMicroCopy } = useMicroCopy();
  const productProps = useMemo(
    () =>
      tiles.flatMap(({ colours, ...rest }) =>
        colours.map((colour) => ({ ...rest, colour }))
      ),
    [tiles]
  );

  const productPropsGroupedByMaterial = productProps.reduce<{
    [key: string]: any[];
  }>((grouped, props) => {
    // eslint-disable-next-line react/prop-types
    (grouped[props["material"]] || (grouped[props["material"]] = [])).push(
      props
    );
    return grouped;
  }, {});

  const defaultTileIdentifier = `${activeTile.id}-${activeColour.id}`;

  return (
    <ContainerDialog
      open={open}
      onCloseClick={() => onCloseClick(false)}
      onBackdropClick={() => onCloseClick(false)}
      maxWidth="xl"
      color="pearl"
      className={classnames(
        styles["Visualiser"],
        styles["Visualiser--secondary"]
      )}
      containerClassName={styles["container"]}
      backdropProps={{ invisible: true }}
      allowOverflow
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        className={styles["group-title"]}
      >
        {getMicroCopy(microCopy.titleSelector.title)}
      </Typography>
      <Typography gutterBottom>
        {getMicroCopy(microCopy.titleSelector.description)}
      </Typography>

      {Object.keys(productPropsGroupedByMaterial).map((key) => (
        <SelectionOptions
          contentSource={contentSource}
          defaultValue={defaultTileIdentifier}
          key={`material-group-${key}`}
          title={getMicroCopy(MATERIAL_NAME_MAP[key as Material])}
          // eslint-disable-next-line security/detect-object-injection
          products={productPropsGroupedByMaterial[key]}
          onClick={onButtonClick}
        />
      ))}
    </ContainerDialog>
  );
};

const SidingsSelectorDialog = ({
  open,
  onCloseClick,
  activeSiding,
  sidings,
  contentSource,
  onConfirmClick,
  onClick
}: {
  open: boolean;
  onCloseClick: (isSidingsSelectorOpen: boolean) => void;
  activeSiding: Siding;
  sidings: Siding[];
  contentSource: string;
  onConfirmClick: (data: { sidingId: number }) => void;
  onClick: (event: { type: string; label: string }) => void;
}) => {
  const { getMicroCopy } = useMicroCopy();
  return (
    <ContainerDialog
      open={open}
      onCloseClick={() => onCloseClick(false)}
      onBackdropClick={() => onCloseClick(false)}
      maxWidth="xl"
      color="pearl"
      className={classnames(
        styles["Visualiser"],
        styles["Visualiser--secondary"]
      )}
      containerClassName={styles["container"]}
      backdropProps={{ invisible: true }}
      allowOverflow
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        className={styles["group-title"]}
      >
        {getMicroCopy(microCopy.sidingsSelector.title)}
      </Typography>
      <Grid container spacing={2}>
        {sidings.map(({ id, name, diffuseMapRef }) => (
          <Grid key={id} item xs={6} md={4} lg={2}>
            <ToggleCard
              component="button"
              title={name}
              imageSource={getRef(diffuseMapRef, {
                size: "original",
                contentSource
              })}
              onClick={() => {
                onConfirmClick({ sidingId: id });
                onCloseClick(false);
                onClick({
                  type: "wall-selector",
                  label: name
                });
              }}
              className={classnames(
                activeSiding.id === id && styles["active-selection-option"]
              )}
              aria-label={
                activeSiding.id === id
                  ? getMicroCopy(microCopy.selectionOptions.default)
                  : undefined
              }
            />
          </Grid>
        ))}
      </Grid>
    </ContainerDialog>
  );
};

const SharePopover = ({
  shareWidget,
  anchorRef
}: {
  shareWidget: ReactNode;
  anchorRef: RefObject<HTMLDivElement>;
}) => {
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
    null
  );
  const { getMicroCopy } = useMicroCopy();

  const handlePopoverClick = () => {
    setAnchorElement(anchorRef.current);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Button
        className={styles["share-button"]}
        variant="outlined"
        accessibilityLabel={getMicroCopy(
          microCopy.sharePopover.accessibilityLabel
        )}
        aria-describedby="share-popover"
        onClick={handlePopoverClick}
      >
        <ShareIcon />
      </Button>
      <Popover
        id="share-popover"
        className={styles["Visualiser-popover"]}
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{ square: true, elevation: 1 }}
      >
        {shareWidget}
      </Popover>
    </>
  );
};

const viewerComponentMap = {
  tile: TileViewer,
  roof:
    process.env.GATSBY_ENABLE_V2_WEBTOOLS_VISUALISATOR === "true"
      ? HouseViewer
      : HouseViewerOld
};

const Visualiser = ({
  contentSource,
  open,
  tileId,
  colourId,
  sidingId,
  viewMode,
  tiles,
  sidings,
  shareWidget,
  onClose,
  onChange,
  onClick,
  houseTypes
}: Props) => {
  const [isTileSelectorOpen, setIsTileSelectorOpen] = useState<boolean>(false);
  const [isSidingsSelectorOpen, setIsSidingsSelectorOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const header = useRef<HTMLDivElement>(null);
  const shareAnchor = useRef<HTMLDivElement>(null);
  const [state, _setState] = useState({ tileId, colourId, sidingId, viewMode });
  const { getMicroCopy } = useMicroCopy();

  const stateRef = React.useRef(state);
  const setState = useCallback(
    (data) => {
      stateRef.current = { ...state, ...data };
      _setState((previousState) => {
        return { ...previousState, ...data };
      });
    },
    [state]
  );

  useEffect(() => {
    setState({ tileId, colourId, sidingId, viewMode });
  }, [tileId, colourId, sidingId, viewMode]);

  useEffect(() => {
    if (onChange) {
      const { tileId, colourId, sidingId, viewMode } = state;

      onChange({
        colourId,
        sidingId,
        tileId,
        viewMode,
        isOpen: open
      });
    }
  }, [state, open]);

  const handleOnClose = () => {
    onClose();
  };

  const handleOnClick = useCallback(
    ({ type, label, data }) => {
      const { tileId, colourId, sidingId, viewMode } = stateRef.current;

      onClick({
        colourId,
        sidingId,
        tileId,
        viewMode,
        type,
        label,
        data
      });
    },
    [stateRef]
  );

  const activeTile = useMemo(() => {
    return (
      tiles.find(({ id }) => id === state.tileId) ||
      tiles.find(({ id }) => id === tileId) ||
      tiles[0]
    );
  }, [tiles, state.tileId, tileId]);

  const activeColour = useMemo(() => {
    return (
      activeTile.colours.find(({ id }) => id === state.colourId) ||
      activeTile.colours[0]
    );
  }, [activeTile, state.colourId]);

  const activeSiding = useMemo(
    () =>
      sidings.find(({ id }) => id === state.sidingId) ||
      sidings.find(({ id }) => id === sidingId) ||
      sidings[0],
    [sidings, sidingId, state.sidingId]
  );

  const viewerProps = {
    tile: activeTile,
    colour: activeColour,
    options: { contentSource },
    siding: activeSiding,
    setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    ...(state.viewMode === "roof"
      ? { houseModelUrl: houseTypes?.[0]?.houseModel.url }
      : {})
  };

  const Viewer = viewerComponentMap[state.viewMode || "tile"];

  return (
    <ContainerDialog
      open={open}
      onCloseClick={handleOnClose}
      onBackdropClick={handleOnClose}
      maxWidth="xl"
      className={styles["Visualiser"]}
      containerClassName={styles["content"]}
    >
      <ContainerDialog.Header ref={header}>
        <Typography
          component="h2"
          variant="h3"
          className={styles["content-title"]}
        >
          RoofTile Visualiser
        </Typography>
      </ContainerDialog.Header>
      <div
        className={classnames(styles["container"], styles["container--viewer"])}
      >
        {isLoading && (
          <div className={styles["progress-container"]}>
            <CircularProgress />
          </div>
        )}
        <div className={styles["details"]}>
          <Logo
            source={BMI}
            width="60"
            height="60"
            className={styles["details-logo"]}
          />
          <div className={styles["deatils-labels"]}>
            <Typography
              variant="h5"
              component="h3"
              className={styles["details-title"]}
            >
              {activeTile.name}
            </Typography>
            <Typography>{activeColour.name}</Typography>
          </div>
          <div className={styles["details-actions"]} ref={shareAnchor}>
            {activeColour.variantCode && (
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  handleOnClick({
                    type: "product-link",
                    label: getMicroCopy(microCopy.readMore),
                    data: { variantCode: activeColour.variantCode }
                  });
                  handleOnClose();
                }}
              >
                <span className={styles["details-text"]}>
                  {getMicroCopy(microCopy.readMore)}
                </span>
              </Button>
            )}
            {shareWidget && (
              <SharePopover shareWidget={shareWidget} anchorRef={shareAnchor} />
            )}
          </div>
        </div>
        {viewMode && <Viewer {...viewerProps} />}
        <TileSectorDialog
          open={isTileSelectorOpen}
          onCloseClick={setIsTileSelectorOpen}
          activeTile={activeTile}
          activeColour={activeColour}
          tiles={tiles}
          contentSource={contentSource}
          onButtonClick={({ tileId, colourId, label }) => {
            setIsTileSelectorOpen(false);
            setState({ tileId, colourId });
            handleOnClick({ type: "product-selector", label });
          }}
        />
        <SidingsSelectorDialog
          open={isSidingsSelectorOpen}
          onCloseClick={setIsSidingsSelectorOpen}
          activeSiding={activeSiding}
          sidings={sidings}
          onConfirmClick={setState}
          contentSource={contentSource}
          onClick={handleOnClick}
        />
      </div>
      <Actions
        toggleTileSelector={setIsTileSelectorOpen}
        toggleSidingsSelector={setIsSidingsSelectorOpen}
        viewMode={state.viewMode}
        setViewMode={setState}
        onButtonClick={handleOnClick}
      />
    </ContainerDialog>
  );
};

export default Visualiser;
