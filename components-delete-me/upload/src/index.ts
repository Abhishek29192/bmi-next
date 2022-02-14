// istanbul ignore file: doesn't hold any logic
import Upload, { Props as UploadProps } from "./Upload";

export { getFileSizeString } from "./_File";
export type { UploadFile } from "./_File";

export type Props = UploadProps;
export default Upload;
