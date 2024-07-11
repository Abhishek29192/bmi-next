import { graphql } from "gatsby";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import React, { useEffect, useMemo } from "react";

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
  const router = useRouter();
  const { slug } =
    typeof window === "undefined"
      ? { slug: null }
      : queryString.parse(window.location.search, {});

  const pageData = useMemo(() => {
    return data.contentfulSite.pages.find(
      (page) =>
        page.slug ===
        (Array.isArray(slug) ? slug[0] : slug || "").replace("/", "")
    );
  }, [data, slug]);

  useEffect(() => {
    if (pageData) {
      router.push(
        `/${
          process.env.NEXT_PUBLIC_DONT_USE_COUNTRY_CODE
            ? ""
            : `${data.contentfulSite.countryCode}/`
        }${pageData.path}`
      );
    }
  }, [pageData, data.contentfulSite.countryCode]);

  if (typeof window === "undefined") {
    return null;
  }

  if (!slug) {
    return (
      <p>
        You need to specify a page slug in the URL. e.g.
        previewer?slug=metal-tiles.
      </p>
    );
  }

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
