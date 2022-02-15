import React from "react";
import { Typography } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import { Grid } from "@bmi-digital/components";
import { NavigationListButton } from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import styles from "./LanguageSelection.module.scss";

export type LanguageSelectionItem = {
  code: string;
  icon?: string | SVGImport;
  label: string;
};

export type LanguageSelectionList = {
  label: string;
  menu: readonly LanguageSelectionItem[];
};

type LanguageSelectionProps = {
  introduction?: React.ReactNode;
  languages: readonly LanguageSelectionList[];
  forceMobile?: boolean;
};

const LanguageSelection = ({
  introduction,
  languages,
  forceMobile
}: LanguageSelectionProps) => (
  <div className={styles["LanguageSelection"]}>
    {introduction}
    {languages.map(({ label, menu: subMenu }, key) => (
      <div key={`language-group-${key}`}>
        <Typography className={styles["heading"]} variant="h6">
          {label}
        </Typography>
        <Grid
          container
          spacing={0}
          alignItems="center"
          className={styles["container"]}
        >
          {subMenu.map(({ label, icon, code }, key) => (
            <Grid
              item
              key={`language-${key}`}
              xs={12}
              {...(forceMobile ? {} : { md: 3, xl: 2 })}
              className={styles["item"]}
            >
              <NavigationListButton
                className={styles["link"]}
                startIcon={
                  icon &&
                  (typeof icon === "string" ? (
                    <img
                      width="20px"
                      height="16px"
                      className={styles["LanguageIcon"]}
                      src={icon}
                    />
                  ) : (
                    <Icon
                      width="20px"
                      height="16px"
                      className={styles["LanguageIcon"]}
                      source={icon}
                    />
                  ))
                }
                action={{
                  model: "htmlLink",
                  href: `/${code}`
                }}
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
