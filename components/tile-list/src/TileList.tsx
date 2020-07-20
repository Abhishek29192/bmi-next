import React, { useState } from "react";
import Button from "@bmi/button";
import styles from "./TileList.module.scss";
import Card from "@bmi/card";
import Icon from "@bmi/icon";
import classnames from "classnames";

type TileProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Tile = ({ children, icon, onClick }: TileProps) => {
  return (
    <Card
      className={classnames(styles["Tile"], {
        [styles["Tile--clickable"]]: !!onClick
      })}
      onClick={onClick}
    >
      <Icon className={styles["Tile__icon"]}>{icon}</Icon>
      <div className={styles["Tile__description"]}>{children}</div>
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
  return (
    <>
      <div className={styles["TileList__wrapper"]}>
        {children.slice(0, numberOfVisibleTiles)}
      </div>
      {numberOfVisibleTiles >= numberOfTiles ? null : (
        <div className={styles["TileList__button"]}>
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