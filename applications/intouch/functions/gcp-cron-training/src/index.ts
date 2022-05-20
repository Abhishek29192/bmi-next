import TrainingClient from "./TrainingClient";

export const updateTraining = async (postEvent: any, context: any) => {
  const trainingClient = await TrainingClient.create();

  try {
    const current_date = new Date().getTime();

    await trainingClient.updateTrainingDB();
    await trainingClient.setLastUpdatedDate(`${current_date}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

//updateTraining(null, null);
