import { ServiceError, Subscription } from "@google-cloud/pubsub";
import logger from "@bmi-digital/functions-logger";
import { pubSubClient, TOPIC_NAME } from "./index";

export const getAllSubscription = () => {
  return pubSubClient.getSubscriptions(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (err: ServiceError | null, subscriptions: Subscription[]) => {
      if (err) {
        logger.error({ message: err.message });
      } else {
        subscriptions.map((e) => {
          logger.info({
            message: `RECEIVED SUB: name: ${e.name}, topic: ${e.topic}, ${e.iam}`
          });
        });
      }
    }
  );
};
export const subscribe = () => {
  const sub = pubSubClient.subscription(`${TOPIC_NAME}-subscriber`);
  sub.on("UPDATE", (message) => {
    logger.info({
      message: `RECEIVED UPDATE SUB: name: ${message.data}`
    });
  });
  sub.on("DELETE", (message) => {
    logger.info({
      message: `RECEIVED DELETE SUB: name: ${message.data}`
    });
  });
};

getAllSubscription();
subscribe();
