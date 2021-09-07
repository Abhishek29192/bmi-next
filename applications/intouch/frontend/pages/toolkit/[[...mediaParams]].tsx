import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import {
  getServerPageGetMediaFolderContents,
  getServerPageGetMediaFolders
} from "../../graphql/generated/page";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import {
  getRootFolders,
  MediaFolders,
  RootFolders,
  getMediaItemPath
} from "../../lib/media/folderUtils";
import { GetMediaFolderContentsQuery } from "../../graphql/generated/operations";
import { MediaPage } from "../../components/Pages/Media";

type ToolkitPageProps = GlobalPageProps & {
  allFolders: MediaFolders;
  rootFolders: RootFolders;
  mediaPath?: MediaFolders;
  currentFolder: GetMediaFolderContentsQuery["mediaFolder"];
  mediaFolderId?: string;
};

const Toolkit = ({
  rootFolders,
  mediaPath,
  currentFolder,
  globalPageData
}: ToolkitPageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Media Tools")} pageData={globalPageData}>
      <MediaPage
        rootFolders={rootFolders}
        mediaPath={mediaPath}
        folder={currentFolder}
      />
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({
    apolloClient,
    globalPageData,
    locale,
    params: { mediaParams },
    res
  }) => {
    const {
      props: { data }
    } = await getServerPageGetMediaFolders({}, apolloClient);

    const rootFolders = getRootFolders(data);

    const mediaFolderId = mediaParams?.[0];

    // show the first root folder by default
    if (!mediaFolderId && rootFolders.length > 0) {
      return {
        redirect: {
          permanent: false,
          destination: `/toolkit/${rootFolders[0].sys.id}`
        }
      };
    }
    if (!mediaFolderId && rootFolders.length === 0) {
      // TODO: page without media folders
    }

    const {
      props: {
        data: { mediaFolder: currentFolder }
      }
    } = await getServerPageGetMediaFolderContents(
      {
        variables: { folderId: mediaFolderId }
      },
      apolloClient
    );

    // TODO: handle media tool instead of MediaFolder
    if (!currentFolder) {
      const statusCode = ErrorStatusCode.NOT_FOUND;
      res.statusCode = statusCode;
      return generatePageError(statusCode, {}, { globalPageData });
    }

    const allFolders = data.mediaFolderCollection.items;
    const mediaPath = getMediaItemPath(currentFolder, allFolders, rootFolders);

    return {
      props: {
        rootFolders,
        mediaPath,
        mediaFolderId,
        currentFolder,
        ...(await serverSideTranslations(locale, ["common", "toolkit"]))
      }
    };
  }
);

export default withPageAuthRequired(withPageError(Toolkit));
