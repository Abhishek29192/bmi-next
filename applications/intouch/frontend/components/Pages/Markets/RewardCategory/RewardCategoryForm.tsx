import React, { useState, useCallback } from "react";
import {
  Table,
  Grid,
  Typography,
  Button,
  Form,
  TextField
} from "@bmi/components";
import { useTranslation } from "next-i18next";
import { useUpdateRewardTiersMutation } from "../../../../graphql/generated/hooks";
import { QueryRewardTierByMarketIdQuery } from "../../../../graphql/generated/operations";
import log from "../../../../lib/logger";

export type RewardCategoryFormProps = {
  category: string;
  data: QueryRewardTierByMarketIdQuery["rewardTiers"]["nodes"];
  getRewardTiers: () => void;
};

export const RewardCategoryForm = ({
  category,
  data,
  getRewardTiers
}: RewardCategoryFormProps) => {
  const { t } = useTranslation("admin-markets");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState(data);
  const [updateRewardTiers, { loading }] = useUpdateRewardTiersMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating reward tiers: ${error.toString()}`
      });
    },
    onCompleted: async () => {
      await getRewardTiers();
      setIsEditing(false);
    }
  });
  const handleOnSumbit = useCallback(
    async (event) => {
      event.preventDefault();
      await updateRewardTiers({
        variables: {
          input: {
            rewardTiers: formData.map(({ id, rewardPoint }) => ({
              id,
              rewardPoint: rewardPoint
            }))
          }
        }
      });
    },
    [updateRewardTiers, formData]
  );

  const onItemChange = useCallback(
    (id, value) => {
      const newFormData = [...formData];
      newFormData[`${id}`] = {
        ...formData[`${id}`],
        rewardPoint: parseInt(value)
      };
      setFormData(newFormData);
    },
    [setFormData, formData]
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <Typography variant="body1">{category}</Typography>
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
      <Grid item xs={12}>
        {isEditing ? (
          <Form
            onSubmit={handleOnSumbit}
            style={{ width: "100%" }}
            {...{ testId: "reward-system-form" }}
          >
            <Grid container>
              {formData.map(({ tierCode, rewardPoint }, id) => (
                <Grid
                  item
                  xs={12}
                  key={`reward-category-form-${category}-${tierCode}`}
                >
                  <TextField
                    fullWidth
                    name={`${category}-${tierCode}-reward-point`}
                    label={`${tierCode} Reward Point`}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={rewardPoint?.toString() || ""}
                    onChange={(value) => onItemChange(id, value)}
                  />
                </Grid>
              ))}
            </Grid>
            <Form.ButtonWrapper>
              <Form.SubmitButton
                {...{ "data-testid": "btn-save" }}
                disabled={loading}
              >
                Save
              </Form.SubmitButton>
            </Form.ButtonWrapper>
          </Form>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Tier</Table.Cell>
                <Table.Cell>Point Awarded</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {formData.map(({ tierCode, rewardPoint }) => (
                <Table.Row key={`reward-category-${category}-${tierCode}`}>
                  <Table.Cell>{tierCode}</Table.Cell>
                  <Table.Cell>{rewardPoint}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Grid>
    </React.Fragment>
  );
};
