import React from "react";
import styles from "./styles/ColorSwatch.module.scss";

const COLOR_CODES = {
  PEPPER: "#BBB",
  BLACK: "#000",
  ANTIQUE_RED: "#850C2D",
  CLAY_COLOUR: "#D19175",
  RED: "#DE3A27",
  "RED ANTIQUE": "#8f4322",
  GREY: "#CCC",
  "GREY ANTIQUE": "#848484",
  METALLIC: "#DDD",
  GRAPHITE: "#888"
};

const ColorSwatch = ({
  colorCode
}: {
  colorCode: keyof typeof COLOR_CODES;
}) => {
  return (
    <span
      className={styles["ColorSwatch"]}
      style={{
        backgroundColor: COLOR_CODES[colorCode]
      }}
    />
  );
};

export default ColorSwatch;
