import Dialog from "@bmi-digital/components/dialog";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import classnames from "classnames";
import NextLink from "next/link";
import uniqueId from "lodash-es/uniqueId";
import React, { Suspense, useCallback, useContext, useState } from "react";
import { getPathWithCountryCode } from "../../utils/path";
import { CalculatorContext } from "../PitchedRoofCalculator";
import { useSiteContext } from "../Site";
import { VisualiserContext } from "../Visualiser";
import { sectionsMap } from "./common";
import {
  classes,
  StyledAnchorLink,
  StyledButton,
  StyledLinkDialog
} from "./styles";
import { DataTypeEnum } from "./types";
import type {
  DialogProps,
  HubSpotProps,
  LinkProps,
  Props,
  ToolProps
} from "./types";

const ExternalLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children
}: LinkProps) => {
  return (
    <StyledAnchorLink
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      external
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`external-link-${replaceSpaces(children)}`}
    >
      {transformHyphens(children)}
    </StyledAnchorLink>
  );
};

const InternalLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children
}: LinkProps) => {
  const { countryCode } = useSiteContext();
  const url = getPathWithCountryCode(countryCode, to);

  return (
    <StyledAnchorLink
      className={classnames(className, hasBrandColours && classes.branded)}
      component={NextLink}
      href={url}
      gtm={{
        id: "cta-click1",
        action: url,
        label: children,
        ...gtm
      }}
      data-testid={`internal-link-${replaceSpaces(children)}`}
    >
      {transformHyphens(children)}
    </StyledAnchorLink>
  );
};

const AssetLink = ({
  to,
  hasBrandColours,
  className,
  gtm,
  children
}: LinkProps) => {
  return (
    <StyledAnchorLink
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      external
      download
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`asset-link-${replaceSpaces(children)}`}
    >
      {transformHyphens(children)}
    </StyledAnchorLink>
  );
};

const VisualiserButton = ({
  parameters,
  onClick,
  hasBrandColours,
  className,
  children,
  gtm
}: ToolProps) => {
  const { open } = useContext(VisualiserContext);

  const handleOnClick = useCallback(
    (...args: unknown[]) => {
      onClick && onClick(...args);

      open?.(parameters);
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
      data-testid={`visualiser-link-${replaceSpaces(children)}`}
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
  gtm
}: ToolProps) => {
  const { open } = useContext(CalculatorContext);

  const handleOnClick = useCallback(
    (...args: unknown[]) => {
      onClick && onClick(...args);

      open?.(parameters);
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
      data-testid={`calculator-link-${replaceSpaces(children)}`}
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
  gtm
}: DialogProps) => {
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
        data-testid={`dialog-link-${replaceSpaces(children)}`}
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
  children
}: HubSpotProps) => {
  const to = `${process.env.NEXT_PUBLIC_HUBSPOT_CTA_URL}${process.env.NEXT_PUBLIC_HUBSPOT_ID}/${hubSpotCtaId}`;
  return (
    <StyledAnchorLink
      className={classnames(className, hasBrandColours && classes.branded)}
      href={to}
      gtm={{
        id: "cta-click1",
        action: to,
        label: children,
        ...gtm
      }}
      data-testid={`hubspot-link-${replaceSpaces(children)}`}
    >
      {transformHyphens(children)}
    </StyledAnchorLink>
  );
};

const Link = (props: Props) => {
  switch (props.data.type) {
    case DataTypeEnum.External:
      return (
        <ExternalLink
          to={props.data.url}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </ExternalLink>
      );
    case DataTypeEnum.Internal:
      return (
        <InternalLink
          to={props.data.linkedPage?.path}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </InternalLink>
      );
    case DataTypeEnum.Asset:
      return (
        <AssetLink
          to={`https:${props.data.asset?.url}`}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </AssetLink>
      );
    case DataTypeEnum.Visualiser:
      return (
        <VisualiserButton
          onClick={props.onClick}
          parameters={props.data.parameters}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </VisualiserButton>
      );
    case DataTypeEnum.Calculator:
      return (
        <CalculatorButton
          onClick={props.onClick}
          parameters={props.data.parameters}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </CalculatorButton>
      );
    case DataTypeEnum.Dialog:
      return (
        <DialogButton
          onClick={props.onClick}
          dialogContent={props.data.dialogContent}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </DialogButton>
      );
    case DataTypeEnum.HubSpotCta:
      return (
        <HubSpotLink
          hubSpotCtaId={props.data.hubSpotCTAID}
          hasBrandColours={props.hasBrandColours}
          className={props.className}
          gtm={props.gtm}
        >
          {props.children}
        </HubSpotLink>
      );
  }
};

export default Link;
