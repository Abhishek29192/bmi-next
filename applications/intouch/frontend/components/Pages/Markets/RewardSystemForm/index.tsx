import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Typography,
  Button,
  Checkbox,
  Form,
  TextField
} from "@bmi/components";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";
import log from "../../../../lib/logger";
import { useUpdateMarketMutation } from "../../../../graphql/generated/hooks";
import { MarketList } from "..";

export type RewardSystemFormProps = {
  market: MarketList["nodes"][0];
  markets: MarketList;
  updateMarkets: React.Dispatch<React.SetStateAction<MarketList>>;
};

export const RewardSystemForm = ({
  market,
  markets,
  updateMarkets
}: RewardSystemFormProps) => {
  const { t } = useTranslation("admin-markets");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState(null);
  const [updateMarket, { loading: updateMarketLoading }] =
    useUpdateMarketMutation({
      onError: (error) => {
        log({
          severity: "ERROR",
          message: `There was an error fetching reward tiers: ${error.toString()}`
        });
      },
      onCompleted: ({ updateMarket }) => {
        updateMarkets({ ...markets, ...updateMarket.query.markets });
        setIsEditing(false);
      }
    });

  useEffect(() => {
    setFormData({
      isEnabled: !!market.rewardEffectiveDate,
      rewardEffectiveDate: market.rewardEffectiveDate
        ? dayjs(market.rewardEffectiveDate).format("MM-DD-YYYY")
        : null
    });
  }, [market]);

  const handleOnSumbit = useCallback(
    async (event) => {
      event.preventDefault();
      await updateMarket({
        variables: {
          input: {
            id: market.id,
            patch: {
              rewardEffectiveDate: formData.isEnabled
                ? new Date(formData.rewardEffectiveDate)
                : null
            }
          }
        }
      });
    },
    [updateMarket, formData]
  );

  const onItemChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    [setFormData]
  );

  return (
    <Grid container data-testid="reward-system-form">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h4" style={{ marginBottom: "15px" }}>
              Reward System
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: "right" }}>
            <Button
              {...{ "data-testid": "reward-category-btn-edit" }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? t("show") : t("edit")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {formData &&
        (isEditing ? (
          <Grid item xs={12}>
            <Form
              onSubmit={handleOnSumbit}
              style={{ width: "100%" }}
              {...{ testId: "reward-system-form" }}
            >
              <Grid item xs={12}>
                <Checkbox
                  name="isEnabled"
                  label="Reward System Enabled"
                  checked={formData.isEnabled}
                  onChange={(value) => onItemChange("isEnabled", !!value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="rewardEffectiveDate"
                  label="Reward Effective Date"
                  type="text"
                  disabled={!formData.isEnabled}
                  value={formData.rewardEffectiveDate || ""}
                  helperText="format: MM-DD-YYYY"
                  onChange={(value) =>
                    onItemChange("rewardEffectiveDate", value)
                  }
                />
              </Grid>
              <Form.ButtonWrapper>
                <Form.SubmitButton
                  {...{ "data-testid": "btn-save " }}
                  disabled={updateMarketLoading}
                >
                  Save
                </Form.SubmitButton>
              </Form.ButtonWrapper>
            </Form>
          </Grid>
        ) : (
          <React.Fragment>
            <Grid item xs={12}>
              <Typography component="h6" variant="h6">
                Reward System Enabled
              </Typography>
              <div>{formData.rewardEffectiveDate ? "enabled" : "disabled"}</div>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h6" variant="h6">
                Reward Effective Date
              </Typography>
              <div>{formData.rewardEffectiveDate || "null"}</div>
            </Grid>
          </React.Fragment>
        ))}
    </Grid>
  );
};
