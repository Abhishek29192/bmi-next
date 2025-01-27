import Button from "@bmi-digital/components/button";
import { useIsClient } from "@bmi-digital/components/hooks";
import HeaderComponent from "@bmi-digital/components/header";
import IconButton from "@bmi-digital/components/icon-button";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import { RegionCode } from "@bmi-digital/components/language-selection";
import { microCopy } from "@bmi/microcopies";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import Toast from "@bmi-digital/components/toast";
import AuthService from "../auth/service";
import { useConfig } from "../contexts/ConfigProvider";
import { useBasketContext } from "../contexts/SampleBasketContext";
import useAuth from "../hooks/useAuth";
import { constructUrlWithPrevPage } from "../templates/myAccountPage/utils";
import { checkIfActiveLabelInParentNode } from "../utils/breadcrumbUtils";
import { pushToDataLayer, useGTM } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { stringifyToObject } from "../utils/createActionLabelForAnalytics";
import { convertStrToBool } from "../utils/convertStrToBool";
import Image from "./image/Image";
import Icon from "./Icon";
import RichText from "./RichText";
import SampleBasketDialog from "./SampleBasketDialog";
import { useSiteContext } from "./Site";
import { getCTA } from "./link/utils";
import type { MicroCopyValues } from "@bmi/microcopies";
import type { ToastProps } from "@bmi-digital/components/toast";
import type { RichTextData } from "./RichText";
import type { IconButtonProps } from "@bmi-digital/components/icon-button";
import type { HeaderProps } from "@bmi-digital/components/header";
import type { ButtonProps } from "@bmi-digital/components/button";
import type { Data as SiteData } from "./Site";
import type { Data as PageInfoData } from "./PageInfo";
import type {
  Data as LinkData,
  NavigationData,
  NavigationItem
} from "./link/types";
import type { GetMicroCopy } from "./MicroCopy";
import type { NavigationList } from "@bmi-digital/components/navigation";
import type { Data as PromoData } from "./Promo";
import type { ImageWidths } from "./image/types";

type ParseNavigationProps = {
  navigationItems: (NavigationData | NavigationItem | LinkData)[];
  countryCode: string;
  getMicroCopy: GetMicroCopy;
  isClient?: boolean;
};

type GetPromoSectionProps = {
  promo: PromoData | PageInfoData;
  countryCode: SiteData["countryCode"];
  getMicroCopy: GetMicroCopy;
};

const promoSectionMediaWidths: ImageWidths = [359, 359, 359, 326, 359];

const getPromoSection = (props: GetPromoSectionProps) => {
  const { promo, countryCode, getMicroCopy } = props;
  const ctaLabelMicroCopy = getMicroCopy(microCopy.PAGE_LINK_LABEL);
  const cta = getCTA(promo, countryCode, ctaLabelMicroCopy);

  const label =
    promo.__typename === "Promo" ? promo.title || promo.name : promo.title;

  const ctaLabel =
    (promo.__typename === "Promo" && promo.cta?.label) || ctaLabelMicroCopy;

  return [
    ...(promo.featuredMedia
      ? [
          {
            label,
            image: (
              <Image
                {...promo.featuredMedia}
                widths={promoSectionMediaWidths}
              />
            )
          }
        ]
      : []),
    { label, isHeading: true },
    ...(promo.subtitle ? [{ label: promo.subtitle, isParagraph: true }] : []),
    ...(cta
      ? [
          {
            label: ctaLabel,
            action: cta
          }
        ]
      : [])
  ];
};

const useHeaderAuthData = () => {
  const { isLoginEnabled } = useConfig();
  const { isLoggedIn, profile } = useAuth();
  const { getMicroCopy, accountPage, countryCode } = useSiteContext();

  const authHeaderProps: HeaderProps["auth"] = useMemo(() => {
    if (!isLoginEnabled || !accountPage) {
      return;
    }

    return {
      isLoggedIn: Boolean(isLoggedIn && profile),
      myAccountBtnLabel: getMicroCopy(microCopy.MY_ACCOUNT_LABEL),
      myAccountBtnAction: {
        href: getPathWithCountryCode(countryCode, accountPage?.slug),
        component: NextLink
      },
      loginBtnLabel: getMicroCopy(microCopy.LOG_IN_LABEL_BTN),
      loginButtonAction: { onClick: AuthService.login },
      logoutBtnLabel: getMicroCopy(microCopy.LOG_OUT_LABEL_BTN),
      logoutButtonAction: { onClick: AuthService.logout }
    };
  }, [
    isLoggedIn,
    profile,
    getMicroCopy,
    isLoginEnabled,
    accountPage,
    countryCode
  ]);

  return authHeaderProps;
};

