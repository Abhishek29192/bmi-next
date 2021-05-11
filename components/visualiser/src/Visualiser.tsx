import React, {
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useRef,
  RefObject,
  useCallback
} from "react";
import { ClickableAction } from "@bmi/anchor-link";
import Button from "@bmi/button";
import Card, { CardActions, CardContent } from "@bmi/card";
import ContainerDialog from "@bmi/container-dialog";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import {
  TileColour,
  SelectRoof,
  SelectTile,
  SelectWallColour
} from "@bmi/icon";
import Logo, { BMI } from "@bmi/logo";
import ToggleCard from "@bmi/toggle-card";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Popover, SvgIcon } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShareIcon from "@material-ui/icons/Share";
import classnames from "classnames";
import {
  TileViewer,
  HouseViewer,
  GetRef as getRef
} from "@bmi/visualiser-library";
import { groupBy } from "lodash";
import styles from "./Visualiser.module.scss";

const MATERIAL_NAME_MAP = {
  1: "Betongtakstein",
  2: "Telgtakstein",
  3: "Takpanner"
};

export type Parameters = {
  tileId?: number;
  colourId?: number;
  sidingId?: number;
  viewMode?: "tile" | "roof";
  tiles: TileProps[];
  sidings: SidingProps[];
};

type Props = {
  contentSource: string;
  open: boolean;
  onClose: () => any;
  getProductLinkAction?: (variantCode: string) => any;
  onChange?: (params: Partial<Parameters & { isOpen: boolean }>) => void;
  shareWidget?: React.ReactNode;
  onEventClick: (
    params: Partial<Parameters> & { id: string; label: string }
  ) => void;
} & Parameters;

type TileProps =
  | any
  | {
      productLink?: {
        action?: ClickableAction;
        label: string; // TODO: label in data should be "Les mer om produktet"
      };
    }; // TODO: type tile entity
type TileColourProps = any; // TODO: type colour tile entity
type SidingProps = any; // TODO: type sidings entity

type TileSectorDialogProps = {
  activeTile: TileProps;
  activeColour: TileColourProps;
  contentSource: string;
  open: boolean;
  onCloseClick: (isTileSelectorOpen: boolean) => void;
  onConfirmClick: (data: { tileId: string; colourId: string }) => void;
  onEventClick: (event: { id: string; label: string }) => void;
  tiles: any;
};

