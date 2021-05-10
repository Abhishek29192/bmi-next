import React, { useMemo, useState, useEffect } from "react";
import { ClickableAction } from "@bmi/anchor-link";
import Button from "@bmi/button";
import Card, { CardActions, CardContent } from "@bmi/card";
import Dialog from "@bmi/dialog";
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
import SvgIcon from "@material-ui/core/SvgIcon";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
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
  title?: string;
  onClose: () => any;
  getProductLinkAction?: (variantCode: string) => any;
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
  onConfirmClick: (tileId: string, colourId: string) => void;
  tiles: any;
};

const Actions = ({
  toggleTileSelector,
  toggleSidingsSelector,
  setViewMode,
  viewMode
}: {
  toggleTileSelector: (isTileSelectorOpen: boolean) => void;
  toggleSidingsSelector: (isSidingsSelectorOpen: boolean) => void;
  setViewMode: (viewMode: Props["viewMode"]) => void;
  viewMode: Props["viewMode"];
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
          onClick={() => setViewMode("roof")}
        >
          Vis produktet på en bolig
        </Button>
      )}
      {viewMode === "roof" && (
        <Button
          hasDarkBackground
          variant="text"
          startIcon={<SvgIcon component={SelectTile} />}
          onClick={() => setViewMode("tile")}
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
  onClick: (tileId: number, colourId: number) => any;
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
              onClick={() => onClick(id, colour.id)}
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

  const onClick = (tileId, colourId) => {
    onConfirmClick(tileId, colourId);
    onCloseClick(false);
  };

  return (
    <Dialog
      open={open}
      onCloseClick={() => onCloseClick(false)}
      onBackdropClick={() => onCloseClick(false)}
      maxWidth="xl"
      color="pearl"
      className={classnames(
        styles["Visualiser"],
        styles["Visualiser--secondary"]
      )}
      backdropProps={{ invisible: true }}
    >
      <Dialog.Content>
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
      </Dialog.Content>
    </Dialog>
  );
};

const SidingsSelectorDialog = ({
  open,
  onCloseClick,
  activeSiding,
  sidings,
  contentSource,
  onConfirmClick
}: {
  open: boolean;
  onCloseClick: (isSidingsSelectorOpen: boolean) => void;
  activeSiding: SidingProps;
  sidings: SidingProps[];
  contentSource: string;
  onConfirmClick: (sidingId: number) => void;
}) => {
  return (
    <Dialog
      open={open}
      onCloseClick={() => onCloseClick(false)}
      onBackdropClick={() => onCloseClick(false)}
      maxWidth="xl"
      color="pearl"
      className={classnames(
        styles["Visualiser"],
        styles["Visualiser--secondary"]
      )}
      backdropProps={{ invisible: true }}
    >
      <Dialog.Content>
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
                  onConfirmClick(id);
                  onCloseClick(false);
                }}
                className={classnames({
                  [styles["active-selection-option"]]: activeSiding.id === id
                })}
                aria-label={activeSiding.id === id ? "Valgt" : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </Dialog.Content>
    </Dialog>
  );
};

const viewerComponentMap = {
  tile: TileViewer,
  roof: HouseViewer
};

const Visualiser = ({
  contentSource,
  open,
  title,
  tileId,
  colourId,
  sidingId,
  viewMode = "tile",
  tiles,
  sidings,
  onClose,
  getProductLinkAction
}: Props) => {
  const [activeTileId, setActiveTileId] = useState(tileId);
  const [activeColourId, setActiveColourId] = useState(colourId);
  const [activeSidingId, setActiveSidingId] = useState(sidingId);
  const [isTileSelectorOpen, setIsTileSelectorOpen] = useState(false);
  const [isSidingsSelectorOpen, setIsSidingsSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState(viewMode);

  useEffect(() => {
    setMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    setActiveTileId(tileId);
  }, [tileId]);

  useEffect(() => {
    setActiveSidingId(sidingId);
  }, [sidingId]);

  useEffect(() => {
    setActiveColourId(colourId);
  }, [colourId]);

  const handleOnClose = () => {
    setIsLoading(true);
    setActiveTileId(tileId);
    setActiveColourId(colourId);
    setActiveSidingId(sidingId);
    setIsTileSelectorOpen(false);
    setIsSidingsSelectorOpen(false);
    setMode(viewMode);
    onClose();
  };

  const activeTile = useMemo(() => {
    return (
      tiles.find(({ id }) => id === activeTileId) ||
      tiles.find(({ id }) => id === tileId) ||
      tiles[0]
    );
  }, [tiles, activeTileId, tileId]);

  const activeColour = useMemo(
    () =>
      activeTile.colours.find(({ id }) => id === activeColourId) ||
      activeTile.colours[0],
    [activeTile, activeColourId]
  );

  const activeSiding = useMemo(
    () =>
      sidings.find(({ id }) => id === activeSidingId) ||
      sidings.find(({ id }) => id === sidingId) ||
      sidings[0],
    [activeSidingId, sidings, sidingId]
  );

  const setActiveProduct = (tileId, colourId) => {
    setActiveTileId(tileId);
    setActiveColourId(colourId);
  };

  const Viewer = viewerComponentMap[mode];

  return (
    <Dialog
      open={open}
      onCloseClick={handleOnClose}
      onBackdropClick={handleOnClose}
      maxWidth="xl"
      className={styles["Visualiser"]}
    >
      {title && <Dialog.Title hasUnderline>{title}</Dialog.Title>}
      <Dialog.Content className={styles["content"]}>
        <div className={styles["container"]}>
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
          {mode && (
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
            onConfirmClick={setActiveProduct}
            contentSource={contentSource}
          />
          <SidingsSelectorDialog
            open={isSidingsSelectorOpen}
            onCloseClick={setIsSidingsSelectorOpen}
            activeSiding={activeSiding}
            sidings={sidings}
            onConfirmClick={setActiveSidingId}
            contentSource={contentSource}
          />
          <Actions
            toggleTileSelector={() =>
              setIsTileSelectorOpen(
                (wasTileSelectorOpen) => !wasTileSelectorOpen
              )
            }
            toggleSidingsSelector={() =>
              setIsSidingsSelectorOpen(
                (wasSidingsSelectorOpen) => !wasSidingsSelectorOpen
              )
            }
            viewMode={mode}
            setViewMode={setMode}
          />
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default Visualiser;
