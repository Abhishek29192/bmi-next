import React, { useContext } from "react";
import _ from "lodash";
import Button from "@bmi/button";
import { SiteContext } from "../components/Site";
import { LinkData, getClickableActionFromUrl } from "./Link";
import styles from "./styles/EmbeddedLink.module.scss";

type LocalisedFields<T> = {
  [key in keyof T]: {
    [locale: string]: T[key];
  };
};

type Props = {
  fields: LocalisedFields<LinkData>;
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const getDataFromLocale = <T extends {}>(
  localeCode: string,
  fields?: LocalisedFields<T>
) => {
  if (!fields) {
    return;
  }
  // TODO: Ideally the return type should also be using the generic.
  // However, it's a complicated structure. Thanks Contentfuk. (Actual typo)
  return _.mapValues(fields, (value) => value[localeCode]);
};

const EmbeddedLink = ({
  fields,
  theme = "primary",
  backgroundTheme = "light"
}: Props) => {
  const { node_locale, countryCode } = useContext(SiteContext);

  // TODO: Check the typing here
  const localeFields = getDataFromLocale(node_locale, fields);

  return (
    <Button
      variant={theme === "primary" ? "contained" : "outlined"}
      hasDarkBackground={backgroundTheme === "dark"}
      action={getClickableActionFromUrl(
        getDataFromLocale<LinkData["linkedPage"]>(
          node_locale,
          // @ts-ignore See getDataFromLocale comment
          localeFields.linkedPage?.fields
        ),
        // @ts-ignore See getDataFromLocale comment
        localeFields.url,
        countryCode
      )}
      className={styles["EmbeddedLink"]}
    >
      {localeFields.label}
    </Button>
  );
};

export default EmbeddedLink;
