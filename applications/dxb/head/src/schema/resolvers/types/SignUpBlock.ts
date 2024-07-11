import type { Data as SignUpBlockData } from "../../../components/SignupBlock";
import type { ContentfulFormSection } from "./FormSection";

export type ContentfulSignUpBlockData = Omit<
  SignUpBlockData,
  "signupDialogContent"
> & {
  signupDialogContent: ContentfulFormSection;
};
