import React, { useCallback, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Accordion, Typography, Grid } from "@bmi/components";
import { gql } from "@apollo/client";
import { withPage } from "../lib/middleware/withPage";
import { Layout } from "../components/Layout";
import styles from "../styles/Faq.module.scss";
import { getMarketAndEnvFromReq, parseMarketTag } from "../lib/utils";
import { findAccountTier } from "../lib/account";
import { getServerPageGetFaqTopics } from "../graphql/generated/page";
import { RichText } from "../components/RichText";
import { useGetFaqItemLazyQuery } from "../graphql/generated/hooks";

const FaqPage = ({ faqTopicCollection, globalPageData }) => {
  const { t } = useTranslation("common");
  const [faqItem, setFaqItem] = useState(null);
  const [loadedItems, setLoadedItems] = useState({});

  const [getSystemsReport] = useGetFaqItemLazyQuery({
    variables: {
      id: faqItem || ""
    },
    onCompleted: ({ faqItemCollection }) => {
      // eslint-disable-next-line security/detect-object-injection
      if (!loadedItems[faqItem]) {
        setLoadedItems((prevState) => ({
          ...prevState,
          [faqItem]: faqItemCollection.items[0].body
        }));
      }
    }
  });

  const selectItem = useCallback(
    (itemId) => {
      setFaqItem(itemId);
      // eslint-disable-next-line security/detect-object-injection
      if (!loadedItems[faqItem]) {
        getSystemsReport();
      }
    },
    [loadedItems, getSystemsReport]
  );

  return (
    <Layout title={t("FAQ")} pageData={globalPageData}>
      <Grid spacing={0} container>
        {[...faqTopicCollection.items]
          .sort((a, b) => a.weight - b.weight)
          .map(({ listCollection, title }, id) => (
            <Grid
              key={`accordion-topic-${id}`}
              className={styles.faqContent}
              xs={12}
              spacing={3}
              container
            >
              <Typography
                variant="h4"
                style={{ fontSize: "31.5px", paddingBottom: "24px" }}
                hasUnderline
              >
                {title}
              </Typography>
              <Accordion noInnerPadding>
                {[...listCollection.items]
                  .sort((a, b) => a.title?.localeCompare(b.title))
                  .map(({ title, sys }, id) => (
                    <Accordion.Item
                      key={`accordion-item-${id}`}
                      defaultExpanded={false}
                      style={{ boxShadow: "none" }}
                      onChange={() => selectItem(sys.id)}
                      data-testid="accordion-item"
                    >
                      <Accordion.Summary data-testid="accordion-summary">
                        <Typography variant="h6">{title}</Typography>
                      </Accordion.Summary>
                      <Accordion.Details
                        style={{
                          padding: "8px 16px",
                          borderRadius: "0 0 5px 5px"
                        }}
                      >
                        <RichText
                          content={loadedItems[sys.id]?.json}
                          links={loadedItems[sys.id]?.links}
                        />
                      </Accordion.Details>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = withPage(
  async ({ apolloClient, locale, account, req }) => {
    const marketEnv = getMarketAndEnvFromReq(req);
    const contentfulTag = parseMarketTag(marketEnv.market);
    const {
      props: {
        data: { faqTopicCollection }
      }
    } = await getServerPageGetFaqTopics(
      {
        variables: {
          role: account.role,
          tier: findAccountTier(account),
          tag: contentfulTag
        }
      },
      apolloClient
    );

    return {
      props: {
        faqTopicCollection,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(FaqPage);

export const GET_FAQ_TOPICS = gql`
  query GetFaqTopics($role: String!, $tier: String!, $tag: String!) {
    faqTopicCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
        audienceRole_contains_some: [$role]
        audienceTiers_contains_some: [$tier]
      }
    ) {
      items {
        title
        audienceRole
        audienceTiers
        weight
        listCollection {
          items {
            title
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_FAQ_ITEM = gql`
  query GetFaqItem($id: String!) {
    faqItemCollection(where: { sys: { id: $id } }, limit: 1) {
      items {
        body {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                title
                width
                height
                description
              }
            }
          }
        }
      }
    }
  }
`;
