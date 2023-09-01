import {
  brands as prevBrands,
  doumentBrands as prevDocumentBrands,
  linkIcons as prevLinkIcons,
  brands as prevBrandIcons
} from "../variables/icons/20230817142401.js";

import {
  brands,
  doumentBrands,
  linkIcons
} from "../variables/icons/20230901140205.js";

import type { MigrationFunction } from "contentful-migration";

export const description = "Add SereniCoperture brand for all pages";

export const up: MigrationFunction = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });

  const promo = migration.editContentType("promo");
  promo.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });

  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });

  const page = migration.editContentType("page");
  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });

  const document = migration.editContentType("document");
  document.editField("brand", {
    type: "Symbol",
    validations: [{ in: doumentBrands }]
  });

  const brand = migration.editContentType("brand");
  brand.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });

  const link = migration.editContentType("link");
  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: linkIcons }]
  });
};

export const down: MigrationFunction = (migration) => {
  const document = migration.editContentType("document");
  document.editField("brand", {
    type: "Symbol",
    validations: [{ in: prevDocumentBrands }]
  });

  const page = migration.editContentType("page");
  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrandIcons }]
  });

  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrandIcons }]
  });

  const promo = migration.editContentType("promo");
  promo.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrandIcons }]
  });

  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrandIcons }]
  });

  const link = migration.editContentType("link");
  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: prevLinkIcons }]
  });

  const brand = migration.editContentType("brand");
  brand.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
};
