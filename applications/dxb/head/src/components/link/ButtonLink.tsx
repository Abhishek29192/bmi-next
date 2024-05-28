import Dialog from "@bmi-digital/components/dialog";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import classnames from "classnames";
import { graphql } from "gatsby";
import NextLink from "next/link";
import uniqueId from "lodash-es/uniqueId";
import React, { Suspense, useCallback, useContext, useState } from "react";
import { getPathWithCountryCode } from "../../utils/path";
import { CalculatorContext } from "../PitchedRoofCalculator";
import { useSiteContext } from "../Site";
import { VisualiserContext } from "../Visualiser";
import { classes, StyledButton, StyledLinkDialog } from "./styles";
import { DataTypeEnum } from "./types";
import { sectionsMap } from "./common";
import type {
  ButtonLinkDialogProps,
  ButtonLinkHubSpotProps,
  ButtonLinkLinkProps,
  ButtonLinkProps,
  ButtonLinkToolProps
} from "./types";

const ExternalLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children,
  ...rest
}: ButtonLinkLinkProps) => {
  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      external
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`external-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const InternalLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children,

  ...rest
}: ButtonLinkLinkProps) => {
  const { countryCode } = useSiteContext();
  const url = getPathWithCountryCode(countryCode, to);

  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      component={NextLink}
      href={url}
      gtm={{
        id: "cta-click1",
        action: url,
        label: children,
        ...gtm
      }}
      data-testid={`internal-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const AssetLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children,
  ...rest
}: ButtonLinkLinkProps) => {
  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      download
      external
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`asset-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const VisualiserButton = ({
  parameters,
  onClick,
  hasBrandColours,
  className,
  children,
  gtm,
  ...rest
}: ButtonLinkToolProps) => {
  const { open } = useContext(VisualiserContext);

  const handleOnClick = useCallback(
    (...args: unknown[]) => {
      onClick && onClick(...args);

      if (open) {
        open(parameters);
      }
    },
    [onClick, open, parameters]
  );

  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      onClick={handleOnClick}
      gtm={{
        id: "cta-visualiser1",
        action: "visualiser",
        label: children,
        ...gtm
      }}
      data-testid={`visualiser-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const CalculatorButton = ({
  parameters,
  onClick,
  hasBrandColours,
  className,
  children,
  gtm,
  ...rest
}: ButtonLinkToolProps) => {
  const { open } = useContext(CalculatorContext);

  const handleOnClick = useCallback(
    (...args: unknown[]) => {
      onClick && onClick(...args);

      if (open) {
        open(parameters);
      }
    },
    [onClick, open, parameters]
  );

  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      onClick={handleOnClick}
      gtm={{
        id: "cta-calculator1",
        action: "calculator",
        label: children,
        ...gtm
      }}
      data-testid={`calculator-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const DialogButton = ({
  dialogContent,
  onClick,
  hasBrandColours,
  className,
  children,
  gtm,
  ...rest
}: ButtonLinkDialogProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleOnClick = useCallback(
    (...args: unknown[]) => {
      onClick && onClick(...args);
      setDialogIsOpen(true);
    },
    [onClick, setDialogIsOpen]
  );

  const handleDialogCloseClick = useCallback(() => {
    setDialogIsOpen(false);
  }, []);

  if (!dialogContent) {
    return;
  }

  const Component: React.ElementType = sectionsMap[dialogContent.__typename];

  return (
    <>
      <StyledButton
        className={classnames(className, hasBrandColours && classes.branded)}
        onClick={handleOnClick}
        gtm={{
          id: "cta-click1",
          action: DataTypeEnum.Dialog,
          label: children,
          ...gtm
        }}
        data-testid={`dialog-button-link-${replaceSpaces(children)}`}
        {...rest}
      >
        {transformHyphens(children)}
      </StyledButton>
      <Dialog
        open={dialogIsOpen}
        onCloseClick={handleDialogCloseClick}
        data-testid={`dialog-container-${replaceSpaces(children)}`}
      >
        <StyledLinkDialog>
          <Suspense fallback={<div>loading...</div>}>
            <Component
              data={dialogContent}
              id={`dialog-section-${uniqueId()}`}
              isDialog
            />
          </Suspense>
        </StyledLinkDialog>
      </Dialog>
    </>
  );
};

const HubSpotLink = ({
  hubSpotCtaId,
  hasBrandColours,
  className,
  gtm,
  children,
  ...rest
}: ButtonLinkHubSpotProps) => {
  const to = `${process.env.GATSBY_HUBSPOT_CTA_URL}${process.env.GATSBY_HUBSPOT_ID}/${hubSpotCtaId}`;
  return (
    <StyledButton
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`hubspot-button-link-${replaceSpaces(children)}`}
      {...rest}
    >
      {transformHyphens(children)}
    </StyledButton>
  );
};

const ButtonLink = ({
  children,
  data,
  hasBrandColours,
  className,
  onClick,
  gtm,
  ...rest
}: ButtonLinkProps) => {
  switch (data.type) {
    case DataTypeEnum.External:
      return (
        <ExternalLink
          to={data.url}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </ExternalLink>
      );
    case DataTypeEnum.Internal:
      return (
        <InternalLink
          to={data.linkedPage?.path}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </InternalLink>
      );
    case DataTypeEnum.Asset:
      return (
        <AssetLink
          to={`https:${data.asset?.file.url}`}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </AssetLink>
      );
    case DataTypeEnum.Visualiser:
      return (
        <VisualiserButton
          onClick={onClick}
          parameters={data.parameters}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </VisualiserButton>
      );
    case DataTypeEnum.Calculator:
      return (
        <CalculatorButton
          onClick={onClick}
          parameters={data.parameters}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </CalculatorButton>
      );
    case DataTypeEnum.Dialog:
      return (
        <DialogButton
          onClick={onClick}
          dialogContent={data.dialogContent}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </DialogButton>
      );
    case DataTypeEnum.HubSpotCta:
      return (
        <HubSpotLink
          hubSpotCtaId={data.hubSpotCTAID}
          hasBrandColours={hasBrandColours}
          className={className}
          gtm={gtm}
          {...rest}
        >
          {children}
        </HubSpotLink>
      );
  }
};

export default ButtonLink;

export const query = graphql`
  fragment LinkFragmentNonRecursive on ContentfulLink {
    __typename
    id
    label
    icon
    isLabelHidden
    url
    type
    linkedPage {
      ... on ContentfulHomePage {
        path
      }
      ... on ContentfulPage {
        path
      }
    }
    asset {
      ... on ContentfulAsset {
        file {
          ... on ContentfulAssetFile {
            url
          }
        }
      }
    }
    parameters {
      ...VisualiserFragment
    }
    hubSpotCTAID
  }
  fragment LinkFragment on ContentfulLink {
    ...LinkFragmentNonRecursive
    dialogContent {
      # Potential to add more sections here.
      ...FormSectionFragmentNonRecursive
    }
  }
`;
