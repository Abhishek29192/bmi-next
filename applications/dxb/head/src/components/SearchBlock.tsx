import { InputValue } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import PostItCard from "@bmi-digital/components/post-it-card";
import Search, { QUERY_KEY } from "@bmi-digital/components/search";
import Typography from "@bmi-digital/components/typography";
import classnames from "classnames";
import React, { FormEvent, useEffect, useState } from "react";
import RichText from "../components/RichText";
import { getPathWithCountryCode } from "../utils/path";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { StyledSearchPageGrid, classes } from "./styles/SearchBlock.styles";

export type QueryInput = Extract<string, InputValue>;

// Search is enabled if there is any truthy value at all
const isInputValueValid = (value?: InputValue) => !!value;

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
  query?: string | null;
  searchPageSearchTips?: TitleWithContentData | null;
  searchPageSidebarItems?: TitleWithContentData | null;
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

  const handleInputOnChange = (value: InputValue) => {
    setIsSubmitDisabled(!isInputValueValid(value));
  };

  return (
    <StyledSearchPageGrid>
      <Grid lg={8} xs={12}>
        <div className={classnames(classes["content-search"])}>
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
          <div className={classes.content}>
            <Typography variant="h5">{searchPageSearchTips.title}</Typography>
            <RichText document={searchPageSearchTips.content} />
          </div>
        )}
      </Grid>
      {!isLoading && !hasResults && searchPageSidebarItems && (
        <Grid lg={4} xs={12} className={classnames(classes["content-card"])}>
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
    </StyledSearchPageGrid>
  );
};

export default SearchPageBlock;
