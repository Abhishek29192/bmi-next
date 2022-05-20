import DoceboClient from "./DoceboClient";
import { insertCertification } from "./PostgreSqlClient";

export const updateCertificates = async (postEvent: any, context: any) => {
  const doceboClient = new DoceboClient();
  const certifications = await doceboClient.getCertificationsReport();

  await insertCertification(certifications);
};
