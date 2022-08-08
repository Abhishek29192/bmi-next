// TODO: supporting media carousel will need refactoring for navigation
import React from "react";
import { useTranslation } from "next-i18next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../../components/Layout";
import { GlobalPageProps, withPage } from "../../lib/middleware/withPage";
import {
  getServerPageGetMediaFolders,
  getServerPageGetMediaFolderContents
} from "../../graphql/generated/page";
import can from "../../lib/permissions/can";
import {
  ErrorStatusCode,
  generatePageError,
  withPageError
} from "../../lib/error";
import { MediaFolders, RootFolders } from "../../lib/media/types";
import { getRootFolders, getMediaItemPath } from "../../lib/media/utils";
import { GetMediaFolderContentsQuery } from "../../graphql/generated/operations";
import { MediaPage } from "../../components/Pages/Media";
import { parseMarketTag } from "../../lib/utils";

type ToolkitPageProps = GlobalPageProps & {
  rootFolders: RootFolders;
  mediaPath?: MediaFolders;
  activeMediaId?: string;
  mediaFolder: GetMediaFolderContentsQuery["mediaFolderCollection"]["items"][0];
};

const Toolkit = ({
  rootFolders,
  mediaPath,
  activeMediaId,
  mediaFolder,
  globalPageData
}: ToolkitPageProps) => {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("Tools")} pageData={globalPageData}>
      <MediaPage
        rootFolders={rootFolders}
        mediaPath={mediaPath}
        activeMediaId={activeMediaId}
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
    const translations = await serverSideTranslations(locale, [
      "common",
      "toolkit",
      "error-page"
    ]);

    if (!can(account, "page", "mediaLibrary")) {
      const statusCode = ErrorStatusCode.UNAUTHORISED;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    const marketDomain = account.market?.domain;
    const contentfulTag = parseMarketTag(marketDomain);

    const {
      props: { data }
    } = await getServerPageGetMediaFolders(
      { variables: { tag: contentfulTag } },
      apolloClient
    );

    const rootFolders = getRootFolders(data);
    const allFolders = data.mediaFolderCollection.items;

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
      return {
        props: {
          rootFolders,
          mediaPath: [],
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
          }
        }
      }
    } = await getServerPageGetMediaFolderContents(
      { variables: { mediaFolderId, tag: contentfulTag } },
      apolloClient
    );
    // folder not found
    if (!mediaFolder) {
      const statusCode = ErrorStatusCode.NOT_FOUND;
      res.statusCode = statusCode;
      return generatePageError(
        statusCode,
        {},
        { globalPageData, ...translations }
      );
    }

    // TODO: pass active mediaTool & redirect to folder if mediaTool does not exist
    return {
      props: {
        rootFolders,
        mediaPath: getMediaItemPath(mediaFolder, allFolders, rootFolders),
        mediaFolder: mediaFolder,
        mediaTool: null,
        ...translations
      }
    };
  }
);

export default withPageAuthRequired(withPageError(Toolkit));
