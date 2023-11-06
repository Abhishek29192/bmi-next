import { DoceboApiService } from "@bmi/docebo-api";
import { CourseWithSessions } from "@bmi/docebo-types";
import { nodeBuilder } from "./utils";
import { NODE_TYPES } from "./types";
import type { GatsbyNode } from "gatsby";

export type ConfigOptions = {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  catalogueIds?: string;
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({
  Joi
}) => {
  return Joi.object({
    apiUrl: Joi.string().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    catalogueIds: Joi.string().optional()
  });
};

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (
  gatsbyApi,
  options
) => {
  const { apiUrl, catalogueIds, clientId, clientSecret, username, password } =
    options as unknown as ConfigOptions;

  gatsbyApi.reporter.info("Fetching Docebo nodes...");

  const parseCatalogIds = (ids: string) =>
    ids.split(",").map((id) => Number(id));

  try {
    const apiService = new DoceboApiService({
      apiUrl,
      clientId,
      clientSecret,
      username,
      password
    });

    const [courses, categories, catalogues, certifications] = await Promise.all(
      [
        apiService.fetchCourses({ ignoreNextPage: false }),
        apiService.fetchCategories({}),
        apiService.fetchCatalogues({
          catalogueIds: catalogueIds ? parseCatalogIds(catalogueIds) : undefined
        }),
        apiService.fetchCertifications({})
      ]
    );

    const coursesWithSessions: CourseWithSessions[] = [];

    for (const course of courses) {
      const { id_course: course_id } = course;
      const sessions = await apiService.fetchSessions({ page: 1, course_id });
      const courseWithSession = { ...course, sessions };
      coursesWithSessions.push(courseWithSession);
    }

    gatsbyApi.reporter.info(
      `Docebo courses nodes created: ${coursesWithSessions.length}`
    );
    gatsbyApi.reporter.info(
      `Docebo Category nodes created: ${categories.length}`
    );
    gatsbyApi.reporter.info(
      `Docebo Catalog nodes created: ${catalogues.length}`
    );
    gatsbyApi.reporter.info(
      `Docebo Certification nodes created: ${certifications.length}`
    );

    coursesWithSessions?.forEach((course) =>
      nodeBuilder({
        gatsbyApi,
        input: { type: NODE_TYPES.Courses, data: course },
        itemId: course.id_course
      })
    );

    categories?.forEach((category) =>
      nodeBuilder({
        gatsbyApi,
        input: { type: NODE_TYPES.Categories, data: category },
        itemId: category.id
      })
    );

    catalogues?.forEach((catalogue) =>
      nodeBuilder({
        gatsbyApi,
        input: { type: NODE_TYPES.Catalogues, data: catalogue },
        itemId: catalogue.catalogue_id
      })
    );

    certifications?.forEach((certification) =>
      nodeBuilder({
        gatsbyApi,
        input: { type: NODE_TYPES.Certifications, data: certification },
        itemId: certification.id_cert
      })
    );
  } catch (err) {
    gatsbyApi.reporter.error(
      `Did not manage to pull Docebo data. ${JSON.stringify(err)}`
    );
  }
};
