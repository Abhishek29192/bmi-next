import dotenv from "dotenv";

dotenv.config();

import DoceboClient from "./DoceboClient";
import {
  getLastUpdateDate,
  insertCoursesToTempTable,
  updateCourse
} from "./PostgreSqlClient";

export const updateTraining = async (postEvent: any, context: any) => {
  const updated_from = await getLastUpdateDate();

  const doceboClient = new DoceboClient();
  const courses = await doceboClient.getCourses(updated_from);

  if (courses.length > 0) {
    await insertCoursesToTempTable(courses);
    await updateCourse();
  }
  //TODO: Update enrollment and catalogue tables too.

  //TODO:Update last updated data
};
