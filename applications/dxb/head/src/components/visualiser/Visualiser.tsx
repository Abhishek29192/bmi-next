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
} from "@bmi-digital/components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShareIcon from "@mui/icons-material/Share";
import { useMediaQuery } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
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
import { useConfig } from "../../contexts/ConfigProvider";
import { devLog } from "../../utils/devLog";
import { queryElasticSearch } from "../../utils/elasticSearch";
import { microCopy } from "./constants/microCopy";
import getRef from "./GetRef";
import { getProductsQuery } from "./helpers/esQuery";
import { prepareProducts } from "./helpers/products";
import { useMicroCopy } from "./helpers/useMicroCopy";
import HouseViewer from "./HouseViewer";
import {
  classes,
  StyledActions,
  StyledContainerDialog,
  StyledShareButton,
  StyledSharePopover
} from "./styles/VisualiserStyles";
import TileViewer from "./TileViewer";
import { Category, HouseType, PIMTile, Siding } from "./Types";

export type Parameters = {
  tileId?: string | number;
  colourId?: number;
  sidingId?: number;
  viewMode?: "tile" | "roof";
  sidings: Siding[];
};

export type Props = {
  contentSource: string;
  open: boolean;
  onClose: () => void;
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

type TileSectorDialogProps = {
  activeTile: PIMTile;
  contentSource: string;
  open: boolean;
  onCloseClick: (isTileSelectorOpen: boolean) => void;
  onButtonClick: (data: { tileId: string; label: string }) => void;
  tiles: PIMTile[];
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
    </StyledActions>
  );
};

const SelectionOptions = ({
  defaultValue,
  products,
  title,
  onClick
}: {
  contentSource: string;
  defaultValue: string;
  products: PIMTile[];
  title: string;
  onClick: (data: { tileId: string; label: string }) => void;
}) => {
  const { getMicroCopy } = useMicroCopy();

  return (
    <div>
      <Typography variant="h5" component="h3" className={classes.groupTitle}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {products.map((tile) => (
          <Grid key={tile.code} xs={6} md={4} lg={2}>
            <ToggleCard
              component="button"
              title={tile.name}
              imageSource={tile.mainImage}
              onClick={() => {
                onClick({
                  tileId: tile.code,
                  label: `${tile.name} + ${tile.colour}`
                });
              }}
              className={classnames(
                defaultValue === tile.code && classes.activeSelectionOption
              )}
              aria-label={
                defaultValue === tile.code
                  ? getMicroCopy(microCopy.selectionOptions.default)
                  : undefined
              }
            >
              <ToggleCard.Paragraph>{tile.colour}</ToggleCard.Paragraph>
            </ToggleCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const TileSectorDialog = ({
  activeTile,
  contentSource,
  open,
  onCloseClick,
  onButtonClick,
  tiles
}: TileSectorDialogProps) => {
  const { getMicroCopy } = useMicroCopy();

  const categories = Object.values(Category);

  return (
    <StyledTileSectorDialog
      open={open}
      onCloseClick={() => onCloseClick(false)}
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

      {categories.map((category) => {
        const products = tiles.filter((tile) => tile.category === category);

        if (!products.length) {
          return;
        }

        return (
          <SelectionOptions
            contentSource={contentSource}
            defaultValue={activeTile.code}
            key={`material-group-${category}`}
            //eslint-disable-next-line security/detect-object-injection
            title={getMicroCopy(microCopy.materials[category])}
            products={products}
            onClick={onButtonClick}
          />
        );
      })}
    </StyledTileSectorDialog>
  );
};

export const StyledTileSectorDialog = styled(ContainerDialog)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  [`& .VisualiserV2.secondary`]: {
    backgroundColor: "red",
    boxShadow: "none"
  }
}));

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
  const shareAnchor = useRef<HTMLDivElement>(null);
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
  roof: HouseViewer
};

const Visualiser = ({
  contentSource,
  open,
  tileId,
  sidingId,
  viewMode,
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
  const {
    config: { esIndexNameProduct }
  } = useConfig();
  const [state, _setState] = useState({ tileId, sidingId, viewMode });
  const [tiles, setTiles] = useState<PIMTile[]>([]);
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

  const fetchVisualiserData = async () => {
    setIsLoading(true);
    try {
      const res = await queryElasticSearch(
        getProductsQuery(),
        esIndexNameProduct
      );
      const hits = res.hits.hits.map((hit) => hit._source);
      setTiles(prepareProducts(hits));
    } catch (err) {
      devLog("Failed to fetch data", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVisualiserData();
  }, []);

  useEffect(() => {
    setState({ tileId, sidingId, viewMode });
  }, [tileId, sidingId, viewMode]);

  useEffect(() => {
    if (onChange) {
      const { tileId, sidingId, viewMode } = state;

      onChange({
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
      const { tileId, sidingId, viewMode } = stateRef.current;

      onClick({
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
    if (!tiles.length) return;
    return (
      tiles.find(({ code }) => code === state.tileId) ||
      tiles.find(({ code }) => code === tileId) ||
      tiles[0]
    );
  }, [tiles, state.tileId, tileId]);

  const activeSiding = useMemo(
    () =>
      sidings.find(({ id }) => id === state.sidingId) ||
      sidings.find(({ id }) => id === sidingId) ||
      sidings[0],
    [sidings, sidingId, state.sidingId]
  );

  const viewerProps = {
    tile: activeTile,
    options: { contentSource },
    siding: activeSiding,
    setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    ...(state.viewMode === "roof"
      ? { houseModelUrl: houseTypes?.[0]?.houseModel.url }
      : {})
  };

  const Viewer = viewerComponentMap[state.viewMode || "tile"];

  return (
    <StyledContainerDialog
      open={open}
      onCloseClick={handleOnClose}
      onBackdropClick={handleOnClose}
      maxWidth="xl"
      containerClassName={classes.content}
    >
      <ContainerDialog.Header className={classes.header}>
        {shareWidget && <SharePopover shareWidget={shareWidget} />}
      </ContainerDialog.Header>
      <div className={classnames(classes.container, classes.viewer)}>
        {isLoading && (
          <div className={classes.progressContainer}>
            <CircularProgress />
          </div>
        )}
        <div className={classes.details}>
          <div className={classes.detailsContainer}>
            <Logo
              source={BMI}
              width="60"
              height="60"
              className={classes.detailsLogo}
            />
            <div>
              <Typography
                variant="h5"
                component="h3"
                className={classes.detailsTitle}
              >
                {activeTile?.name || ""}
              </Typography>
              <Typography>{activeTile?.colour || ""}</Typography>
            </div>
            <div>
              {activeTile && (
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    handleOnClick({
                      type: "product-link",
                      label: getMicroCopy(microCopy.readMore),
                      data: {
                        variantCode: activeTile.code,
                        productPath: activeTile.path
                      }
                    });
                  }}
                >
                  <span className={classes.detailsText}>
                    {getMicroCopy(microCopy.readMore)}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
        {viewMode && activeTile && <Viewer {...viewerProps} />}
        <TileSectorDialog
          open={isTileSelectorOpen}
          onCloseClick={setIsTileSelectorOpen}
          activeTile={activeTile}
          tiles={tiles}
          contentSource={contentSource}
          onButtonClick={({ tileId, label }) => {
            setIsTileSelectorOpen(false);
            setState({ tileId });
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
    </StyledContainerDialog>
  );
};

export default Visualiser;
