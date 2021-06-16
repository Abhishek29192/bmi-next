import {
  GraphQLSchema,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
  Source
} from "graphql";
import { ExecutionResult, Maybe } from "@graphql-tools/utils";

import DoceboClient from "../../apis/DoceboClient";

type customResolverParams = {
  graphql: <TData = ExecutionResult["data"]>(
    schema: GraphQLSchema,
    source: Source | string,
    rootValue?: any,
    contextValue?: any,
    variableValues?: Maybe<{ [key: string]: any }>,
    operationName?: Maybe<string>,
    fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
    typeResolver?: Maybe<GraphQLTypeResolver<any, any>>
  ) => Promise<ExecutionResult<TData>>;
  args: any;
  context: any;
  resolverInfo: any;
};

export const updateTrainingResolver = async ({
  graphql,
  args,
  context,
  resolverInfo
}: customResolverParams) => {
  const doceboClient = await DoceboClient.create();
  const courses = await doceboClient.getCourses();
  const enrollments = await doceboClient.getEnrollments();
  const catalogues = await doceboClient.getCatalogues();

  const operations = [
    {
      operationName: "CourseUpdateQuery",
      query: `
  mutation CourseUpdateQuery($input: CourseUpdateInput!) {
    courseUpdate(input: $input) {
      clientMutationId
      }
    }
  `,
      variables: {
        input: {
          courses: courses
        }
      }
    },
    {
      operationName: "EnrollmentUpdateQuery",
      query: `
      mutation EnrollmentUpdateQuery($input:  CourseEnrollmentUpdateInput!) {
        courseEnrollmentUpdate(input: $input) {
          clientMutationId
          }
        }
      `,
      variables: {
        input: {
          enrollments: enrollments
        }
      }
    },
    {
      operationName: "CatalogUpdateQuery",
      query: `
      mutation CatalogUpdateQuery($input:  CourseCatalogueUpdateInput!) {
        courseCatalogueUpdate(input: $input) {
          clientMutationId
          }
        }
      `,
      variables: {
        input: {
          catalogues: catalogues
        }
      }
    }
  ];

  for (const operation of operations) {
    //TODO:Error handling
    await graphql(
      resolverInfo.schema,
      operation.query,
      null,
      context,
      operation.variables,
      operation.operationName
    );
  }
};
