import { microCopy } from "@bmi/microcopies";
import { GatsbyIterable } from "gatsby/dist/datastore/common/iterable";
import type { Catalogue } from "@bmi/docebo-types";
import type { Course } from "@bmi/gatsby-source-docebo";
import { GatsbyTrainingNode } from "./types/Docebo";
import { getMicroCopies } from "./utils/getMicrocopies";
import type { Filter } from "@bmi-digital/components/filters";
import type { Node as GatsbyNode } from "gatsby";
import type { EmptyObject } from "../../types/object";
import type { MicroCopyNode, TrainingListerPage } from "./types/Contentful";
import type { Context } from "./types/Gatsby";

const getCatalogueFilters = async (
  context: Context,
  courses: GatsbyIterable<Course>,
  microCopies: MicroCopyNode[]
): Promise<Filter> => {
  const microCopyKey = microCopy.TRAINING_FILTER_LABEL_CATALOGUE;

  const { entries: catalogues } = await context.nodeModel.findAll<
    Catalogue & GatsbyNode
  >(
    {
      query: {},
      type: "DoceboCatalogues"
    },
    { connectionType: "DoceboCatalogues" }
  );

  const cataloguesWithActiveSessions = catalogues.filter((catalogue) =>
    catalogue.sub_items.some((catalogueCourse) =>
      //[...courses] - converts GatsbyIterable type into a simple array
      [...courses].find(
        ({ id_course }) => id_course.toString() === catalogueCourse.item_id
      )
    )
  );

  return {
    filterCode: "catalogueId",
    name: "catalogue",
    label:
      microCopies.find((i) => i.key === microCopyKey)?.value ||
      `MC: ${microCopyKey}`,
    value: [],
    /** findAll returns GatsbyIterable type.
    Spread operator allows to convert GatsbyIterable into simple array */
    options: [...cataloguesWithActiveSessions].map((catalogue) => ({
      label: catalogue.catalogue_name,
      value: `${catalogue.catalogue_id}`
    }))
  };
};

const getCategoryFilters = async (
  courses: GatsbyIterable<Course>,
  microCopies: MicroCopyNode[]
): Promise<Filter> => {
  const microCopyKey = microCopy.TRAINING_FILTER_LABEL_CATEGORY;

  return {
    filterCode: "category",
    name: "category",
    label: getMicroCopy(microCopies, microCopyKey),
    value: [],
    /** findAll returns GatsbyIterable type.
    Spread operator allows to convert GatsbyIterable into simple array */
    options: getCategoryOptions([...courses], microCopies)
  };
};

const getCategoryOptions = (
  courses: Course[],
  microCopies: MicroCopyNode[]
): Filter["options"] => {
  const categories = courses.map((course) => course.categoryName);

  const pitched = categories.find(
    (category) => category.toUpperCase() === "PITCHED"
  );
  const flat = categories.find((category) => category.toUpperCase() === "FLAT");
  const other = categories.find(
    (category) => category.toUpperCase() === "OTHER"
  );

  const options = [];
  if (pitched) {
    options.push({
      value: pitched,
      label: getMicroCopy(microCopies, microCopy.TRAINING_CATEGORY_PITCHED)
    });
  }

  if (flat) {
    options.push({
      value: flat,
      label: getMicroCopy(microCopies, microCopy.TRAINING_CATEGORY_FLAT)
    });
  }

  if (other) {
    options.push({
      value: other,
      label: getMicroCopy(microCopies, microCopy.TRAINING_CATEGORY_OTHER)
    });
  }

  return options;
};

const getMicroCopy = (
  microCopies: MicroCopyNode[],
  microCopyKey: string
): string => {
  const microCopyValue = microCopies.find(
    (microCopy) => microCopy.key === microCopyKey
  )?.value;

  return microCopyValue || `MC: ${microCopyKey}`;
};

export default {
  filters: {
    type: "[CommonFilter!]!",
    async resolve(
      _source: TrainingListerPage,
      _args: EmptyObject,
      context: Context
    ): Promise<Filter[]> {
      const microCopies = await getMicroCopies(context);

      if (!microCopies) {
        console.error("Did not manage to get microcopies");
        return [];
      }

      const { entries: courses } =
        await context.nodeModel.findAll<GatsbyTrainingNode>(
          {
            query: {},
            type: "DoceboCourses"
          },
          { connectionType: "DoceboCourses" }
        );

      /** [...courses] - converts GatsbyIterable type into a simple array.
      The length property is not available on GatsbyIterable type */
      if (![...courses].length) {
        console.error("Did not manage to get courses");
        return [];
      }

      const catalogueFilter = await getCatalogueFilters(
        context,
        courses,
        microCopies
      );
      const categoryFilters = await getCategoryFilters(courses, microCopies);

      return [catalogueFilter, categoryFilters];
    }
  }
};
