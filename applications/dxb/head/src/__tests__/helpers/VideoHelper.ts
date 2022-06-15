import { createVideo as createFirestoreVideo } from "@bmi/firestore-types";
import { Video } from "../../types/pim";

const createVideo = (video?: Partial<Video>): Video => {
  const firestoreVideo = createFirestoreVideo() as Video;
  return { ...firestoreVideo, ...video };
};

export default createVideo;
