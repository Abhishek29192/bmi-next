import * as SchemaTypes from "./schemas";

export type TrainingsQueryVariables = SchemaTypes.Exact<{
  [key: string]: never;
}>;

export type TrainingsQuery = { __typename?: "Query" } & {
  training?: SchemaTypes.Maybe<
    { __typename?: "TrainingInfo" } & Pick<
      SchemaTypes.TrainingInfo,
      "name" | "url"
    > & {
        user?: SchemaTypes.Maybe<
          { __typename?: "TrainingUser" } & Pick<
            SchemaTypes.TrainingUser,
            | "id"
            | "email"
            | "user_level"
            | "username"
            | "firstname"
            | "lastname"
          > & {
              enrollment?: SchemaTypes.Maybe<
                { __typename?: "Enrollment" } & Pick<
                  SchemaTypes.Enrollment,
                  | "count"
                  | "has_more_data"
                  | "current_page"
                  | "current_page_size"
                  | "total_page_count"
                  | "total_count"
                > & {
                    items?: SchemaTypes.Maybe<
                      Array<
                        SchemaTypes.Maybe<
                          { __typename?: "EnrollmentItems" } & Pick<
                            SchemaTypes.EnrollmentItems,
                            | "id"
                            | "name"
                            | "description"
                            | "status"
                            | "image_url"
                            | "url"
                            | "type"
                            | "level"
                          >
                        >
                      >
                    >;
                  }
              >;
            }
        >;
      }
  >;
};
