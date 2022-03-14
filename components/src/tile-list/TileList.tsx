import { SVGImport } from "@bmi-digital/svg-import";
import classnames from "classnames";
import React, { useState } from "react";
import Button from "../button/Button";
import Card from "../card/Card";
import Icon from "../icon";
import { useStyles } from "./styles";

type TileProps = {
  children: React.ReactNode;
  icon: SVGImport;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Tile = ({ children, icon, onClick }: TileProps) => {
  const classes = useStyles();
  return (
    <Card
      className={classnames(classes.tile, !!onClick && classes.clickable)}
      onClick={onClick}
    >
      <Icon className={classes.icon} source={icon} />
      <div className={classes.description}>{children}</div>
    </Card>
  );
};

type Props = {
  children: React.ReactNode[];
  isPaginated?: boolean;
  itemsPerPage?: number;
};

const TileList = ({ children, isPaginated, itemsPerPage = 8 }: Props) => {
  const numberOfTiles = children.length;
  const [numberOfVisibleTiles, setNumberOfVisibleTiles] = useState(
    isPaginated ? itemsPerPage : numberOfTiles
  );
  const classes = useStyles();
  return (
    <>
      <div className={classes.wrapper}>
        {children.slice(0, numberOfVisibleTiles)}
      </div>
      {numberOfVisibleTiles >= numberOfTiles ? null : (
        <div className={classes.button}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setNumberOfVisibleTiles(numberOfVisibleTiles + 8)}
          >
            Show More
          </Button>
        </div>
      )}
    </>
  );
};

TileList.Item = Tile;
export default TileList;
