import { gql } from "@apollo/client";
import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useTranslation } from "next-i18next";
import { AlertBanner } from "@bmi/components";
import { TextField } from "@bmi/components";
import { Checkbox } from "@bmi/components";
import { Button } from "@bmi/components";
import { Form } from "@bmi/components";
import { Grid } from "@bmi/components";
import { Typography } from "@bmi/components";
import classnames from "classnames";
import { SidePanel } from "../../SidePanel";
import { FilterResult } from "../../FilterResult";
import { formatDate } from "../../../lib/utils";
import {
  useUpdateMarketMutation,
  useUpdateDoceboTiersByMarketMutation,
  useUpdateMerchandiseTiersByMarketMutation
} from "../../../graphql/generated/hooks";
import {
  MarketsQuery,
  UpdateMarketMutation
} from "../../../graphql/generated/operations";
import layoutStyles from "../../Layout/styles.module.scss";
import styles from "./styles.module.scss";
import { marketKeys } from "./config";

type Props = {
  markets: MarketsQuery["markets"];
  doceboTiers: MarketsQuery["doceboTiers"];
  merchandiseTiers: MarketsQuery["merchandiseTiers"];
};

type DoceboTiers = {
  T1?: number;
  T2?: number;
  T3?: number;
  T4?: number;
  T5?: number;
  T6?: number;
  T7?: number;
};

type MerchandiseTiers = {
  merchandiseT1?: number;
  merchandiseT2?: number;
  merchandiseT3?: number;
  merchandiseT4?: number;
  merchandiseT5?: number;
  merchandiseT6?: number;
  merchandiseT7?: number;
};

type MarketList =
  | MarketsQuery["markets"]
  | UpdateMarketMutation["updateMarket"]["query"]["markets"];
type _Market = MarketList["nodes"][0] & DoceboTiers & MerchandiseTiers;

type ResultProps = {
  severity: "error" | "warning" | "info" | "success" | null;
  title: string | null;
  messages?: any[] | null;
};

const getValue = (t, type, value) => {
  switch (type) {
    case "number":
    case "text":
    case "textarea":
      return value;
    case "checkbox":
      return value === true ? t("enabled") : t("disabled");
    case "date":
      return formatDate(value);
    default:
      break;
  }
};

