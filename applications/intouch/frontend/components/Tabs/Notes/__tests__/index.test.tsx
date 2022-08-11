import React, { useRef } from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { NoteTab } from "..";
import { generateProject } from "../../../../lib/tests/factories/project";

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

jest.mock("../../../../graphql/generated/hooks", () => ({
  useAddProjectNoteMutation: () => [jest.fn()]
}));

describe("NoteTab Components", () => {
  const project = generateProject();
  describe("render correct number of notes", () => {
    it("none", () => {
      renderWithI18NProvider(
        <AccountContextWrapper>
          <NoteTab accountId={1} project={project} notes={[]} />
        </AccountContextWrapper>
      );

      expect(screen.queryByTestId("note-item")).toBeNull();
    });
    it("one note", () => {
      const notes: GetProjectQuery["project"]["notes"]["nodes"] = [
        {
          id: 1,
          body: "Note body",
          senderName: "firstName lastName",
          createdAt: "01/01/01"
        }
      ];
      renderWithI18NProvider(
        <AccountContextWrapper>
          <NoteTab accountId={1} project={project} notes={notes} />
        </AccountContextWrapper>
      );
      expect(screen.getAllByTestId("note-item")).toHaveLength(1);
    });
    it("3 notes", () => {
      const notes: GetProjectQuery["project"]["notes"]["nodes"] = [
        {
          id: 1,
          body: "Note body",
          senderName: "firstName lastName",
          createdAt: "01/01/01"
        },
        {
          id: 2,
          body: "Note body",
          senderName: "firstName lastName",
          createdAt: "01/01/01"
        },
        {
          id: 3,
          body: "Note body",
          senderName: "firstName lastName",
          createdAt: "01/01/01"
        }
      ];
      renderWithI18NProvider(
        <AccountContextWrapper>
          <NoteTab accountId={1} project={project} notes={notes} />
        </AccountContextWrapper>
      );
      expect(screen.getAllByTestId("note-item")).toHaveLength(3);
    });
  });
});
