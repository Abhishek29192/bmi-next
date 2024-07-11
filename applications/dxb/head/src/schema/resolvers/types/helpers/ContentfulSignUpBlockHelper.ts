import createContentfulFormSectionData from "./ContentfulFormSectionHelper";
import type { ContentfulSignUpBlockData } from "../SignUpBlock";

const createContentfulSignUpBlock = (
  signUpBlock?: Partial<ContentfulSignUpBlockData>
): ContentfulSignUpBlockData => ({
  __typename: "SignupBlock",
  title: "Title",
  signUpBlockDescription: "Description",
  signupLabel: "Label",
  signupDialogContent: createContentfulFormSectionData(),
  ...signUpBlock
});

export default createContentfulSignUpBlock;
