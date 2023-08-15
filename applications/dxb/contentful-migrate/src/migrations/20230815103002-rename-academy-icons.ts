import {
  brands as prevBrands,
  linkIcons as prevLinkIcons
} from "../variables/icons/20221208120944.js";
import { brands, linkIcons } from "../variables/icons/20230815103002.js";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Rename BMI_Academy_EN to BMIAcademyEN and BMI_Academy_DE to BMIAcademyDE";

export const up: MigrationFunction = async (migration, context) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });
  migration.transformEntries({
    contentType: "brandLandingPage",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMI_Academy_EN") {
        return { brandLogo: "BMIAcademyEN" };
      } else if (brandLogo === "BMI_Academy_DE") {
        return { brandLogo: "BMIAcademyDE" };
      }
      return undefined;
    }
  });

  const promo = migration.editContentType("promo");
  promo.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });
  migration.transformEntries({
    contentType: "promo",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMI_Academy_EN") {
        return { brandLogo: "BMIAcademyEN" };
      } else if (brandLogo === "BMI_Academy_DE") {
        return { brandLogo: "BMIAcademyDE" };
      }
      return undefined;
    }
  });

  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });
  migration.transformEntries({
    contentType: "productListerPage",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMI_Academy_EN") {
        return { brandLogo: "BMIAcademyEN" };
      } else if (brandLogo === "BMI_Academy_DE") {
        return { brandLogo: "BMIAcademyDE" };
      }
      return undefined;
    }
  });

  const page = migration.editContentType("page");
  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });
  migration.transformEntries({
    contentType: "page",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMI_Academy_EN") {
        return { brandLogo: "BMIAcademyEN" };
      } else if (brandLogo === "BMI_Academy_DE") {
        return { brandLogo: "BMIAcademyDE" };
      }
      return undefined;
    }
  });

  const brand = migration.editContentType("brand");
  brand.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: brands }]
  });
  migration.transformEntries({
    contentType: "brand",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMI_Academy_EN") {
        return { brandLogo: "BMIAcademyEN" };
      } else if (brandLogo === "BMI_Academy_DE") {
        return { brandLogo: "BMIAcademyDE" };
      }
      return undefined;
    }
  });

  const link = migration.editContentType("link");
  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: linkIcons }]
  });
  migration.transformEntries({
    contentType: "link",
    from: ["icon"],
    to: ["icon"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const icon = fromFields.icon?.[currentLocale];
      if (icon === "BMI_Academy_EN") {
        return { icon: "BMIAcademyEN" };
      } else if (icon === "BMI_Academy_DE") {
        return { icon: "BMIAcademyDE" };
      }
      return undefined;
    }
  });
};

export const down: MigrationFunction = async (migration, context) => {
  const page = migration.editContentType("page");
  page.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
  migration.transformEntries({
    contentType: "page",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMIAcademyEN") {
        return { brandLogo: "BMI_Academy_EN" };
      } else if (brandLogo === "BMIAcademyDE") {
        return { brandLogo: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });

  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
  migration.transformEntries({
    contentType: "productListerPage",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMIAcademyEN") {
        return { brandLogo: "BMI_Academy_EN" };
      } else if (brandLogo === "BMIAcademyDE") {
        return { brandLogo: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });

  const promo = migration.editContentType("promo");
  promo.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
  migration.transformEntries({
    contentType: "promo",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMIAcademyEN") {
        return { brandLogo: "BMI_Academy_EN" };
      } else if (brandLogo === "BMIAcademyDE") {
        return { brandLogo: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });

  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
  migration.transformEntries({
    contentType: "brandLandingPage",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMIAcademyEN") {
        return { brandLogo: "BMI_Academy_EN" };
      } else if (brandLogo === "BMIAcademyDE") {
        return { brandLogo: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });

  const brand = migration.editContentType("brand");
  brand.editField("brandLogo", {
    type: "Symbol",
    validations: [{ in: prevBrands }]
  });
  migration.transformEntries({
    contentType: "brand",
    from: ["brandLogo"],
    to: ["brandLogo"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const brandLogo = fromFields.brandLogo?.[currentLocale];
      if (brandLogo === "BMIAcademyEN") {
        return { brandLogo: "BMI_Academy_EN" };
      } else if (brandLogo === "BMIAcademyDE") {
        return { brandLogo: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });

  const link = migration.editContentType("link");
  link.editField("icon", {
    type: "Symbol",
    validations: [{ in: prevLinkIcons }]
  });
  migration.transformEntries({
    contentType: "link",
    from: ["icon"],
    to: ["icon"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const icon = fromFields.icon?.[currentLocale];
      if (icon === "BMIAcademyEN") {
        return { icon: "BMI_Academy_EN" };
      } else if (icon === "BMIAcademyDE") {
        return { icon: "BMI_Academy_DE" };
      }
      return undefined;
    }
  });
};
