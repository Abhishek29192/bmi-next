import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Hero from "@bmi/hero";
import Table from "@bmi/table";
import Typography from "@bmi/typography/src";
import Page from "../components/Page";
import { Data as SiteData } from "../components/Site";

type Data = {
  data: {
    contentfulSite: SiteData;
  };
  pageContext: {
    micropCopyData: {
      keys: Array<string>;
    };
  };
};

const GlobalResources = ({ data, pageContext }: Data) => {
  const { contentfulSite: siteData } = data;
  const { micropCopyData } = pageContext;
  const {
    microCopy: microCopyResources,
    errorFourOFour,
    errorGeneral
  } = siteData.resources;

  if (!micropCopyData) {
    // eslint-disable-next-line no-console
    console.warn(
      "No microcopy key data exists. Please run 'yarn run microcopy'"
    );
  }

  const microCopyItems =
    micropCopyData &&
    micropCopyData.keys.map((key) => {
      const currentResource = microCopyResources.find(
        (resource) => resource.key === key
      );

      return {
        key,
        value: currentResource ? currentResource.value : null
      };
    });

  return (
    <Page
      title="Global resources"
      pageData={{
        breadcrumbs: [
          {
            id: "global-resources",
            label: "global-resources",
            slug: null
          }
        ],
        inputBanner: null,
        seo: null,
        path: null
      }}
      siteData={siteData}
    >
      <Hero level={2} title="Global Resources"></Hero>
      <Section>
        <Section.Title>Microcopy</Section.Title>
        {microCopyItems ? (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Key</Table.Cell>
                <Table.Cell>Value</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {microCopyItems.map((item) => (
                <Table.Row key={item.key}>
                  <Table.Cell>{item.key}</Table.Cell>
                  <Table.Cell
                    style={{
                      backgroundColor: item.value ? "inherit" : "#ccecf9"
                    }}
                  >
                    {item.value}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <>
            <Typography hasUnderline>
              No microcopy data provided. Please generate microcopy data file:
            </Typography>
            <Typography variant="caption">yarn run microcopy</Typography>
          </>
        )}
      </Section>
      <Section>
        <Section.Title>Error messages</Section.Title>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Field</Table.Cell>
              <Table.Cell>Promo entry title</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>errorFourOFour</Table.Cell>
              <Table.Cell
                style={{
                  backgroundColor: errorFourOFour ? "inherit" : "#ccecf9"
                }}
              >
                {errorFourOFour && errorFourOFour.title}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>errorGeneral</Table.Cell>
              <Table.Cell
                style={{
                  backgroundColor: errorGeneral ? "inherit" : "#ccecf9"
                }}
              >
                {errorGeneral && errorGeneral.title}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Section>
    </Page>
  );
};

export default GlobalResources;

export const pageQuery = graphql`
  query GlobalResourcesBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
