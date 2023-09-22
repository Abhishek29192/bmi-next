import React from "react";
import { Container } from "@bmi-digital/components";
import { graphql } from "gatsby";
import Page, { Data as PageData } from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import { DoceboCourse } from "../../types/pim";
import TrainingDetail from "./components/TrainingDetail";

export type Props = {
  pageContext: {
    productCode: string;
    siteId: string;
    countryCode: string;
  };
  data: {
    doceboCourses: DoceboCourse;
    contentfulSite: SiteData;
  };
};

const TrainingDetailsPage = ({ data }: Props) => {
  const { doceboCourses, contentfulSite } = data;
  const { name, slug_name } = doceboCourses;
  const pageData: PageData = {
    breadcrumbs: null,
    signupBlock: null,
    seo: null,
    path: `/t/${slug_name}`
  };

  return (
    <Page title={name} pageData={pageData} siteData={contentfulSite}>
      <Container>
        <TrainingDetail course={doceboCourses} />
      </Container>
    </Page>
  );
};

export default TrainingDetailsPage;

export const pageQuery = graphql`
  query TrainingDetailsPage($courseId: Int!, $siteId: String!) {
    doceboCourses(id_course: { eq: $courseId }) {
      id_course
      name
      description
      code
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