const parseNavigation = ({
  navigationItems,
  countryCode,
  getMicroCopy,
  isClient
}: ParseNavigationProps): NavigationList[] => {
  if (!navigationItems || navigationItems.length === 0) {
    return [];
  }

  return navigationItems.reduce((result, { __typename, ...item }) => {
    if (__typename === "Navigation") {
      const { label, links, link, promos } = item as NavigationData;

      const navItem = {
        label,
        menu: parseNavigation({
          navigationItems: link ? [link, ...links] : links,
          countryCode,
          getMicroCopy,
          isClient
        }),
        ...(promos &&
          promos.length && {
            footer: promos.flatMap((promo) =>
              getPromoSection({ promo, countryCode, getMicroCopy })
            )
          }),
        gtm: {
          id: "nav-main-menu",
          label: label
        }
      };

      return result.concat(navItem);
    }

    if (__typename === "NavigationItem") {
      const { value, type } = item as NavigationItem;

      if (type === "Heading") {
        return result.concat({
          label: value,
          isLabelHidden: false,
          isHeading: true
        });
      }

      if (type === "Separator") {
        if (result.length === 0) {
          return result;
        }
        const lastItem = result[result.length - 1];
        result[result.length - 1] = { ...lastItem, hasSeparator: true };
        return result;
      }
    }

    if (__typename === "Link") {
      let action;

      const {
        label,
        isLabelHidden,
        icon: iconName,
        linkedPage,
        url
      } = item as LinkData;

      if (linkedPage) {
        action = {
          href: getPathWithCountryCode(countryCode, linkedPage.path),
          component: NextLink
        };
      } else if (url) {
        const href =
          isClient &&
          process.env.NEXT_PUBLIC_INTOUCH_ORIGIN &&
          url.includes(process.env.NEXT_PUBLIC_INTOUCH_ORIGIN)
            ? constructUrlWithPrevPage(url)
            : url;
        action = {
          href
        };
      }

      return result.concat({
        label,
        ...(iconName && { icon: <Icon name={iconName} /> }),
        isLabelHidden,
        action,
        gtm: {
          id: "nav-main-menu",
          label: label,
          action: action?.href
        }
      });
    }

    return result;
  }, []);
};

const onCountrySelection = (label: string, code: string) =>
  pushToDataLayer({ id: "nav-country-selector", label: label, action: code });

export type Region = {
  label: string;
  regionCode: RegionCode;
  menu: Array<{
    code: string;
    label: string;
    icon: string | null;
  }>;
};

