import { Breadcrumbs, Tabs } from "@bmi-digital/components";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { useMarketContext } from "../../../context/MarketContext";
import {
  GalleryItem,
  MediaFolder,
  MediaFolders,
  MediaGalleryState,
  MediaItem,
  MediaTool,
  RootFolders
} from "../../../lib/media/types";
import {
  getMediaAltText,
  getMediaContentType,
  isExternalLink,
  isVimeo
} from "../../../lib/media/utils";
import { MediaGallery } from "../../MediaGallery";
import { MediaGrid } from "../../MediaGrid";

type Props = {
  rootFolders: RootFolders;
  mediaPath: MediaFolders;
  activeMediaId?: string;
  mediaFolder: MediaFolder;
};

const getMediaToolGalleryProps = (
  mediaTool: MediaTool
): Omit<GalleryItem, "title"> => {
  const baseProps = {
    id: mediaTool.sys.id,
    url: mediaTool.url || "",
    description: getMediaAltText(mediaTool),
    mediaItemClass: mediaTool.mediaItemClass
  };
  if (isVimeo(mediaTool)) {
    return { ...baseProps, type: "vimeo" };
  }
  const contentType = getMediaContentType(mediaTool);
  return {
    ...baseProps,
    url: mediaTool?.thumbnail?.url || "",
    fileUrl: mediaTool?.media?.url || "",
    type: contentType.includes("pdf") ? "pdf" : "image"
  };
};

export const MediaPage = ({
  mediaFolder,
  activeMediaId,
  mediaPath,
  rootFolders
}: Props) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { market } = useMarketContext();

  const mediaToolToGalleryItem = useCallback(
    (m: MediaTool): GalleryItem => {
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
    async (mediaFolder: MediaFolder) => {
      if (!mediaFolder?.sys?.id) {
        return;
      }
      setIsNavigating(true);
      await router.push(`/toolkit/${mediaFolder.sys.id}`);
      setIsNavigating(false);
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
    },
    [handleMediaToolClick, navigateToFolder]
  );

  const activeRootFolderId = useMemo(
    () => rootFolders?.find((r) => r.sys.id === mediaPath[0].sys.id)?.sys?.id,
    [mediaPath, rootFolders]
  );

  const items = useMemo(
    () => mediaFolder?.childrenCollection?.items,
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
          optanonClass={market?.optanonClass}
        />
      )}
      <Tabs
        maxWidth={false}
        initialValue={activeRootFolderId}
        onChange={onTabChange}
      >
        {rootFolders?.map((rootFolder) => {
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
                            data-testid="media-path-navigate"
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
