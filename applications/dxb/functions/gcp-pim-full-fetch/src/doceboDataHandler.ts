import { getCachedDoceboApi, transformCourseCategory } from "@bmi/docebo-api";
import { isDefined } from "@bmi/utils";
import { Training as ESTraining } from "@bmi/elasticsearch-types";

export const fetchDoceboData = async (page: number) => {
  const doceboApi = getCachedDoceboApi();

  const catalogueIds = process.env.DOCEBO_API_CATALOGUE_IDS?.split(",")?.map(
    (catalogueId) => Number(catalogueId)
  );
  try {
    const catalogues = await doceboApi.fetchCatalogues({ catalogueIds });
    const courses = await doceboApi.fetchCourses({ page, pageSize: 10 });
    const currency = await doceboApi.getCurrency();

    return catalogues.flatMap<ESTraining>((catalogue) =>
      catalogue.sub_items
        .map((item) => {
          const course = courses.find(
            ({ id_course }) => id_course.toString() === item.item_id
          );

          if (!course) {
            return;
          }

          return {
            id: `${course.id_course}-${catalogue.catalogue_id}`,
            courseId: course.id_course,
            code: course.code,
            name: course.name,
            slug: course.slug_name,
            courseType: course.course_type,
            imgUrl: course.img_url,
            category: transformCourseCategory(course.category),
            catalogueId: `${catalogue.catalogue_id}`,
            catalogueName: catalogue.catalogue_name,
            catalogueDescription: catalogue.catalogue_description,
            onSale: course.selling,
            startDate: course.start_date,
            price: course.price,
            currency: currency.currency_currency,
            currencySymbol: currency.currency_symbol
          };
        })
        .filter(isDefined)
    );
  } catch (err) {
    throw new Error(
      `Did not manage to pull Docebo data: ${JSON.stringify(err)}`
    );
  }
};
