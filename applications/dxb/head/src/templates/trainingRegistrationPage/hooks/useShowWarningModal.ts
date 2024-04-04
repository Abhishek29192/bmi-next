import { microCopy } from "@bmi/microcopies";
import { globalHistory, useLocation } from "@reach/router";
import { useEffect, useState } from "react";
import { useSiteContext } from "../../../components/Site";
import { FormStatus } from "../types";
import type { HistoryLocation } from "@reach/router";

export type UseShowWarningModalData = { formStatus: FormStatus };

export type UseShowWarningModal = (data: UseShowWarningModalData) => {
  closeWarningDialog: () => void;
  blockedLocation?: HistoryLocation;
};

export const useShowWarningModal: UseShowWarningModal = ({ formStatus }) => {
  const currentLocation = useLocation();
  const [blockedLocation, setBlockedLocation] = useState<
    HistoryLocation | undefined
  >(undefined);
  const { getMicroCopy } = useSiteContext();

  useEffect(() => {
    if (blockedLocation || formStatus === FormStatus.Initialized) {
      return;
    }

    //Used to block the navigation when a user clicks on any links
    const unsubscribe = globalHistory.listen(({ location }) => {
      setBlockedLocation(location);
      //unsubscribe() is needed to not get an infinite loop when globalHistory.navigate() on the next line gets called
      unsubscribe();

      //Keeps the user on the same URL
      history.replaceState(null, "", currentLocation.href);

      //Needed to keep the correct order of locations in the history stack
      globalHistory.navigate(-1);
      history.replaceState(location.state, "", location.href);
    });

    return () => unsubscribe();
  }, [blockedLocation, currentLocation, formStatus]);

  useEffect(() => {
    if (formStatus === FormStatus.Initialized) {
      return;
    }

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      //Some browsers require the text to be explicitly defined
      //Otherwise the dialog will not be shown
      event.returnValue = getMicroCopy(
        microCopy.TRAINING_REGISTRATION_WARNING_POPUP_TITLE
      );
      setBlockedLocation(undefined);
      return getMicroCopy(microCopy.TRAINING_REGISTRATION_WARNING_POPUP_TITLE);
    };

    //Used to block the navigation when a user refreshes the page or navigates using prev/next buttons
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formStatus]);

  const closeWarningDialog = () => {
    setBlockedLocation(undefined);
  };

  return { closeWarningDialog, blockedLocation };
};
