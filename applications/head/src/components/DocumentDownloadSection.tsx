import React, { useContext } from "react";
import { graphql } from "gatsby";
import filesize from "filesize";
import { Document } from "@contentful/rich-text-types";
import Section from "@bmi/section";
import Table from "@bmi/table";
import Button from "@bmi/button";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import { Data as DocumentData } from "./Document";
import { getClickableActionFromUrl } from "./Link";
import Icon, { iconMap } from "@bmi/icon";

export type Data = {
  __typename: "ContentfulDocumentDownloadSection";
  title: string;
  description: { json: Document } | null;
  documents: DocumentData[];
};

const fileIconsMap = {
  "application/pdf": iconMap.FilePDF,
  "image/jpeg": iconMap.FileJPEG,
  "image/png": iconMap.FilePNG
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
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <Section backgroundColor="white">
      <Section.Title>{title}</Section.Title>
      {description && (
        <div style={{ marginBottom: "40px" }}>
          <RichText document={description.json} />
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
                    <Button
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
                    </Button>
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
      json
    }
    documents {
      ...DocumentFragment
    }
  }
`;
