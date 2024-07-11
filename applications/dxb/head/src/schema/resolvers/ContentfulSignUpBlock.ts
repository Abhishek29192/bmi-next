import resolveForm from "./ContentfulFormSection";
import type { ContentfulSignUpBlockData } from "./types/SignUpBlock";
import type { Data as SignUpBlockData } from "../../components/SignupBlock";

const resolveSignUpBlock = async ({
  signupDialogContent,
  ...rest
}: ContentfulSignUpBlockData): Promise<SignUpBlockData> => ({
  ...rest,
  signupDialogContent: await resolveForm(signupDialogContent)
});

export default resolveSignUpBlock;
