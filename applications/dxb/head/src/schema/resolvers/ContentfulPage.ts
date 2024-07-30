import type { Context, Node, ResolveArgs } from "./types/Gatsby";

const pages = [
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage",
  "ContentfulBrandLandingPage",
  "ContentfulCookiePolicyPage",
  "ContentfulTrainingListerPage",
  "ContentfulTrainingRegistrationPage",
  "ContentfulAccountPage"
] as const;

type ResolveArgsArray = [Node, ResolveArgs, Context];

type Resolver = { resolve: (...args: ResolveArgsArray) => Promise<unknown> };

export default pages.reduce(
  (resolvers, pageName) => ({
    ...resolvers,
    [pageName]: {
      /** Commented as there are two TS errors.
       * This code will be rewritten in the scope of DXB-6398 */
      // path: {
      //   type: "String!",
      //   async resolve(...args: ResolveArgsArray) {
      //     const path = await resolvePath(...args);
      //
      //     return getUrlFromPath(path);
      //   }
      // },
      // breadcrumbs: {
      //   type: ["BreadcrumbItem!"],
      //   resolve(...args: ResolveArgsArray) {
      //     return resolvePath(...args);
      //   }
      // },
      subtitle: {
        type: "String",
        async resolve(source: Node, args: ResolveArgs, context: Context) {
          if (pageName !== "ContentfulSimplePage") {
            return source.subtitle;
          }

          if (!source.subtitle___NODE) {
            return null;
          }

          const longText = await context.nodeModel.getNodeById({
            id: source.subtitle___NODE,
            type: "contentfulSimplePageSubtitleTextNode"
          });

          return longText?.subtitle;
        }
      }
    }
  }),
  {}
) as Record<
  string,
  { path: Resolver; breadcrumbs: Resolver; subtitle: Resolver }
>;
