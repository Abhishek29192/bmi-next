import React, { useState } from "react";
import { Button } from "@bmi-digital/components";
import { Card } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import classnames from "classnames";
import styles from "./TileList.module.scss";

type TileProps = {
  children: React.ReactNode;
  icon: SVGImport;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Tile = ({ children, icon, onClick }: TileProps) => {
  return (
    <Card
      className={classnames(
        styles["Tile"],
        !!onClick && styles["Tile--clickable"]
      )}
      onClick={onClick}
    >
      <Icon className={styles["icon"]} source={icon} />
      <div className={styles["description"]}>{children}</div>
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
      <div className={styles["wrapper"]}>
        {children.slice(0, numberOfVisibleTiles)}
      </div>
      {numberOfVisibleTiles >= numberOfTiles ? null : (
        <div className={styles["button"]}>
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
