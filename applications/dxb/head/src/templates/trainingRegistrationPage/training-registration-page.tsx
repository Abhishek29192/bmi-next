import { graphql } from "gatsby";
import React from "react";
import Page, { Data as PageData } from "../../components/Page";
import ProgressIndicator from "../../components/ProgressIndicator";
import Scrim from "../../components/Scrim";
import TrainingRegistrationHeader from "./components/TrainingRegistrationHeader";
import { useRegistration } from "./hooks/useRegistration";
import type { TrainingRegistrationPageProps } from "./types";

const TrainingRegistrationPage = ({ data }: TrainingRegistrationPageProps) => {
  const { path } = data.contentfulTrainingRegistrationPage;
  const pageData: PageData = {
    breadcrumbs: null,
    signupBlock: null,
    seo: { noIndex: true, metaTitle: null, metaDescription: null },
    path
  };

  const { training, loading } = useRegistration();

  return (
    <Page
      title={"Training registration page"}
      siteData={data.contentfulSite}
      pageData={pageData}
    >
      {loading && (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      )}
      {training && <TrainingRegistrationHeader training={training} />}
    </Page>
  );
};

export default TrainingRegistrationPage;

export const pageQuery = graphql`
  query TrainingRegistrationPageById($pageId: String!, $siteId: String!) {
    contentfulTrainingRegistrationPage(id: { eq: $pageId }) {
      path
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
  }
`;
