import { gql } from "@apollo/client";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Checkbox from "@bmi/checkbox";
import TextField from "@bmi/text-field";
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
  { type: "text", key: "id" },
  { type: "text", key: "language" },
  { type: "text", key: "domain" },
  { type: "text", key: "cmsSpaceId" },
  { type: "text", key: "name" },
  { type: "text", key: "sendName" },
  { type: "text", key: "sendMailbox" },
  { type: "text", key: "doceboInstallersBranchId" },
  { type: "text", key: "doceboCompanyAdminBranchId" },
  { type: "text", key: "doceboCatalogueId" },
  { type: "text", key: "merchandisingUrl" },
  { type: "checkbox", key: "projectsEnabled" },
  { type: "text", key: "locationBiasRadiusKm" },
  { type: "text", key: "gtag" }
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

const MarketPage = ({ markets }: Props) => {
  const { t } = useTranslation("admin-markets");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [items, setItems] = useState<MarketList>(markets);
  const [filteredItems, setFilteredItems] = useState<MarketList>(markets);
  const [filterState, setFilterState] = useState({
    searched: null,
    filters: []
  });

  const [selectedItem, setSelectedItem] = useState<_Market>();

  const [udpateMarket] = useUpdateMarketMutation({
    onCompleted: (data) => {
      setItems(data?.updateMarket?.query.markets);
    }
  });

  const onItemChange = useCallback(
    (name, value) => {
      setSelectedItem((prev) => ({
        ...prev,
        [name]: value
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
    if (searched?.length > 0) {
      setFilteredItems((prevStatus) => ({
        ...prevStatus,
        nodes: items.nodes.filter(
          ({ name }) =>
            name?.toLowerCase().indexOf(searched?.toLowerCase()) !== -1
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
        {filteredItems?.nodes.map((item: _Market, index: number) => (
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
                {marketKeys.map(({ key, type }) =>
                  type === "checkbox" ? (
                    <Grid item xs={12}>
                      <Checkbox
                        name="published"
                        label={t("published")}
                        checked={selectedItem[`${key}`] || ""}
                        onChange={(value) => onItemChange(key, value)}
                      />
                    </Grid>
                  ) : (
                    <Grid key={key} xs={12} item>
                      <TextField
                        fullWidth
                        name={key}
                        label={t(key)}
                        disabled={["id"].includes(key)}
                        value={selectedItem[`${key}`] || ""}
                        onChange={(value) => onItemChange(key, value)}
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
              {marketKeys.map(({ key, type }) => (
                <Grid key={key} item xs={12}>
                  <Typography
                    component="h6"
                    variant="h6"
                    {...{ "data-testid": `detail-${key}` }}
                  >
                    {t(key)}
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
          }
        }
      }
    }
  }
`;