const Actions = ({
  toggleTileSelector,
  toggleSidingsSelector,
  setViewMode,
  viewMode,
  onEventClick
}: {
  toggleTileSelector: (isTileSelectorOpen: boolean) => void;
  toggleSidingsSelector: (isSidingsSelectorOpen: boolean) => void;
  setViewMode: (data: { viewMode: Props["viewMode"] }) => void;
  viewMode: Props["viewMode"];
  onEventClick: (event: { id: string; label: string }) => void;
}) => {
  return (
    <nav className={styles["actions"]}>
      <Button
        hasDarkBackground
        variant="text"
        startIcon={<SvgIcon component={TileColour} />}
        onClick={toggleTileSelector}
      >
        Velg produkt
      </Button>
      <Button
        hasDarkBackground
        variant="text"
        startIcon={<SvgIcon component={SelectWallColour} />}
        disabled={viewMode !== "roof"}
        onClick={toggleSidingsSelector}
      >
        Farge på vegg
      </Button>
      {viewMode === "tile" && (
        <Button
          hasDarkBackground
          variant="text"
          startIcon={<SvgIcon component={SelectRoof} />}
          onClick={() => {
            setViewMode({ viewMode: "roof" });
            onEventClick({
              id: "visualiser1-bottom-menu",
              label: "Vis produktet på en bolig"
            });
          }}
        >
          Vis produktet på en bolig
        </Button>
      )}
      {viewMode === "roof" && (
        <Button
          hasDarkBackground
          variant="text"
          startIcon={<SvgIcon component={SelectTile} />}
          onClick={() => {
            setViewMode({ viewMode: "tile" });
            onEventClick({
              id: "visualiser1-bottom-menu",
              label: "Kun produktet"
            });
          }}
        >
          Kun produktet
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
  onClick: (tileId: number, colourId: number, label: string) => any;
}) => {
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
                url: true,
                size: "128",
                contentSource
              })}
              onClick={() => onClick(id, colour.id, `${name} + ${colour.name}`)}
              className={classnames({
                [styles["active-selection-option"]]:
                  defaultValue === `${id}-${colour.id}`
              })}
              aria-label={
                defaultValue === `${id}-${colour.id}` ? "Valgt" : undefined
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
  onConfirmClick,
  onEventClick,
  tiles
}: TileSectorDialogProps) => {
  const productProps = useMemo(
    () =>
      tiles.flatMap(({ colours, ...rest }) =>
        colours.map((colour) => ({ ...rest, colour }))
      ),
    [tiles]
  );

  const productPropsGroupedByMaterial = groupBy(productProps, "material");

  const defaultTileIdentifier = `${activeTile.id}-${activeColour.id}`;

  const onClick = (tileId, colourId, label) => {
    onConfirmClick({ tileId, colourId });
    onCloseClick(false);
    onEventClick({ id: "visualiser1-product-selector", label });
  };

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
        Velg produkt
      </Typography>
      <Typography gutterBottom>
        Denne tjenesten skal kun brukes som veiledning. Faktiske
        produktoverflater- og farger kan variere fra de som vises.
      </Typography>

      {Object.keys(productPropsGroupedByMaterial).map((key) => (
        <SelectionOptions
          contentSource={contentSource}
          defaultValue={defaultTileIdentifier}
          key={`material-group-${key}`}
          title={MATERIAL_NAME_MAP[key]}
          products={productPropsGroupedByMaterial[key]}
          onClick={onClick}
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
  onEventClick
}: {
  open: boolean;
  onCloseClick: (isSidingsSelectorOpen: boolean) => void;
  activeSiding: SidingProps;
  sidings: SidingProps[];
  contentSource: string;
  onConfirmClick: (data: { sidingId: number }) => void;
  onEventClick: (event: { id: string; label: string }) => void;
}) => {
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
        Velg farge på vegg
      </Typography>
      <Grid container spacing={2}>
        {sidings.map(({ id, name, diffuseMapRef }) => (
          <Grid key={id} item xs={6} md={4} lg={2}>
            <ToggleCard
              component="button"
              title={name}
              imageSource={getRef(diffuseMapRef, {
                url: true,
                size: "original",
                contentSource
              })}
              onClick={() => {
                onConfirmClick({ sidingId: id });
                onCloseClick(false);
                onEventClick({ id: "visualiser1-wall-selector", label: name });
              }}
              className={classnames({
                [styles["active-selection-option"]]: activeSiding.id === id
              })}
              aria-label={activeSiding.id === id ? "Valgt" : undefined}
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
  const [anchorElement, setAnchorElement] = useState(null);

  const handlePopoverClick = () => {
    setAnchorElement(anchorRef.current);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  return (
    <div>
      <Button
        isIconButton
        className={styles["share-button"]}
        variant="text"
        accessibilityLabel={"Lukk"}
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
    </div>
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
  colourId,
  sidingId,
  viewMode,
  tiles,
  sidings,
  shareWidget,
  onClose,
  getProductLinkAction,
  onChange,
  onEventClick
}: Props) => {
  const [isTileSelectorOpen, setIsTileSelectorOpen] = useState(false);
  const [isSidingsSelectorOpen, setIsSidingsSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const header = useRef<HTMLDivElement>(null);
  const [state, _setState] = useState({ tileId, colourId, sidingId, viewMode });

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

  const handleOnEventClick = useCallback(
    ({ id, label }) => {
      const { tileId, colourId, sidingId, viewMode } = stateRef.current;

      onEventClick({
        colourId,
        sidingId,
        tileId,
        viewMode,
        id,
        label
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
  }, [tiles, state.tileId]);

  const activeColour = useMemo(
    () =>
      activeTile.colours.find(({ id }) => id === state.colourId) ||
      activeTile.colours[0],
    [activeTile, state.colourId]
  );

  const activeSiding = useMemo(
    () =>
      sidings.find(({ id }) => id === state.sidingId) ||
      sidings.find(({ id }) => id === sidingId) ||
      sidings[0],
    [sidings, sidingId, state.sidingId]
  );

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
      {shareWidget && (
        <ContainerDialog.Header ref={header}>
          <SharePopover shareWidget={shareWidget} anchorRef={header} />
        </ContainerDialog.Header>
      )}
      <div
        className={classnames(styles["container"], styles["container--viewer"])}
      >
        {isLoading && (
          <div className={styles["progress-container"]}>
            <CircularProgress />
          </div>
        )}
        <div className={styles["details"]}>
          <Grid container>
            <Grid item xs={10} sm={6} md={5} lg={4}>
              <Card square={true}>
                <CardContent>
                  <Logo
                    source={BMI}
                    width="60"
                    height="60"
                    className={styles["details-logo"]}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    className={styles["details-title"]}
                  >
                    {activeTile.name}
                  </Typography>
                  <Typography>{activeColour.name}</Typography>
                </CardContent>
                {activeColour.variantCode && (
                  <CardActions>
                    <Button
                      action={
                        getProductLinkAction
                          ? getProductLinkAction(activeColour.variantCode)
                          : undefined
                      }
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Les mer om produktet
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
            setIsLoading={(isLoading) => setIsLoading(isLoading)}
          />
        )}
        <TileSectorDialog
          open={isTileSelectorOpen}
          onCloseClick={setIsTileSelectorOpen}
          activeTile={activeTile}
          activeColour={activeColour}
          tiles={tiles}
          onConfirmClick={setState}
          contentSource={contentSource}
          onEventClick={handleOnEventClick}
        />
        <SidingsSelectorDialog
          open={isSidingsSelectorOpen}
          onCloseClick={setIsSidingsSelectorOpen}
          activeSiding={activeSiding}
          sidings={sidings}
          onConfirmClick={setState}
          contentSource={contentSource}
          onEventClick={handleOnEventClick}
        />
        <Actions
          toggleTileSelector={() => {
            setIsTileSelectorOpen(
              (wasTileSelectorOpen) => !wasTileSelectorOpen
            );
            handleOnEventClick({
              id: "visualiser1-bottom-menu",
              label: "Velg produkt"
            });
          }}
          toggleSidingsSelector={() => {
            setIsSidingsSelectorOpen(
              (wasSidingsSelectorOpen) => !wasSidingsSelectorOpen
            );
            handleOnEventClick({
              id: "visualiser1-bottom-menu",
              label: "Farge på vegg"
            });
          }}
          viewMode={viewMode}
          setViewMode={setState}
          onEventClick={handleOnEventClick}
        />
      </div>
    </ContainerDialog>
  );
};

export default Visualiser;