const MarketPage = ({ markets, doceboTiers, merchandiseTiers }: Props) => {
  const { t } = useTranslation("admin-markets");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [result, setResult] = useState<ResultProps>({
    severity: null,
    title: null,
    messages: []
  });
  const [selectedMarketId, setSelectedMarketId] = useState(markets.nodes[0].id);
  const [items, setItems] = useState<MarketList>(markets);
  const [filteredItems, setFilteredItems] = useState<MarketList>(markets);
  const [filterState, setFilterState] = useState({
    searched: null,
    filters: []
  });
  const [selectedItem, setSelectedItem] = useState<_Market>();

  const [updateMarket, { loading: updateMarketLoading }] =
    useUpdateMarketMutation({
      onError: ({ networkError }) => {
        setResult({
          severity: "error",
          title: t("error"),
          messages: [
            ...result.messages,
            ...(networkError?.["result"]?.errors?.map(
              ({ message }) => message
            ) || [])
          ]
        });
      },
      onCompleted: (data) => {
        setItems({ ...items, ...data.updateMarket.query.markets });
        setResult({
          title: t("success"),
          severity: "success",
          messages: []
        });
      }
    });

  const [updateDoceboTiers, { loading: updateDoceboTiersLoading }] =
    useUpdateDoceboTiersByMarketMutation({
      onError: ({ networkError, message }) => {
        const errors = networkError
          ? networkError["result"].errors.map(({ message }) => message)
          : [message];
        setResult({
          severity: "error",
          title: t("error"),
          messages: [...result.messages, ...errors]
        });
      },
      onCompleted: (data) => {
        const doceboTiers = data.updateDoceboTiersByMarket.reduce(
          (prev, cur) => ({
            ...prev,
            [cur.tier_code]: cur.docebo_catalogue_id
          }),
          {}
        ) as DoceboTiers;
        setItems({ ...items, ...doceboTiers });
      }
    });

  const [updateMerchandiseTiers, { loading: updateMerchandiseTiersLoading }] =
    useUpdateMerchandiseTiersByMarketMutation({
      onError: ({ networkError, message }) => {
        const errors = networkError
          ? networkError["result"].errors.map(({ message }) => message)
          : [message];
        setResult({
          severity: "error",
          title: t("error"),
          messages: [...result.messages, ...errors]
        });
      },
      onCompleted: (data) => {
        const merchandiseTiers = data.updateMerchandiseTiersByMarket.reduce(
          (prev, cur) => ({
            ...prev,
            [`merchandise${cur.tier_code}`]: cur.merchandise_division_id
          }),
          {}
        ) as MerchandiseTiers;
        setItems({ ...items, ...merchandiseTiers });
      }
    });

  const onItemChange = useCallback(
    (name, value, type) => {
      setSelectedItem((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) : value
      }));
    },
    [setSelectedItem]
  );

  const onMarketSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const {
        id,
        __typename,
        T1,
        T2,
        T3,
        T4,
        T5,
        T6,
        T7,
        merchandiseT1,
        merchandiseT2,
        merchandiseT3,
        merchandiseT4,
        merchandiseT5,
        merchandiseT6,
        merchandiseT7,
        ...rest
      } = selectedItem;

      const catalogueToUpdate = {
        T1,
        T2,
        T3,
        T4,
        T5,
        T6,
        T7
      };

      const merchandiseToUpdate = {
        merchandiseT1,
        merchandiseT2,
        merchandiseT3,
        merchandiseT4,
        merchandiseT5,
        merchandiseT6,
        merchandiseT7
      };

      setResult({ severity: null, title: null, messages: [] });
      await updateMarket({
        variables: {
          input: {
            id,
            patch: {
              ...rest
            }
          }
        }
      });
      await updateDoceboTiers({
        variables: {
          input: {
            marketId: id,
            ...catalogueToUpdate
          }
        }
      });
      await updateMerchandiseTiers({
        variables: {
          input: {
            marketId: id,
            ...merchandiseToUpdate
          }
        }
      });
    },
    [updateMarket, updateDoceboTiers, updateMerchandiseTiers, selectedItem]
  );

  const onSearch = (value: string): void => {
    setFilterState((prev) => ({
      ...prev,
      searched: value.toLowerCase()
    }));
  };

  useEffect(() => {
    const { searched } = filterState;
    if (searched && searched.length > 0) {
      setFilteredItems((prevStatus) => ({
        ...prevStatus,
        nodes: items.nodes.filter(
          ({ name }) =>
            name.toLowerCase().indexOf(searched.toLowerCase()) !== -1
        )
      }));
    } else {
      setFilteredItems(items);
    }
  }, [filterState]);

  useEffect(() => {
    const catalogueIds: DoceboTiers = doceboTiers.nodes
      .filter(({ marketId }) => marketId === selectedMarketId)
      .reduce(
        (prev, cur) => ({ ...prev, [cur.tierCode]: cur.doceboCatalogueId }),
        {}
      );
    const divisionIds: MerchandiseTiers = merchandiseTiers.nodes
      .filter(({ marketId }) => marketId === selectedMarketId)
      .reduce(
        (prev, cur) => ({
          ...prev,
          [`merchandise${cur.tierCode}`]: cur.merchandiseDivisionId
        }),
        {}
      );
    const item = {
      ...markets.nodes.find(({ id }) => id === selectedMarketId),
      ...catalogueIds,
      ...divisionIds
    };
    setSelectedItem(item);
  }, [selectedMarketId]);

  return (
    <div
      className={classnames(layoutStyles.searchPanelWrapper, styles.container)}
    >
      <SidePanel
        key="market-list"
        filters={filterState.filters}
        onSearchFilterChange={onSearch}
        searchLabel={t("sidePanel.search.label")}
        noResultLabel={t("sidePanel.search.noResult")}
      >
        {filteredItems.nodes.map((item: _Market) => (
          <FilterResult
            key={`market-${item.domain}`}
            onClick={() => setSelectedMarketId(item.id)}
            testId="list-item"
            label={item.name}
            isSelected={selectedMarketId === item.id}
          >
            <Typography variant="subtitle2">{`${item.domain}.intouch.bmigroup.com`}</Typography>
          </FilterResult>
        ))}
      </SidePanel>
      {selectedItem && (
        <div className={styles.detailPanel}>
          {isEditing ? (
            <Fragment>
              <Form
                onSubmit={onMarketSubmit}
                style={{ width: "100%" }}
                {...{ testId: "market-form" }}
              >
                <Grid container>
                  <Grid xs={12} item>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={0}
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      style={{ display: "flex" }}
                    >
                      <Grid item xs={10}>
                        <Typography
                          variant="h3"
                          hasUnderline
                          style={{ marginBottom: "15px" }}
                        >
                          {selectedItem.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          className={styles.editBtn}
                          onClick={() => setIsEditing(!isEditing)}
                          data-testid={"btn-show"}
                        >
                          {t("show")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  {marketKeys.map(({ key, type, label }) =>
                    type === "checkbox" ? (
                      <Grid item xs={12}>
                        <Checkbox
                          name={key}
                          label={label}
                          checked={selectedItem[`${key}`] || ""}
                          onChange={(value) => onItemChange(key, value, type)}
                        />
                      </Grid>
                    ) : (
                      <Grid key={key} xs={12} item>
                        <TextField
                          fullWidth
                          name={key}
                          label={label}
                          type={type}
                          disabled={["id"].includes(key)}
                          value={selectedItem[`${key}`] || ""}
                          onChange={(value) => onItemChange(key, value, type)}
                          {...{ "data-testid": `input-${key}` }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
                <Form.ButtonWrapper>
                  <Form.SubmitButton {...{ "data-testid": "btn-save " }}>
                    Save
                  </Form.SubmitButton>
                </Form.ButtonWrapper>
              </Form>
              {result.severity &&
                !updateMarketLoading &&
                !updateDoceboTiersLoading &&
                !updateMerchandiseTiersLoading && (
                  <div style={{ marginTop: 15 }}>
                    <AlertBanner severity={result.severity}>
                      <AlertBanner.Title>{result.title}</AlertBanner.Title>
                      {result.messages.length ? (
                        <div>
                          {result.messages.map((message, index) => (
                            <div key={`error-${index}`}>{message}</div>
                          ))}
                        </div>
                      ) : null}
                    </AlertBanner>
                  </div>
                )}
            </Fragment>
          ) : (
            <Grid {...{ testId: "market-details" }} container>
              <Grid
                item
                xs={12}
                container
                spacing={0}
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                style={{ display: "flex" }}
              >
                <Grid item xs={10}>
                  <Typography
                    variant="h3"
                    hasUnderline
                    style={{ marginBottom: "15px" }}
                  >
                    {selectedItem.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className={styles.editBtn}
                    onClick={() => setIsEditing(!isEditing)}
                    {...{ "data-testid": "btn-edit" }}
                  >
                    {t("edit")}
                  </Button>
                </Grid>
              </Grid>
              {marketKeys.map(({ key, type, label }) => (
                <Grid key={key} item xs={12}>
                  <Typography
                    component="h6"
                    variant="h6"
                    {...{ "data-testid": `detail-${key}` }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    {...{ "data-testid": `value-${key}` }}
                  >
                    {getValue(t, type, selectedItem[`${key}`])}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketPage;

export const updateMarket = gql`
  mutation updateMarket($input: UpdateMarketInput!) {
    updateMarket(input: $input) {
      query {
        markets {
          nodes {
            id
            language
            domain
            cmsSpaceId
            name
            sendName
            sendMailbox
            doceboInstallersBranchId
            doceboCompanyAdminBranchId
            merchandisingUrl
            merchandiseSso
            projectsEnabled
            locationBiasRadiusKm
            gtag
            gtagMarketMedia
            optanonClass
          }
        }
      }
    }
  }
`;

export const updateDoceboTiersByMarket = gql`
  mutation updateDoceboTiersByMarket($input: UpdateDoceboTiersByMarketInput!) {
    updateDoceboTiersByMarket(input: $input) {
      id
      docebo_catalogue_id
      market_id
      tier_code
    }
  }
`;

export const updateMerchandiseTiersByMarket = gql`
  mutation updateMerchandiseTiersByMarket(
    $input: UpdateMerchandiseTiersByMarketInput!
  ) {
    updateMerchandiseTiersByMarket(input: $input) {
      id
      merchandise_division_id
      market_id
      tier_code
    }
  }
`;
