import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import Grid from "@bmi/grid";
import { NavigationListButton } from "@bmi/navigation";
import styles from "./LanguageSelection.module.scss";

export type LanguageSelectionItem = {
  code: string;
  icon?: SVGImport;
  label: string;
};

export type LanguageSelectionList = {
  label: string;
  menu?: readonly LanguageSelectionItem[];
};

type LanguageSelectionProps = {
  languages: readonly LanguageSelectionList[];
};

const LanguageSelection = ({ languages }: LanguageSelectionProps) => (
  <div className={styles["LanguageSelection"]}>
    <Typography className={styles["heading"]} variant="h5">
      Choose your region
    </Typography>
    <Typography className={styles["paragraph"]}>
      Selecting a region will take you to a different BMI website that has been
      tailored to give you the most useful content for your part of the world.
    </Typography>
    <Typography className={styles["paragraph"]}>
      <b>
        The site you are currently viewing contains products that are available
        in Norway. Products from other markets may not meet the Norwegian
        Standards in building materials.
      </b>
    </Typography>
    {languages.map(({ label, menu: subMenu }, key) => (
      <div key={`language-group-${key}`}>
        <Typography className={styles["heading"]} variant="h6">
          {label}
        </Typography>
        <Grid container spacing={2}>
          {subMenu.map(({ label, icon }, key) => (
            <Grid item key={`language-${key}`} sm={12} md={3}>
              <NavigationListButton
                className={styles["link"]}
                startIcon={
                  icon && (
                    <Icon className={styles["LanguageIcon"]} source={icon} />
                  )
                }
              >
                {label}
              </NavigationListButton>
            </Grid>
          ))}
        </Grid>
      </div>
    ))}
  </div>
);

export default LanguageSelection;
