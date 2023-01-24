import {
  BMI,
  Button,
  Card,
  CardActions,
  CardContent,
  ContainerDialog,
  Grid,
  Logo,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  TileColour,
  ToggleCard,
  Typography
} from "@bmi-digital/components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import SvgIcon from "@mui/material/SvgIcon";
import classnames from "classnames";
import React, {
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { microCopy } from "./constants/microCopy";
import getRef from "./GetRef";
import { useMicroCopy } from "./helpers/useMicroCopy";
import HouseViewerOld from "./HouseViewerOld";
import {
  classes,
  StyledActions,
  StyledContainerDialog,
  StyledShareButton,
  StyledSharePopover
} from "./styles/VisualiserStylesOld";
import TileViewer from "./TileViewerOld";
import { Colour, Material, Siding, Tile } from "./Types";

const MATERIAL_NAME_MAP: {
  [material in Material]: string;
} = {
  "1": microCopy.materials.clay,
  "2": microCopy.materials.concrete,
  "3": microCopy.materials.metal
};

export type Parameters = {
  tileId?: number | string;
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
  const { getMicroCopy } = useMicroCopy();

  return (
    <StyledActions>
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
        {getMicroCopy(microCopy.actions.selectProduct)}
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
        {getMicroCopy(microCopy.actions.wallColor)}
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
          {getMicroCopy(microCopy.actions.roofMode)}
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
          {getMicroCopy(microCopy.actions.tileMode)}
        </Button>
      )}
    </StyledActions>
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
    <div>
      <Typography variant="h5" component="h3" className={classes.groupTitle}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {products.map(({ colour, id, name }) => (
          <Grid key={`${id}-${colour.id}`} xs={6} md={4} lg={2}>
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
                  classes.activeSelectionOption
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
      className={classnames(classes.root, classes.secondary)}
      containerClassName={classes.container}
      backdropProps={{ invisible: true }}
      allowOverflow
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        className={classes.groupTitle}
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
      className={classnames(classes.root, classes.secondary)}
      containerClassName={classes.container}
      backdropProps={{ invisible: true }}
      allowOverflow
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        className={classes.groupTitle}
      >
        {getMicroCopy(microCopy.sidingsSelector.title)}
      </Typography>
      <Grid container spacing={2}>
        {sidings.map(({ id, name, diffuseMapRef }) => (
          <Grid key={id} xs={6} md={4} lg={2}>
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
                activeSiding.id === id && classes.activeSelectionOption
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

const SharePopover = ({ shareWidget }: { shareWidget: ReactNode }) => {
  const shareAnchor = useRef<HTMLDivElement | null>(null);
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
    null
  );
  const { getMicroCopy } = useMicroCopy();

  const handlePopoverClick = () => {
    setAnchorElement(shareAnchor.current);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  return (
    <StyledSharePopover ref={shareAnchor}>
      <StyledShareButton
        isIconButton
        variant="text"
        accessibilityLabel={getMicroCopy(
          microCopy.sharePopover.accessibilityLabel
        )}
        aria-describedby="share-popover"
        onClick={handlePopoverClick}
      >
        <ShareIcon />
      </StyledShareButton>
      <Popover
        id="share-popover"
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
    </StyledSharePopover>
  );
};

const viewerComponentMap = {
  tile: TileViewer,
  roof: HouseViewerOld
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
  onClick
}: Props) => {
  const [isTileSelectorOpen, setIsTileSelectorOpen] = useState<boolean>(false);
  const [isSidingsSelectorOpen, setIsSidingsSelectorOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const Viewer = viewerComponentMap[state.viewMode || "tile"];

  return (
    <StyledContainerDialog
      open={open}
      onCloseClick={handleOnClose}
      onBackdropClick={handleOnClose}
      maxWidth="xl"
      className={classes.root}
      containerClassName={classes.content}
    >
      {shareWidget && (
        <ContainerDialog.Header className={classes.header}>
          <SharePopover shareWidget={shareWidget} />
        </ContainerDialog.Header>
      )}
      <div className={classnames(classes.container, classes.viewer)}>
        {isLoading && (
          <div className={classes.progressContainer}>
            <CircularProgress />
          </div>
        )}
        <div className={classes.details}>
          <Grid container>
            <Grid xs={10} sm={6} md={5} lg={4}>
              <Card square={true}>
                <CardContent>
                  <Logo
                    source={BMI}
                    width="60"
                    height="60"
                    className={classes.detailsLogo}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    className={classes.detailsTitle}
                  >
                    {activeTile.name}
                  </Typography>
                  <Typography>{activeColour.name}</Typography>
                </CardContent>
                {activeColour.variantCode && (
                  <CardActions>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        handleOnClick({
                          type: "product-link",
                          label: getMicroCopy(microCopy.readMore),
                          data: {
                            variantCode: activeColour.variantCode,
                            productPath: activeColour.path
                          }
                        });
                        handleOnClose();
                      }}
                    >
                      {getMicroCopy(microCopy.readMore)}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          </Grid>
        </div>
        {viewMode && (
          <Viewer
            tile={activeTile}
            colour={activeColour}
            options={{ contentSource }}
            siding={activeSiding}
            setIsLoading={(isLoading: boolean) => setIsLoading(isLoading)}
          />
        )}
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
        <Actions
          toggleTileSelector={setIsTileSelectorOpen}
          toggleSidingsSelector={setIsSidingsSelectorOpen}
          viewMode={state.viewMode}
          setViewMode={setState}
          onButtonClick={handleOnClick}
        />
      </div>
    </StyledContainerDialog>
  );
};

export default Visualiser;
