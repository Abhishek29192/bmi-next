import React, { useContext } from "react";
import _ from "lodash";
import Button from "@bmi/button";
import { SiteContext } from "../components/Site";
import { LinkData, getClickableActionFromUrl } from "./Link";
import styles from "./styles/EmbeddedLink.module.scss";
import {
  getDataFromLocale,
  LocalisedFields
} from "../utils/get-data-from-locale";

type Props = {
  fields: LocalisedFields<LinkData>;
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
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
