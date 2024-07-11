import resolveSignUpBlock from "../ContentfulSignUpBlock";
import createContentfulSignUpBlock from "../types/helpers/ContentfulSignUpBlockHelper";
import createContentfulFormSectionData from "../types/helpers/ContentfulFormSectionHelper";
import type { ContentfulFormSection } from "../types/FormSection";

const resolveFormSectionMock = jest.fn();
jest.mock("../ContentfulFormSection", () => ({
  __esModule: true,
  default: (formSectionData: ContentfulFormSection) =>
    resolveFormSectionMock(formSectionData)
}));

afterEach(() => {
  jest.resetAllMocks();
});

beforeEach(() => {
  resolveFormSectionMock.mockResolvedValue("resolved-form");
});

describe("ContentfulSignUpBlock resolver", () => {
  it("returns correct data if all the allowed fields provided", async () => {
    const signUpBlock = createContentfulSignUpBlock({
      __typename: "SignupBlock",
      title: "Title",
      signUpBlockDescription: "Description",
      signupLabel: "Label",
      signupDialogContent: createContentfulFormSectionData()
    });

    expect(await resolveSignUpBlock(signUpBlock)).toEqual({
      __typename: "SignupBlock",
      title: "Title",
      signUpBlockDescription: "Description",
      signupLabel: "Label",
      signupDialogContent: "resolved-form"
    });
    expect(resolveFormSectionMock).toHaveBeenCalledWith(
      signUpBlock.signupDialogContent
    );
  });
});
