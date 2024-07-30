import type {
  ContentfulAssetNode,
  ContentfulImageNode,
  TrainingListerPage
} from "./types/Contentful";
import type { Context, ResolveArgs } from "./types/Gatsby";
import type { Path } from "./utils/path";
import type { GatsbyTrainingNode } from "./types/Docebo";

export const getTrainingListerPage = async (
  context: Context
): Promise<TrainingListerPage> => {
  const marketFilters = process.env.MARKET_TAG_NAME
    ? {
        metadata: {
          tags: {
            elemMatch: {
              contentful_id: {
                eq: process.env.MARKET_TAG_NAME
              }
            }
          }
        }
      }
    : {};

  return context.nodeModel.findOne<TrainingListerPage>({
    query: {
      filter: marketFilters
    },
    type: "ContentfulTrainingListerPage"
  });
};

const resolveTrainingListerPagePath = async (
  args: ResolveArgs,
  context: Context
): Promise<Path> => {
  const trainingListerPage = await getTrainingListerPage(context);

  if (!trainingListerPage) {
    return [];
  }

  /** Commented as there is a TS error.
   * This code will be rewritten in the scope of DXB-6407*/
  // return resolvePath(trainingListerPage, args, context);
};

export default {
  breadcrumbs: {
    async resolve(
      source: GatsbyTrainingNode,
      args: ResolveArgs,
      context: Context
    ) {
      const breadcrumbs = await resolveTrainingListerPagePath(args, context);
      return breadcrumbs.concat({
        id: source.id_course.toString(),
        label: source.name,
        slug: source.slug_name
      });
    }
  },
  img_url: {
    async resolve(
      source: GatsbyTrainingNode,
      _args: ResolveArgs,
      context: Context
    ) {
      if (source.img_url) {
        return source.img_url;
      }

      const trainingListerPage = await getTrainingListerPage(context);
      const featuredMedia =
        await context.nodeModel.getNodeById<ContentfulImageNode>({
          type: "ContentfulImage",
          id: trainingListerPage.featuredMedia___NODE
        });

      const asset =
        featuredMedia &&
        (await context.nodeModel.getNodeById<ContentfulAssetNode>({
          type: "ContentfulAsset",
          id: featuredMedia.image___NODE
        }));
      return asset?.file.url;
    }
  }
};
