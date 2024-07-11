import createFormData from "./FormSectionHelper";
import type { Data as SignUpBlockData } from "../../components/SignupBlock";

const createSignUpBlockData = (
  signUpBlock?: Partial<SignUpBlockData>
): SignUpBlockData => ({
  __typename: "SignupBlock",
  title: "Title",
  signUpBlockDescription: "Description",
  signupLabel: "Label",
  signupDialogContent: createFormData(),
  ...signUpBlock
});

export default createSignUpBlockData;
