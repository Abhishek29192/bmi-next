import { Button, Dialog } from "@bmi/components";
import { ErrorOutlineOutlined } from "@material-ui/icons";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { graphql } from "gatsby";
import React from "react";
import { Head } from "../../components/Head";
import RichText, { RichTextData } from "../../components/RichText";
import { Data as SiteData } from "../../components/Site";
import styles from "./styles/ie-dialog.module.scss";

export type Data = {
  ieDialogTitle: string | null;
  ieDialogBody: RichTextData | null;
  ieDialogActionLabel: string | null;
  ieDialogActionLink: string | null;
};

const IEDialog = ({ data }: { data: { contentfulSite: SiteData } }) => {
  const { resources } = data.contentfulSite;

  const ieDialogData: Data = {
    ieDialogTitle: resources.ieDialogTitle,
    ieDialogBody: resources.ieDialogBody,
    ieDialogActionLabel: resources.ieDialogActionLabel,
    ieDialogActionLink: resources.ieDialogActionLink
  };

  return (
    <>
      <Head
        title={ieDialogData.ieDialogTitle}
        seo={null}
        path={null}
        scripts={{
          headScripts: data.contentfulSite.headScripts,
          scriptOnetrust: data.contentfulSite.scriptOnetrust
        }}
        htmlAttributes={{ lang: data.contentfulSite.node_locale }}
        countryCode={data.contentfulSite.countryCode}
      />
      <div className={styles["IEDialog-wrapper"]}>
        <div className={styles["IEDialog"]}>
          <Dialog.Title hasUnderline className={styles["IEDialog-title"]}>
            <ErrorOutlineOutlined className={styles["IEDialog-icon"]} />
            {ieDialogData.ieDialogTitle}
          </Dialog.Title>
          <Dialog.Content className={styles["IEDialog-body"]}>
            <RichText document={ieDialogData.ieDialogBody} />
          </Dialog.Content>

          <div className={styles["IEDialog-actions"]}>
            <Button
              action={{
                model: "htmlLink",
                href: ieDialogData.ieDialogActionLink,
                target: "_blank",
                rel: "noopener noreferrer"
              }}
              endIcon={<ArrowForwardIcon />}
            >
              {ieDialogData.ieDialogActionLabel}
            </Button>
          </div>
        </div>
      </div>
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
