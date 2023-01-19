import {
  Grid,
  InputValue,
  PostItCard,
  QUERY_KEY,
  Search,
  Typography
} from "@bmi-digital/components";
import classnames from "classnames";
import React, { FormEvent, useEffect, useState } from "react";
import RichText from "../components/RichText";
import { getPathWithCountryCode } from "../utils/path";
import { Data as TitleWithContentData } from "./TitleWithContent";
import styles from "./styles/SearchBlock.module.scss";

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
  query,
  searchPageSearchTips,
  searchPageSidebarItems
}: Props) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(
    !isInputValueValid(query)
  );
  useEffect(() => {
    setIsSubmitDisabled(!isInputValueValid(query));
  }, [query]);

  const handleInputOnChange = (value) => {
    setIsSubmitDisabled(!isInputValueValid(value));
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
            value={query}
            fieldName={QUERY_KEY}
            onSubmit={handleSubmit}
            helperText={helperText}
            placeholder={placeholder}
            onChange={handleInputOnChange}
            isSubmitDisabled={isSubmitDisabled}
            data-testid="search-form"
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
          <PostItCard color="pearl">
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
