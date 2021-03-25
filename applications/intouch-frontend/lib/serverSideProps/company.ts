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
  async getServerSideProps({ locale, req, res }) {
    const apolloClient = initializeApollo();
    const { accessToken } = await auth0.getSession(req, res);

    const {
      data: { currentCompany }
    } = await apolloClient.query({
      query: GET_CURRENT_COMPANY,
      variables: {},
      context: { headers: { Authorization: `Bearer ${accessToken}` } }
    });

    const { data } = await apolloClient.query({
      query: GET_COMPANY,
      variables: { companyId: currentCompany },
      context: { headers: { Authorization: `Bearer ${accessToken}` } }
    });

    return {
      props: {
        company: data,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "company-page"
        ]))
      }
    };
  }
});
