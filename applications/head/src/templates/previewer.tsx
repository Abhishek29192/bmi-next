import React, { useEffect, useMemo } from "react";
import { graphql, navigate } from "gatsby";
import queryString from "query-string";

type Data = {
  contentfulSite: {
    countryCode: string;
    pages: {
      slug: string;
      path: string;
    }[];
  };
};

const Previewer = ({ data }: { data: Data }) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!data.contentfulSite) {
    return <p>No Sites found for the given country code.</p>;
  }

  const { slug } = queryString.parse(window.location.search, {});

  if (!slug) {
    return (
      <p>
        You need to specify a page slug in the URL. e.g.
        previewer?slug=metal-tiles.
      </p>
    );
  }

  const pageData = useMemo(() => {
    return data.contentfulSite.pages.find(
      (page) =>
        page.slug === (Array.isArray(slug) ? slug[0] : slug).replace("/", "")
    );
  }, [data, slug]);

  useEffect(() => {
    if (pageData) {
      navigate(`/${data.contentfulSite.countryCode}/${pageData.path}`);
    }
  }, [pageData]);

  if (!pageData) {
    return (
      <p>
        There is no page for the {slug} slug. Make sure you assign it to the
        site.
      </p>
    );
  }

  return <p>Redirecting to {slug}</p>;
};

export default Previewer;

export const pageQuery = graphql`
  query SiteByCountryCode($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      countryCode
      pages {
        ... on ContentfulPage {
          slug
          path
        }
      }
    }
  }
`;
