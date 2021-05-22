import dotenv from "dotenv";

dotenv.config();

import DoceboClient from "./DoceboClient";
import {
  getLastUpdateDate,
  updateLastUpdateDate,
  updateCources,
  updateEnrollments,
  updateCatalogs
} from "./PostgreSqlClient";

export const updateTraining = async (postEvent: any, context: any) => {
  const doceboClient = await DoceboClient.create();

  try {
    //TODO: Maybe we can this info from google firestore/redis etc insead of DB.
    const updated_from = await getLastUpdateDate();
    const current_date = new Date().getTime();

    const courses = await doceboClient.getCourses(updated_from);
    const enrollments = await doceboClient.getEnrollments(updated_from);
    const catalogues = await doceboClient.getCatalogues();

    await updateCources(courses);
    await updateEnrollments(enrollments);
    await updateCatalogs(catalogues);

    await updateLastUpdateDate(current_date);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

updateTraining(null, null);