const Header = ({
  navigationData,
  utilitiesData,
  countryCode,
  activeLabel,
  countryNavigationIntroduction,
  regions,
  sampleBasketLink,
  maximumSamples,
  lastNavigationLabel,
  disableSearch
}: {
  navigationData: NavigationData | null;
  utilitiesData: NavigationData | null;
  countryCode: string;
  activeLabel?: string;
  regions: Region[];
  countryNavigationIntroduction?: RichTextData | null;
  sampleBasketLink?: PageInfoData;
  maximumSamples: number | null;
  lastNavigationLabel?: string;
  disableSearch?: boolean;
}) => {
  const { isClient } = useIsClient();
  const [toastOpen, setToastOpen] = useState<ToastProps["open"]>(false);
  const [toastMessage, setToastMessage] = useState<ToastProps["message"]>("");
  const toastRef = useRef<ToastProps["anchorEl"] | null>(null);

  const language = useMemo(
    () =>
      regions
        .reduce<(typeof regions)[0]["menu"]>(
          (acc, { menu }) => acc.concat(menu),
          []
        )
        .find((l) => l.code === countryCode),
    [countryCode]
  );

  const { getMicroCopy } = useSiteContext();
  const { isNextDisabledElasticSearch, isSampleOrderingEnabled } = useConfig();
  const {
    basketState: { products: productsInBasket }
  } = useBasketContext();
  const authHeaderProps = useHeaderAuthData();

  useEffect(() => {
    const handleToast = (storageItem: string, message: MicroCopyValues) => {
      const showItem = localStorage.getItem(storageItem);
      if (convertStrToBool(showItem)) {
        setToastOpen(true);
        setToastMessage(getMicroCopy(message));
        localStorage.removeItem(storageItem);
      }
    };

    handleToast("showLoginToast", microCopy.LOG_IN_LABEL_ALERT);
    handleToast("showLogoutToast", microCopy.LOG_OUT_LABEL_ALERT);
  }, [getMicroCopy]);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  if (!navigationData || !utilitiesData) {
    return null;
  }

  const utilities = parseNavigation({
    navigationItems: utilitiesData.links,
    countryCode,
    getMicroCopy,
    isClient
  });

  const navigation = parseNavigation({
    navigationItems: navigationData.links,
    countryCode,
    getMicroCopy,
    isClient
  });

  const basketUrl =
    sampleBasketLink &&
    getPathWithCountryCode(countryCode, sampleBasketLink.path);

  const newActiveLabel =
    checkIfActiveLabelInParentNode(lastNavigationLabel, navigationData) ||
    activeLabel;
  return (
    <>
      <HeaderComponent
        disableSearch={isNextDisabledElasticSearch || disableSearch}
        languages={regions}
        language={language}
        languageLabel={getMicroCopy(microCopy.MENU_LANGUAGE)}
        languageIntroduction={
          <RichText
            hasNoBottomMargin
            document={countryNavigationIntroduction}
          />
        }
        utilities={utilities}
        navigation={navigation}
        logoAction={{
          component: NextLink,
          href: getPathWithCountryCode(countryCode, "")
        }}
        logoLabel={getMicroCopy(microCopy.GLOBAL_LOGO_LABEL)}
        activeNavLabel={newActiveLabel}
        closeLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
        searchGtm={{
          id: "search1",
          label: getMicroCopy(microCopy.SEARCH_LABEL)
        }}
        navUtilityLinkButton={(props: ButtonProps) => (
          <Button
            gtm={{
              id: "nav-top-utilities-bar",
              action: stringifyToObject(props.to) || props.href,
              label: React.Children.toArray(props.children).join("")
            }}
            {...props}
          />
        )}
        shoppingCartCount={productsInBasket.length}
        basketLabel={getMicroCopy(microCopy.BASKET_LABEL)}
        sampleBasketDialog={
          isSampleOrderingEnabled && sampleBasketLink?.sections?.[0]?.title
            ? (props: { toggleCart: () => void }) => (
                <SampleBasketDialog
                  title={sampleBasketLink.sections?.[0].title}
                  basketUrl={basketUrl}
                  maximumSamples={maximumSamples}
                  {...props}
                />
              )
            : null
        }
        navigationButtonComponent={(props: ButtonProps) => (
          <Button
            gtm={{
              id: "nav-main-menu",
              action: stringifyToObject(props.to),
              label:
                typeof props.children !== "string"
                  ? props.accessibilityLabel
                  : undefined
            }}
            {...props}
          />
        )}
        promoButtonComponent={({ startIcon, ...props }: ButtonProps) => (
          <Button
            {...props}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            className="Button"
            style={{ marginLeft: 16, marginBottom: 15 }}
          />
        )}
        closeButtonComponent={(props: IconButtonProps) => (
          <IconButton
            gtm={{
              id: "nav-country-selector",
              label: "close panel",
              action: "close panel"
            }}
            {...props}
          />
        )}
        onCountrySelection={onCountrySelection}
        useGTM={useGTM}
        searchAction={getPathWithCountryCode(countryCode, "search")}
        searchLabel={getMicroCopy(microCopy.SEARCH_LABEL)}
        searchPlaceholder={getMicroCopy(microCopy.SEARCH_PLACEHOLDER_HEADER)}
        searchTitle={getMicroCopy(microCopy.SEARCH_TITLE)}
        openLabel={getMicroCopy(microCopy.MENU_OPEN)}
        mainMenuTitleLabel={getMicroCopy(microCopy.MENU_MAIN_TITLE)}
        mainMenuDefaultLabel={getMicroCopy(microCopy.MENU_MAIN_DEFAULT)}
        auth={authHeaderProps}
        ref={toastRef}
      />
      {toastRef.current && (
        <Toast
          closeButtonAriaLabel={getMicroCopy(microCopy.GLOBAL_CLOSE)}
          message={toastMessage}
          type="success"
          open={toastOpen}
          onClose={handleToastClose}
          anchorEl={toastRef.current}
        />
      )}
    </>
  );
};

export default Header;
