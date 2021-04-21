import { gql } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import auth0 from "../auth0";
import { initializeApollo } from "../apolloClient";

type Company = {
  id: number;
  name: string;
  privateemail: string;
  aboutus: string;
  phone: string;
  website: string;
  tradingaddressline2: string;
};
export type CompanyData = {
  company: Company;
};

const GET_CURRENT_COMPANY = gql`
  query currentCompany {
    currentCompany
  }
`;

const GET_COMPANY = gql`
  query GetCompanyDetail($companyId: Int!) {
    company(id: $companyId) {
      name
      phone
      website
      aboutUs
    }
  }
`;

export default auth0.withPageAuthRequired({
  async getServerSideProps({ locale, ...ctx }) {
    const apolloClient = await initializeApollo(null, { ...ctx, locale });

    const pageProps = {
      company: null,
      ...(await serverSideTranslations(locale, [
        "common",
        "sidebar",
        "footer",
        "company-page"
      ]))
    };

    const {
      data: { currentCompany }
    } = await apolloClient.query({
      query: GET_CURRENT_COMPANY,
      variables: {}
    });

    if (currentCompany) {
      const { data } = await apolloClient.query({
        query: GET_COMPANY,
        variables: { companyId: currentCompany }
      });
      pageProps.company = data;
    }

    return { props: pageProps };
  }
});
