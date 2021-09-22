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
import { isExternalLink } from "../../../lib/media/utils";
import { MediaGrid } from "../../MediaGrid";
import { MediaToolDialog } from "../../MediaTool/Dialog";

type Props = {
  rootFolders: RootFolders;
  mediaPath: MediaFolders;
  mediaTool: MediaTool;
  mediaFolder: MediaFolder;
};

export const MediaPage = ({
  mediaFolder,
  mediaTool,
  mediaPath,
  rootFolders
}: Props) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToMediaItem = useCallback(
    (mediaItem: MediaItem) => {
      if (isExternalLink(mediaItem)) {
        // externalLinks are anchor elements that do not need the loading effect nor next.js routing
        return;
      }
      setIsNavigating(true);

      router.push(`/toolkit/${mediaItem.sys.id}`).then(() => {
        setIsNavigating(false);
      });
    },
    [router, setIsNavigating]
  );

  const activeRootFolderId = rootFolders.find(
    (r) => r.sys.id === mediaPath[0].sys.id
  )?.sys?.id;

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
      <MediaToolDialog
        isOpen={!!mediaTool}
        mediaTool={mediaTool}
        handleClose={() => {
          navigateToMediaItem(mediaFolder);
        }}
      />
      <Tabs
        maxWidth={false}
        initialValue={activeRootFolderId}
        onChange={(clickedFolderId) => {
          navigateToMediaItem(
            rootFolders.find((f) => f.sys.id === clickedFolderId)
          );
        }}
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
                              navigateToMediaItem(folder);
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
                onMediaItemClick={navigateToMediaItem}
              />
            </Tabs.TabPanel>
          );
        })}
      </Tabs>
    </>
  );
};
