import { InputValue } from "@bmi/form";
import Grid from "@bmi/grid";
import PostItCard from "@bmi/post-it-card";
import Search, { QUERY_KEY } from "@bmi/search";
import Typography from "@bmi/typography";
import classnames from "classnames";
import React, { FormEvent } from "react";
import RichText from "../components/RichText";
import styles from "./styles/SearchBlock.module.scss";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type QueryInput = Extract<string, InputValue>;

type Props = {
  buttonText?: string;
  countryCode: string;
  handleSubmit?: (
    event: FormEvent<HTMLFormElement>,
    values: Record<typeof QUERY_KEY, QueryInput>
  ) => void;
  hasResults?: boolean;
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
  helperText,
  placeholder,
  query = null,
  searchPageSearchTips,
  searchPageSidebarItems
}: Props) => {
  return (
    <Grid container spacing={3} className={styles["SearchBlock"]}>
      <Grid item lg={8} xs={12}>
        <div
          className={classnames(styles["content"], styles["content--search"])}
        >
          <Search
            action={`/${countryCode}/search`}
            buttonText={buttonText}
            defaultValue={query}
            fieldName={QUERY_KEY}
            onSubmit={handleSubmit}
            helperText={helperText}
            placeholder={placeholder}
          />
        </div>
        {!hasResults && searchPageSearchTips && (
          <div className={styles["content"]}>
            <Typography variant="h5">{searchPageSearchTips.title}</Typography>
            <RichText document={searchPageSearchTips.content} />
          </div>
        )}
      </Grid>
      {!hasResults && searchPageSidebarItems && (
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
                <RichText document={searchPageSidebarItems.content} />
              </PostItCard.Content>
            </PostItCard.Section>
          </PostItCard>
        </Grid>
      )}
    </Grid>
  );
};

export default SearchPageBlock;
