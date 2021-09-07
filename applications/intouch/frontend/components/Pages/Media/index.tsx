import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "@bmi/breadcrumbs";
import Tabs from "@bmi/tabs";
import { MediaFolders, RootFolders } from "../../../lib/media/folderUtils";
import { GetMediaFolderContentsQuery } from "../../../graphql/generated/operations";
import { MediaGrid } from "../../MediaGrid";

type Props = {
  rootFolders: RootFolders;
  mediaPath: MediaFolders;
  folder: GetMediaFolderContentsQuery["mediaFolder"];
};

export const MediaPage = ({ folder, mediaPath, rootFolders }: Props) => {
  const router = useRouter();
  const activeRootFolderId = rootFolders.find(
    (r) => r.sys.id === mediaPath[0].sys.id
  )?.sys?.id;

  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToMediaItem = useCallback((mediaItemId: string) => {
    setIsNavigating(true);

    router.push(`/toolkit/${mediaItemId}`).then(() => {
      setIsNavigating(false);
    });
  }, []);

  const items = useMemo(() => folder.childrenCollection.items, [folder]);

  return (
    <Tabs
      maxWidth={false}
      initialValue={activeRootFolderId}
      onChange={(clickedFolderId) => {
        navigateToMediaItem(clickedFolderId);
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
                          role="button"
                          onClick={() => {
                            navigateToMediaItem(folder.sys.id);
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
              totalNumItems={folder.childrenCollection.total}
              onMediaItemClick={navigateToMediaItem}
            />
          </Tabs.TabPanel>
        );
      })}
    </Tabs>
  );
};
