import { Context, Node, ResolveArgs } from "./types/Gatsby";
import { getUrlFromPath, resolvePath } from "./utils/path";

const pages = [
  "ContentfulSimplePage",
  "ContentfulContactUsPage",
  "ContentfulProductListerPage",
  "ContentfulDocumentLibraryPage",
  "ContentfulBrandLandingPage"
] as const;

type ResolveArgsArray = [Node, ResolveArgs, Context];

type Resolver = { resolve: (...args: ResolveArgsArray) => Promise<unknown> };

export default pages.reduce(
  (resolvers, pageName) => ({
    ...resolvers,
    [pageName]: {
      path: {
        async resolve(...args: ResolveArgsArray) {
          const path = await resolvePath(...args);

          return getUrlFromPath(path);
        }
      },
      breadcrumbs: {
        resolve(...args: ResolveArgsArray) {
          return resolvePath(...args);
        }
      },
      subtitle: {
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

          return longText.subtitle;
        }
      }
    }
  }),
  {}
) as Record<
  string,
  { path: Resolver; breadcrumbs: Resolver; subtitle: Resolver }
>;
