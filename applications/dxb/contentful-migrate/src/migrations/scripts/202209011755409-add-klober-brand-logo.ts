import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";
import prevDocumentBrands from "../../variables/icons/20210512134828";
import { brands as prevBrandIcons } from "../../variables/icons/20210803135831";
import prevLinkIcons, {
  brands as prevBrands
} from "../../variables/icons/20220404105849";
import {
  brands,
  doumentBrands,
  linkIcons
} from "../../variables/icons/20220901175540";

export const description = "Add Klober brand for all pages";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
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
