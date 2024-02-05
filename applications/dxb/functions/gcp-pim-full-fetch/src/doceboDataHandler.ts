import logger from "@bmi-digital/functions-logger";
import { getCachedDoceboApi, transformCourseCategory } from "@bmi/docebo-api";
import { isDefined } from "@bmi/utils";
import type { Training } from "@bmi/elasticsearch-types";

export const fetchDoceboData = async (
  catalogueId: number,
  itemIds: string[]
): Promise<Training[]> => {
  const doceboApi = getCachedDoceboApi();

  try {
    const catalogues = await doceboApi.fetchCatalogues({
      catalogueIds: [catalogueId]
    });

    if (!catalogues?.length) {
      logger.error({ message: "Did not manage to get catalogue data" });
      return [];
    }
    const catalogue = catalogues[0];

    const currency = await doceboApi.getCurrency();
    if (!currency) {
      logger.error({ message: "Did not manage to get currency" });
      return [];
    }

    const promises = itemIds.map((itemId) => doceboApi.getCourseById(itemId));
    const courses = await Promise.all(promises);

    const sessions = courses.flatMap((course) =>
      (course.sessions || []).map((session) => {
        const sessionStartTime = new Date(session.start_date).getTime();
        const currentTime = new Date().getTime();

        if (sessionStartTime <= currentTime) {
          //if the condition above passes, it means that session is not active anymore
          return;
        }

        return {
          id: `${catalogueId}-${course.id}-${session.id_session}`,
          sessionId: session.id_session,
          sessionName: session.name,
          sessionSlug: session.slug_name,
          startDate: session.start_date,
          endDate: session.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: transformCourseCategory(course.category),
          onSale: course.on_sale,
          price: course.price,
          currency: currency.currency_currency,
          currencySymbol: currency.currency_symbol,
          // If we want to use catalogue as a number, it will require some additional logic in the ES queries on Frontend side
          catalogueId: catalogueId.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        };
      })
    );

    return sessions.filter(isDefined);
  } catch (err) {
    throw new Error(
      `Did not manage to pull Docebo data: ${JSON.stringify(err)}`
    );
  }
};
