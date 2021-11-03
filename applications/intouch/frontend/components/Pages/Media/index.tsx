import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "@bmi/breadcrumbs";
import Tabs from "@bmi/tabs";
import {
  MediaTool,
  MediaFolder,
  MediaFolders,
  RootFolders,
  MediaItem
} from "../../../lib/media/types";
import {
  getMediaContentType,
  getMediaAltText,
  isExternalLink,
  isVimeo
} from "../../../lib/media/utils";
import log from "../../../lib/logger";
import { MediaGrid } from "../../MediaGrid";
import { GalleryItem, MediaGallery } from "../../MediaGallery";

type Props = {
  rootFolders: RootFolders;
  mediaPath: MediaFolders;
  activeMediaId?: string;
  mediaFolder: MediaFolder;
};

type MediaGalleryState = {
  isOpen: boolean;
  activeItem: GalleryItem;
};

const getMediaToolGalleryProps = (
  mediaTool: MediaTool
): Omit<GalleryItem, "title"> => {
  const baseProps = {
    id: mediaTool.sys.id,
    url: mediaTool.url || "",
    description: getMediaAltText(mediaTool)
  };
  if (isVimeo(mediaTool)) {
    return { ...baseProps, type: "vimeo" };
  }
  const contentType = getMediaContentType(mediaTool);
  if (contentType.includes("pdf")) {
    return {
      ...baseProps,
      type: "pdf"
    };
  }
  return { ...baseProps, type: "image" };
};

export const MediaPage = ({
  mediaFolder,
  activeMediaId,
  mediaPath,
  rootFolders
}: Props) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const mediaToolToGalleryItem = useCallback(
    (m: MediaTool): GalleryItem => {
      if (!m) {
        return null;
      }
      return {
        ...getMediaToolGalleryProps(m),
        title: `${mediaFolder.name} / ${m.name}`
      };
    },
    [mediaFolder]
  );
  const mediaFolderGalleryItems = useMemo(
    () =>
      (
        mediaFolder.childrenCollection.items.filter(
          (item) =>
            item.__typename === "MediaTool" && (item.media || isVimeo(item))
        ) as MediaTool[]
      ).map(mediaToolToGalleryItem),
    [mediaFolder]
  );

  const [modalInfo, setModalInfo] = useState<MediaGalleryState>({
    isOpen: !!activeMediaId,
    activeItem: mediaFolderGalleryItems.find(
      (item) => item.id === activeMediaId
    )
  });

  const closeModal = useCallback(() => {
    setModalInfo((state) => ({
      ...state,
      isOpen: false,
      activeItem: null
    }));
    // TODO: reset the url
  }, [setModalInfo]);

  const handleMediaToolClick = useCallback(
    (mediaTool: MediaTool) => {
      if (isExternalLink(mediaTool)) {
        // externalLinks are anchor elements that open in a new tab
        return;
      }
      setModalInfo((state) => ({
        ...state,
        isOpen: true,
        activeItem: mediaToolToGalleryItem(mediaTool)
      }));
      // TODO: shallow navigation - update url with query params to open media tool by id
    },
    [setModalInfo]
  );

  const navigateToFolder = useCallback(
    (mediaFolder: MediaFolder) => {
      if (!mediaFolder?.sys?.id) {
        return;
      }
      setIsNavigating(true);
      router.push(`/toolkit/${mediaFolder.sys.id}`).then(() => {
        setIsNavigating(false);
      });
    },
    [router, setIsNavigating]
  );

  const onTabChange = useCallback(
    (clickedFolderId) => {
      navigateToFolder(rootFolders.find((f) => f.sys.id === clickedFolderId));
    },
    [navigateToFolder, rootFolders]
  );

  const onMediaItemClick = useCallback(
    (mediaItem: MediaItem) => {
      if (mediaItem.__typename === "MediaTool") {
        return handleMediaToolClick(mediaItem as MediaTool);
      }
      if (mediaItem.__typename === "MediaFolder") {
        return navigateToFolder(mediaItem);
      }
      log({
        severity: "ERROR",
        message: `Unknown mediaItem __typename: ${JSON.stringify(
          mediaItem,
          null,
          2
        )}`
      });
    },
    [handleMediaToolClick, navigateToFolder]
  );

  const activeRootFolderId = useMemo(
    () => rootFolders.find((r) => r.sys.id === mediaPath[0].sys.id)?.sys?.id,
    [mediaPath, rootFolders]
  );

  const items = useMemo(
    () => mediaFolder?.childrenCollection?.items || [],
    [mediaFolder]
  );

  // TODO: there is currently no design for this
  if (!rootFolders) {
    <p>There is no content yet</p>;
  }

  return (
    <>
      {modalInfo.activeItem && (
        <MediaGallery
          isOpen={modalInfo.isOpen}
          activeItem={modalInfo.activeItem}
          items={mediaFolderGalleryItems}
          onClose={closeModal}
        />
      )}
      <Tabs
        maxWidth={false}
        initialValue={activeRootFolderId}
        onChange={onTabChange}
      >
        {rootFolders.map((rootFolder) => {
          const rootFolderId = rootFolder.sys.id;
          return (
            <Tabs.TabPanel
              heading={rootFolder.name}
              index={rootFolderId}
              key={rootFolderId}
            >
              {mediaPath.length > 1 && (
                <Breadcrumbs>
                  {mediaPath.map((folder, idx) => {
                    const isLastItem = idx === mediaPath.length - 1;

                    return (
                      <Breadcrumbs.Item
                        key={idx}
                        // if we don't pass a non-null action, the Breadcrumbs component
                        // will filter out all items except for the last one
                        action={isLastItem ? null : {}}
                      >
                        {isLastItem ? (
                          folder.name
                        ) : (
                          // not using a button as it gives different styling
                          // not using the <Link> in order to trigger the loading effect
                          <div
                            aria-role="button"
                            role="button"
                            onClick={() => {
                              navigateToFolder(folder);
                            }}
                          >
                            {folder.name}
                          </div>
                        )}
                      </Breadcrumbs.Item>
                    );
                  })}
                </Breadcrumbs>
              )}
              <MediaGrid
                isLoading={isNavigating}
                items={items}
                // one day the media query could be paginated and items.length would not equal totalNumItems
                totalNumItems={mediaFolder.childrenCollection.total}
                onMediaItemClick={onMediaItemClick}
              />
            </Tabs.TabPanel>
          );
        })}
      </Tabs>
    </>
  );
};
