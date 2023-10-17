import React from "react";
import { graphql } from "gatsby";
import { CourseWithSessions } from "@bmi/docebo-types";
import { Container } from "@bmi-digital/components";
import Page, { Data as PageData } from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import TrainingDetail from "./components/TrainingDetail";

export type Props = {
  pageContext: {
    productCode: string;
    siteId: string;
    countryCode: string;
  };
  data: {
    doceboCourses: CourseWithSessions;
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
      sessions {
        code
        name
        date_start
        date_end
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
