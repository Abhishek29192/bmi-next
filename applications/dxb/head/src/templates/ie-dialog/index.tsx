import Button from "@bmi-digital/components/button";
import Dialog from "@bmi-digital/components/dialog";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import ErrorOutlineOutlined from "@bmi-digital/components/icon/ErrorOutlineOutlined";
import { graphql } from "gatsby";
import React from "react";
import { Head } from "../../components/Head";
import RichText, { RichTextData } from "../../components/RichText";
import { Data as SiteData } from "../../components/Site";
import { getPathWithCountryCode } from "../../utils/path";
import {
  StyledIEDialog,
  StyledIEDialogWrapper,
  classes
} from "./styles/ie-dialog.styles";

export type Data = {
  ieDialogTitle?: string | null;
  ieDialogBody?: RichTextData | null;
  ieDialogActionLabel?: string | null;
  ieDialogActionLink?: string | null;
};

const IEDialog = ({ data }: { data: { contentfulSite: SiteData } }) => {
  const { resources } = data.contentfulSite;

  const ieDialogData: Data = {
    ieDialogTitle: resources?.ieDialogTitle,
    ieDialogBody: resources?.ieDialogBody,
    ieDialogActionLabel: resources?.ieDialogActionLabel,
    ieDialogActionLink: resources?.ieDialogActionLink
  };

  return (
    <>
      <Head
        title={ieDialogData.ieDialogTitle}
        seo={null}
        path={getPathWithCountryCode(
          data.contentfulSite.countryCode,
          "ie-dialog"
        )}
        htmlAttributes={{ lang: data.contentfulSite.node_locale }}
        countryCode={data.contentfulSite.countryCode}
      />
      <StyledIEDialogWrapper>
        <StyledIEDialog>
          <Dialog.Title hasUnderline className={classes["IEDialog-title"]}>
            <ErrorOutlineOutlined className={classes["IEDialog-icon"]} />
            {ieDialogData.ieDialogTitle}
          </Dialog.Title>
          <Dialog.Content className={classes["IEDialog-body"]}>
            <RichText document={ieDialogData.ieDialogBody} />
          </Dialog.Content>

          <div className={classes["IEDialog-actions"]}>
            <Button
              href={ieDialogData.ieDialogActionLink}
              external
              endIcon={<ArrowForwardIcon />}
            >
              {ieDialogData.ieDialogActionLabel}
            </Button>
          </div>
        </StyledIEDialog>
      </StyledIEDialogWrapper>
    </>
  );
};

export default IEDialog;

export const pageQuery = graphql`
  query GeneralIEDialogBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;

export const query = graphql`
  fragment IEDialogFragment on ContentfulResources {
    ieDialogTitle
    ieDialogActionLabel
    ieDialogActionLink
    ieDialogBody {
      ...RichTextFragment
    }
  }
`;
