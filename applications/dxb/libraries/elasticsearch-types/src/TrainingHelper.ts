import { Training } from "./types";

export const createTraining = (training: Partial<Training> = {}): Training => ({
  id: "training-id",
  courseId: 1,
  name: "training name",
  code: "training code",
  slug: "training-slug",
  courseType: "classroom",
  imgUrl: "https://fake-image.png",
  category: "Pitched",
  catalogueId: "1",
  catalogueName: "Catalogue name",
  catalogueDescription: "Catalogue description",
  onSale: false,
  startDate: "2023-12-29 00:00:00",
  price: "100",
  currency: "EUR",
  currencySymbol: "€",
  ...training
});
