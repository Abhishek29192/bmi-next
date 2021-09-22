// TODO: supporting media carousel will need refactoring for navigation
import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import {
  getServerPageGetMediaItemById,
  getServerPageGetMediaFolders
} from "../../graphql/generated/page";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import { MediaFolders, RootFolders } from "../../lib/media/types";
import {
  getRootFolders,
  getMediaItemPath,
  getParentFolder
} from "../../lib/media/utils";
import { GetMediaItemByIdQuery } from "../../graphql/generated/operations";
import { MediaPage } from "../../components/Pages/Media";

type ToolkitPageProps = GlobalPageProps & {
  rootFolders: RootFolders;
  mediaPath?: MediaFolders;
  mediaTool: GetMediaItemByIdQuery["mediaToolCollection"]["items"][0];
  mediaFolder: GetMediaItemByIdQuery["mediaFolderCollection"]["items"][0];
};

const Toolkit = ({
  rootFolders,
  mediaPath,
  mediaTool,
  mediaFolder,
  globalPageData
}: ToolkitPageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Media Tools")} pageData={globalPageData}>
      <MediaPage
        rootFolders={rootFolders}
        mediaPath={mediaPath}
        mediaTool={mediaTool}
        mediaFolder={mediaFolder}
      />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({
    account,
    apolloClient,
    globalPageData,
    locale,
    params: { mediaParams },
    res
  }) => {
    if (!can(account, "page", "mediaLibrary")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    const {
      props: { data }
    } = await getServerPageGetMediaFolders({}, apolloClient);

    const rootFolders = getRootFolders(data);
    const allFolders = data.mediaFolderCollection.items;

    const mediaItemId = mediaParams?.[0];

    // show the first root folder by default
    if (!mediaItemId && rootFolders.length > 0) {
      return {
        redirect: {
          permanent: false,
          destination: `/toolkit/${rootFolders[0].sys.id}`
        }
      };
    }

    const translations = await serverSideTranslations(locale, [
      "common",
      "toolkit"
    ]);

    if (!mediaItemId && rootFolders.length === 0) {
      return {
        props: {
          rootFolders,
          mediaPath: [],
          mediaItemId,
          mediaFolder: null,
          ...translations
        }
      };
    }
    // At this point we have a mediaFolderId, so we verify the entry exists in Contentful
    const {
      props: {
        data: {
          mediaFolderCollection: {
            items: [mediaFolder]
          },
          mediaToolCollection: {
            items: [mediaTool]
          }
        }
      }
    } = await getServerPageGetMediaItemById(
      {
        variables: { mediaItemId }
      },
      apolloClient
    );

    if (!mediaFolder && !mediaTool) {
      const statusCode = ErrorStatusCode.NOT_FOUND;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    if (mediaFolder) {
      const mediaPath = getMediaItemPath(mediaFolder, allFolders, rootFolders);

      return {
        props: {
          rootFolders,
          mediaPath,
          mediaFolder: mediaFolder,
          mediaTool: null,
          ...translations
        }
      };
    }
    // at this point the media item is a Media Tool (not a folder)
    return {
      props: {
        rootFolders,
        mediaTool,
        // TODO: parent folder info is shallow atm
        mediaFolder: getParentFolder(mediaTool, allFolders),
        mediaPath: getMediaItemPath(mediaTool, allFolders, rootFolders),
        ...translations
      }
    };
  }
);

export default withPageAuthRequired(withPageError(Toolkit));
