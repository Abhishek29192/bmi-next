import { Grid, Typography, Dialog, AnchorLink } from "@bmi/components";
import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import Check from "@material-ui/icons/Check";
import { CircularProgress } from "../../../CircularProgress";
import { LinearProgress } from "../../../LinearProgress";
import {
  useGetCompanyRewardRecordMutation,
  useCreateRewardRequestMutation,
  useGetRewardRequestsLazyQuery
} from "../../../../graphql/generated/hooks";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { useMarketContext } from "../../../../context/MarketContext";
import { useAccountContext } from "../../../../context/AccountContext";
import styles from "./styles.module.scss";

export type RewardSummaryProps = {
  company: GetCompanyQuery["company"];
};

export const RewardSummary = ({ company }: RewardSummaryProps) => {
  const maximumRewardPoints = 1000;
  const numberOfStages = 4;
  const stageMax = Array(4).fill(maximumRewardPoints / numberOfStages);

  const { t } = useTranslation("company-page");
  const { market } = useMarketContext();
  const { account } = useAccountContext();
  const [rewardPoints, setRewardPoints] = useState({ points: 0, circular: 0 });
  const [stageClaimed, setStageClaimed] = useState([]);
  const [isModalOpen, setModalOpen] = useState({ stage: 0, isOpen: false });
  const [isClaimed, setIsClaimed] = useState(false);
  const [getCompanyRewardRecord] = useGetCompanyRewardRecordMutation({
    variables: {
      input: {
        companyId: company.id,
        rewardEffectiveDate: market.rewardEffectiveDate
      }
    },
    onCompleted: ({ getCompanyRewardRecord: { points } }) => {
      const achievedPoints =
        points > maximumRewardPoints ? maximumRewardPoints : points;
      setRewardPoints({
        points: achievedPoints,
        circular:
          points < maximumRewardPoints
            ? (points / maximumRewardPoints) * 100
            : 100
      });
    }
  });
  const [createRewardRequest, { loading }] = useCreateRewardRequestMutation({
    onCompleted: () => {
      setIsClaimed(true);
      getCompanyRewardRequest();
    }
  });
  const [getCompanyRewardRequest] = useGetRewardRequestsLazyQuery({
    variables: {
      companyId: company.id
    },
    onCompleted: ({ rewardRequests: { nodes } }) => {
      setStageClaimed(
        Array(numberOfStages)
          .fill(null)
          .map((_, id) =>
            nodes.some(
              ({ rewardPoint }) =>
                rewardPoint ===
                stageMax.slice(0, id + 1).reduce((acc, value) => acc + value, 0)
            )
          )
      );
    }
  });
  const onSubmitRequest = () => {
    createRewardRequest({
      variables: {
        input: {
          rewardRequest: {
            marketId: market.id,
            accountId: account.id,
            companyId: company.id,
            rewardPoint: stageMax
              .slice(0, isModalOpen.stage)
              .reduce((acc, value) => acc + value, 0)
          }
        }
      }
    });
  };
  const onCloseClick = () => {
    setModalOpen({ ...isModalOpen, isOpen: false });
    setIsClaimed(false);
  };
  const handleModalOpen = (stage) => {
    setModalOpen({ stage, isOpen: true });
  };

  useEffect(() => {
    getCompanyRewardRecord();
    getCompanyRewardRequest();
  }, [getCompanyRewardRecord, company]);

  return (
    market.rewardEffectiveDate && (
      <AccessControl dataModel="company" action="viewReward">
        <div className={styles.main}>
          <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
            {t("reward.title")}
          </Typography>
          <div className={styles.body}>
            <Grid container>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <CircularProgress value={rewardPoints.circular} />
              </Grid>
              {Array(numberOfStages)
                .fill(null)
                .map((_, id) => {
                  const currentStageMax = stageMax[`${id}`];
                  const value =
                    rewardPoints.points - currentStageMax * id < currentStageMax
                      ? Math.max(rewardPoints.points - currentStageMax * id, 0)
                      : currentStageMax;
                  const status = stageClaimed[`${id}`]
                    ? "claimed"
                    : value === currentStageMax
                    ? "completed"
                    : rewardPoints.points - currentStageMax * id < 0
                    ? "pending"
                    : "inProgress";
                  return (
                    <Grid item xs={12} key={`stage-progress-${id + 1}`}>
                      <div className={styles.linearProgressTitle}>
                        <Typography variant="body3">{`${t("reward.stage")} ${
                          id + 1
                        }`}</Typography>
                        <Typography variant="body3">
                          {value === currentStageMax && (
                            <Check
                              style={{
                                color: "green",
                                height: "0.667rem",
                                top: "3px",
                                position: "relative"
                              }}
                            />
                          )}
                          {t(`reward.status.${status}`)}
                        </Typography>
                      </div>
                      {!stageClaimed[`${id}`] &&
                        (value === currentStageMax ? (
                          <AccessControl
                            dataModel="company"
                            action="claimReward"
                          >
                            <AnchorLink onClick={() => handleModalOpen(id + 1)}>
                              {t("reward.claimLabel")}
                            </AnchorLink>
                          </AccessControl>
                        ) : (
                          <LinearProgress
                            value={(value / currentStageMax) * 100}
                            stageValue={value}
                            max={currentStageMax}
                          />
                        ))}
                    </Grid>
                  );
                })}
              <Dialog
                open={isModalOpen.isOpen}
                onCloseClick={onCloseClick}
                className={styles.rewardDialog}
              >
                {isClaimed ? (
                  <>
                    <Dialog.Title hasUnderline>
                      {t(`reward.claimRewardDialog.acknowledgement.title`)}
                    </Dialog.Title>
                    <Dialog.Content>
                      {t(
                        `reward.claimRewardDialog.acknowledgement.description`,
                        {
                          stage: isModalOpen.stage
                        }
                      )}
                    </Dialog.Content>
                    <Dialog.Actions
                      cancelLabel={t("reward.claimRewardDialog.closeLabel")}
                      onCancelClick={onCloseClick}
                    />
                  </>
                ) : (
                  <>
                    <Dialog.Title
                      className={styles.rewardDialogTitle}
                      hasUnderline
                    >
                      {t(`reward.claimRewardDialog.title`)}
                    </Dialog.Title>
                    <Dialog.Content>
                      {t(`reward.claimRewardDialog.description`)}
                    </Dialog.Content>
                    <Dialog.Actions
                      cancelLabel={t("reward.claimRewardDialog.cancelLabel")}
                      confirmLabel={t(`reward.claimRewardDialog.confirmLabel`)}
                      isConfirmButtonDisabled={loading}
                      onConfirmClick={onSubmitRequest}
                      onCancelClick={onCloseClick}
                    />
                  </>
                )}
              </Dialog>
            </Grid>
          </div>
        </div>
      </AccessControl>
    )
  );
};
