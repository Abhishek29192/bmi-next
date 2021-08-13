import React from "react";
import { graphql } from "gatsby";
import filesize from "filesize";
import Section from "@bmi/section";
import Table from "@bmi/table";
import Button, { ButtonProps } from "@bmi/button";
import Icon from "@bmi/icon";
import withGTM from "../utils/google-tag-manager";
import fileIconsMap from "../components/FileIconsMap";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import { Data as DocumentData } from "./Document";
import { getClickableActionFromUrl } from "./Link";

export type Data = {
  __typename: "ContentfulDocumentDownloadSection";
  title: string | null;
  description: RichTextData | null;
  documents: DocumentData[];
};

const iconStyle = {
  width: "1em",
  height: "1em"
};

const DocumentDownloadSection = ({
  data: { title, description, documents }
}: {
  data: Data;
}) => {
  const { getMicroCopy } = useSiteContext();

  const GTMButton = withGTM<ButtonProps>(Button, {
    label: "children"
  });

  return (
    <Section backgroundColor="white">
      {title && <Section.Title>{title}</Section.Title>}
      {description && (
        <div style={{ marginBottom: "40px" }}>
          <RichText document={description} />
        </div>
      )}
      {documents.length > 0 && (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>
                {getMicroCopy("documentDownloadSection.documentTitle")}
              </Table.Cell>
              <Table.Cell align="right">
                {getMicroCopy("documentDownloadSection.download")}
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {documents.map(({ title, asset }, index) => {
              const { url, details, contentType } = asset.file;

              return (
                <Table.Row key={`${title}-${index}`}>
                  <Table.Cell>{title}</Table.Cell>
                  <Table.Cell align="right">
                    <GTMButton
                      gtm={{
                        id: "download1",
                        label: "Download",
                        action: url
                      }}
                      action={getClickableActionFromUrl(
                        null,
                        null,
                        null,
                        `https:${url}`
                      )}
                      variant="text"
                      startIcon={
                        <Icon
                          source={fileIconsMap[contentType]}
                          // TODO: consider responsibility of icon styles
                          style={iconStyle}
                        />
                      }
                    >
                      {filesize(details.size)}
                    </GTMButton>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </Section>
  );
};

export default DocumentDownloadSection;

export const query = graphql`
  fragment DocumentDownloadSectionFragment on ContentfulDocumentDownloadSection {
    title
    description {
      ...RichTextFragment
    }
    documents {
      ...DocumentFragment
    }
  }
`;
