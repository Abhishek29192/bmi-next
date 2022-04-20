import { InputValue } from "@bmi/components";
import { Grid } from "@bmi/components";
import { PostItCard } from "@bmi/components";
import { Search, QUERY_KEY } from "@bmi/components";
import { Typography } from "@bmi/components";
import classnames from "classnames";
import React, { FormEvent, useState, useEffect } from "react";
import RichText from "../components/RichText";
import { getPathWithCountryCode } from "../utils/path";
import styles from "./styles/SearchBlock.module.scss";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type QueryInput = Extract<string, InputValue>;

// Search is enabled if there is any truthy value at all
const isInputValueValid = (value) => !!value;

type Props = {
  buttonText?: string;
  countryCode: string;
  handleSubmit?: (
    event: FormEvent<HTMLFormElement>,
    values: Record<typeof QUERY_KEY, QueryInput>
  ) => void;
  hasResults?: boolean;
  isLoading?: boolean;
  helperText?: string;
  placeholder?: string;
  query?: string;
  searchPageSearchTips?: TitleWithContentData;
  searchPageSidebarItems?: TitleWithContentData;
};

const SearchPageBlock = ({
  buttonText,
  countryCode,
  handleSubmit,
  hasResults,
  isLoading,
  helperText,
  placeholder,
  query = null,
  searchPageSearchTips,
  searchPageSidebarItems
}: Props) => {
  const [internalQueryState, setInternalQueryState] = useState(query);
  useEffect(() => {
    setInternalQueryState(query);
  }, [query]);

  const handleInputOnChange = (value) => {
    setInternalQueryState(value);
  };

  return (
    <Grid container spacing={3} className={styles["SearchBlock"]}>
      <Grid item lg={8} xs={12}>
        <div
          className={classnames(styles["content"], styles["content--search"])}
        >
          <Search
            action={getPathWithCountryCode(countryCode, "search")}
            buttonText={buttonText}
            value={internalQueryState}
            fieldName={QUERY_KEY}
            onSubmit={handleSubmit}
            helperText={helperText}
            placeholder={placeholder}
            onChange={handleInputOnChange}
            isSubmitDisabled={!isInputValueValid(internalQueryState)}
          />
        </div>
        {!isLoading && !hasResults && searchPageSearchTips && (
          <div className={styles["content"]}>
            <Typography variant="h5">{searchPageSearchTips.title}</Typography>
            <RichText document={searchPageSearchTips.content} />
          </div>
        )}
      </Grid>
      {!isLoading && !hasResults && searchPageSidebarItems && (
        <Grid
          item
          lg={4}
          xs={12}
          className={classnames(styles["content"], styles["content--card"])}
        >
          <PostItCard theme="pearl">
            <PostItCard.Section>
              <PostItCard.Heading hasUnderline>
                {searchPageSidebarItems.title}
              </PostItCard.Heading>
              <PostItCard.Content>
                <RichText
                  document={searchPageSidebarItems.content}
                  gtmLabel={searchPageSidebarItems.title}
                />
              </PostItCard.Content>
            </PostItCard.Section>
          </PostItCard>
        </Grid>
      )}
    </Grid>
  );
};

export default SearchPageBlock;
