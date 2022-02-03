import { gql } from "@apollo/client";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import TextField from "@bmi/text-field";
import Checkbox from "@bmi/checkbox";
import Button from "@bmi/button";
import Form from "@bmi/form";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import classnames from "classnames";
import { SidePanel } from "../../../components/SidePanel";
import { FilterResult } from "../../FilterResult";
import { formatDate } from "../../../lib/utils";
import { useUpdateMarketMutation } from "../../../graphql/generated/hooks";
import {
  MarketsQuery,
  UpdateMarketMutation
} from "../../../graphql/generated/operations";
import layoutStyles from "../../Layout/styles.module.scss";
import styles from "./styles.module.scss";

type Props = {
  markets: MarketsQuery["markets"];
};

type MarketList =
  | MarketsQuery["markets"]
  | UpdateMarketMutation["updateMarket"]["query"]["markets"];
type _Market = MarketList["nodes"][0];

const marketKeys = [
  { type: "text", key: "id", label: "Id" },
  { type: "text", key: "language", label: "Language" },
  { type: "text", key: "domain", label: "Domain" },
  { type: "text", key: "cmsSpaceId", label: "Cms space Id" },
  { type: "text", key: "name", label: "Name" },
  { type: "text", key: "sendName", label: "Send name" },
  { type: "text", key: "sendMailbox", label: "Send mailbox" },
  {
    type: "text",
    key: "doceboInstallersBranchId",
    label: "Docebo installers branch id"
  },
  {
    type: "text",
    key: "doceboCompanyAdminBranchId",
    label: "Docebo company admin branch id"
  },
  { type: "number", key: "doceboCatalogueId", label: "Docebo catalogue id" },
  { type: "text", key: "merchandisingUrl", label: "Merchandising url" },
  { type: "checkbox", key: "projectsEnabled", label: "Projects enabled" },
  {
    type: "number",
    key: "locationBiasRadiusKm",
    label: "Location biasRadius Km"
  },
  { type: "text", key: "gtag", label: "Gtag" },
  { type: "text", key: "gtagMarketMedia", label: "Gtag market media" }
];

const getValue = (t, type, value) => {
  switch (type) {
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

type ResultProps = {
  severity: "error" | "warning" | "info" | "success" | null;
  title: string | null;
  messages?: string[] | null;
};

const MarketPage = ({ markets }: Props) => {
  const { t } = useTranslation("admin-markets");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [result, setResult] = useState<ResultProps>({
    severity: null,
    title: null,
    messages: null
  });
  const [items, setItems] = useState<MarketList>(markets);
  const [filteredItems, setFilteredItems] = useState<MarketList>(markets);
  const [filterState, setFilterState] = useState({
    searched: null,
    filters: []
  });

  const [selectedItem, setSelectedItem] = useState<_Market>();

  const [udpateMarket] = useUpdateMarketMutation({
    onError: ({ networkError }) => {
      setResult({
        severity: "error",
        title: t("error"),
        messages: networkError?.["result"]?.errors?.map(
          ({ message }) => message
        )
      });
    },
    onCompleted: (data) => {
      setItems(data?.updateMarket?.query.markets);
      setResult({
        title: t("success"),
        severity: "success"
      });
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
    (event) => {
      event.preventDefault();
      const { id, __typename, ...rest } = selectedItem;
      udpateMarket({
        variables: {
          input: {
            id,
            patch: {
              ...rest
            }
          }
        }
      });
    },
    [udpateMarket, selectedItem]
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
            name?.toLowerCase().indexOf(searched.toLowerCase()) !== -1
        )
      }));
    } else {
      setFilteredItems(items);
    }
  }, [filterState]);

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
        {filteredItems.nodes.map((item: _Market, index: number) => (
          <div key={`market-${index}`} onClick={(e) => setSelectedItem(item)}>
            <FilterResult
              testId="list-item"
              label={item.name}
              key={item.domain}
            >
              <Typography variant="subtitle2">{`${item.domain}.intouch.bmigroup.com`}</Typography>
            </FilterResult>
          </div>
        ))}
      </SidePanel>
      {selectedItem && (
        <div className={styles.detailPanel}>
          {isEditing ? (
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
                    justify="space-between"
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
                      >
                        {!isEditing ? t("edit") : t("show")}
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
              {result.title ? (
                <div style={{ marginTop: 15 }}>
                  <AlertBanner severity={result?.severity}>
                    <AlertBanner.Title>{result?.title}</AlertBanner.Title>
                    <div>
                      {result?.messages?.map((message, index) => (
                        <div key={`error-${index}`}>{message}</div>
                      ))}
                    </div>
                  </AlertBanner>
                </div>
              ) : null}
            </Form>
          ) : (
            <Grid {...{ testId: "market-details" }} container>
              <Grid
                item
                xs={12}
                container
                spacing={0}
                direction="row"
                alignItems="flex-start"
                justify="space-between"
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
                    {!isEditing ? t("edit") : t("show")}
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
            doceboCatalogueId
            merchandisingUrl
            projectsEnabled
            locationBiasRadiusKm
            gtag
            gtagMarketMedia
          }
        }
      }
    }
  }
`;
