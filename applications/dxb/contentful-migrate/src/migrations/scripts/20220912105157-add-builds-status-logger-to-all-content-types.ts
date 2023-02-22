import { getAllContentTypes, getApp } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add build status logger app to all content types";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const allContentTypes = await getAllContentTypes(context!.makeRequest);

  const buildsLoggerApp = await getApp(
    { name: "Build Status Logger" },
    context!
  );

  let appId = "";
  if (buildsLoggerApp) {
    const { sys } = buildsLoggerApp;
    appId = sys.id;
  }

  if (appId) {
    allContentTypes.items
      .filter((ctype: any) => ctype.sys.id !== "migration")
      .forEach((ct: any) => {
        const migrationContentType = migration.editContentType(ct.sys.id);

        migrationContentType.addSidebarWidget("app", appId);
      });
  }
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const allContentTypes = await getAllContentTypes(context!.makeRequest);
  const buildsLoggerApp = await getApp(
    { name: "Build Status Logger" },
    context!
  );
  let appId = "";
  if (buildsLoggerApp) {
    const { sys } = buildsLoggerApp;
    appId = sys.id;
  }
  if (appId) {
    allContentTypes.items
      .filter((ctype: any) => ctype.sys.id !== "migration")
      .forEach((ct: any) => {
        const migrationContentType = migration.editContentType(ct.sys.id);
        migrationContentType.removeSidebarWidget("app", appId);
      });
  }
};
