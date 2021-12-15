import React from "react";
import styles from "./styles/ColorSwatch.module.scss";

export const COLOR_CODES = {
  ANTHRACITE: "#393E42",
  ANTIQUE_BROWN: "#6B3C33",
  ANTIQUE_CLAY: "#CB9E7C",
  ANTIQUE_COLOR: "#B9966E",
  ANTIQUE_GREY: "#848484",
  ANTIQUE_RED: "#850C2D",
  ANTIQUE_WHITE: "#FFFFF4",
  ANTIQUE_YELLOW: "#D5B515",
  Autumn_Colour: "#814523",
  BLACK: "#000",
  "BLACK MATT": "#121212",
  BLUE: "#007BFF",
  BROWN: "#783024",
  CHARCOAL_GRAY: "#373739",
  CLAY: "#D49073",
  CLAY_COLOUR: "#D19175",
  CLAYRED_MATT: "#D5622F",
  COPPER: "#EC5E00",
  COPPER_COLOUR: "#EC5E00",
  CORAL: "#F9767E",
  "DARK BROWN": "#250A04",
  "DARK SILVER": "#C2C2C2",
  "DARK SLATE": "#343746",
  DARK_GREY: "#AAA",
  GALVANIZED: "#9C9C9C",
  "Grå med skygge": "#BABABA",
  GRAPHITE: "#888",
  "GRAPHITE MATT": "#3B3B3B",
  GREEN: "#447462",
  GREY: "#CCC",
  "GREY ANTIQUE": "#848484",
  "JET BLACK": "#111",
  Lead_grey: "#6D6D6D",
  "LIGHT BROWN": "#A2675D",
  LIGHT_GREY: "#C7C7C7",
  "MATT BLACK": "#151515",
  METALLIC: "#DDD",
  NATURAL_RED: "#E6896E",
  ORANGE: "#F7863F",
  PEACH: "#F38962",
  PEPPER: "#BBB",
  PINK: "#CF7DBE",
  PURPLE: "#712361",
  RED: "#DE3A27",
  "RED ANTIQUE": "#8f4322",
  SILVER: "#DDD",
  "SILVER BLACK": "#4E4E4E",
  "Teglrød med skygge": "#BF6640",
  WHITE: "#FFF",
  WINERED: "#490707",
  YELLOW: "#F4EB94"
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
        // eslint-disable-next-line security/detect-object-injection
        backgroundColor: COLOR_CODES[colorCode]
      }}
    />
  );
};

export default ColorSwatch;
