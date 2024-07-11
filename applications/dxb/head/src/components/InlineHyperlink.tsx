import AnchorLink from "@bmi-digital/components/anchor-link";
import NextLink from "next/link";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import { useSiteContext } from "./Site";
import Link from "./link/Link";
import { Data as LinkData } from "./link/types";
import { FileData as AssetData } from "./EmbeddedAssetBlock";

type InlineEntryPageTypename =
  | "HomePage"
  | "Page"
  | "ContactUsPage"
  | "ProductListerPage"
  | "DocumentLibraryPage"
  | "BrandLandingPage"
  | "TrainingListerPage";

export type PageData = { __typename: InlineEntryPageTypename; path: string };

export type Data = LinkData | AssetData | PageData;

const availableTypenames = [
  "Asset",
  "Link",
  "HomePage",
  "Page",
  "ContactUsPage",
  "ProductListerPage",
  "DocumentLibraryPage",
  "BrandLandingPage",
  "TrainingListerPage"
];

type Props = {
  data: Data;
  children: string;
  gtmLabel?: React.ReactNode;
  "data-testid"?: string;
};

const InlineHyperlink = ({
  data,
  children,
  gtmLabel,
  "data-testid": dataTestId
}: Props) => {
  const { countryCode } = useSiteContext();

  // TODO: Handle ContentfulLink case.
  if (!availableTypenames.includes(data.__typename)) {
    return <>{children}</>;
  }

  const label = gtmLabel ? `${gtmLabel} - ${children[0][1]}` : children[0][1];

  if (data.__typename === "Link") {
    return (
      <Link data={data} gtm={{ label }} data-testid={dataTestId}>
        {children}
      </Link>
    );
  }

  if (data.__typename === "Asset") {
    return (
      <AnchorLink
        href={`https:${data.url}`}
        gtm={{
          id: "cta-click1",
          label,
          action: `https:${data.url}`
        }}
        data-testid={dataTestId}
        external
      >
        {children}
      </AnchorLink>
    );
  }
  const action = getPathWithCountryCode(countryCode, data.path).replace(
    /\/+/gi,
    "/"
  );
  return (
    <AnchorLink
      component={NextLink}
      href={action}
      gtm={{
        id: "cta-click1",
        label,
        action
      }}
      data-testid={dataTestId}
    >
      {children}
    </AnchorLink>
  );
};

export default InlineHyperlink;
