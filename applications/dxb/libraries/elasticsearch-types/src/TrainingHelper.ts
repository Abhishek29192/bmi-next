import { Training } from "./types";

export const createTraining = (training: Partial<Training> = {}): Training => ({
  id: "training-id",
  sessionId: 1,
  sessionName: "session name",
  sessionSlug: "session-slug",
  courseId: 1,
  courseName: "training name",
  courseCode: "training code",
  courseSlug: "training-slug",
  courseType: "classroom",
  courseImg: "https://fake-image.png",
  category: "Pitched",
  catalogueId: "1",
  catalogueName: "Catalogue name",
  catalogueDescription: "Catalogue description",
  onSale: false,
  startDate: 1703800800000,
  endDate: 1735423200000,
  price: 100,
  currency: "EUR",
  currencySymbol: "€",
  ...training
});
