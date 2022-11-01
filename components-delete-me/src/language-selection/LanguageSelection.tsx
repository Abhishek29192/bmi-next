import { SVGImport } from "@bmi-digital/svg-import";
import React from "react";
import Grid from "../grid/Grid";
import Icon from "../icon";
import { NavigationListButton } from "../navigation";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

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
  onCountrySelection?: (label: string, code: string) => void;
};

const LanguageSelection = ({
  introduction,
  languages,
  forceMobile,
  onCountrySelection
}: LanguageSelectionProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {introduction}
      {languages.map(({ label, menu: subMenu }, key) => (
        <div key={`language-group-${key}`}>
          <Typography className={classes.heading} variant="h6">
            {label}
          </Typography>
          <Grid
            container
            spacing={0}
            alignItems="center"
            className={classes.container}
          >
            {subMenu.map(({ label, icon, code }, key) => (
              <Grid
                item
                key={`language-${key}`}
                xs={12}
                {...(forceMobile ? {} : { md: 3, xl: 2 })}
                className={classes.item}
              >
                <NavigationListButton
                  data-gtm={JSON.stringify({
                    id: "nav-country-selector",
                    label,
                    action: `/${code}/`
                  })}
                  className={classes.link}
                  startIcon={
                    icon &&
                    (typeof icon === "string" ? (
                      <img
                        width="20px"
                        height="16px"
                        className={classes.languageIcon}
                        src={icon}
                      />
                    ) : (
                      <Icon
                        width="20px"
                        height="16px"
                        className={classes.languageIcon}
                        source={icon}
                      />
                    ))
                  }
                  action={{
                    model: "htmlLink",
                    href: `/${code}`
                  }}
                  onClick={() => onCountrySelection?.(label, `/${code}/`)}
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
};

export default LanguageSelection;
