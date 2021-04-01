/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export function helloPubSub(event, context) {
  const message = Buffer.from(event.data, "base64").toString();

  // eslint-disable-next-line no-console
  console.log(message);
}
