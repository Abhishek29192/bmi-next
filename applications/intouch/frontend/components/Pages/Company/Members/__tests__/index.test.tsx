import "@testing-library/jest-dom";
import React, { useRef } from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import Apollo from "../../../../../lib/tests/fixtures/apollo";
import CompanyMembersPage, { PageProps } from "..";
import { companyMembers } from "../../../../../fixtures/companyMembers";

const inviteMock = jest.fn();
jest.mock("../../../../../graphql/generated/hooks", () => ({
  useInviteMutation: () => [inviteMock]
}));
jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

describe("Company Members Page", () => {
  let wrapper;

  let props: PageProps = {
    data: companyMembers
  };
  beforeEach(() => {
    wrapper = render(
      <Apollo>
        <I18nProvider>
          <CompanyMembersPage {...props} />
        </I18nProvider>
      </Apollo>
    );
  });

  describe("Member List", () => {
    it("should render members if exists", () => {
      expect(wrapper.queryAllByTestId("list-item")).toHaveLength(4);
    });

    it("should render all the informations", () => {
      const elements = wrapper.getAllByTestId("list-item");
      let listItem = elements[0];
      expect(listItem).toHaveTextContent("Alex Green");
      expect(listItem).toHaveTextContent("company admin");
      within(listItem).getByTestId("icon-FLAT");
      within(listItem).getByTestId("icon-PITCHED");

      listItem = elements[1];
      expect(listItem).toHaveTextContent("Aron Musk");
      expect(listItem).toHaveTextContent("installer");
      within(listItem).getByTestId("icon-FLAT");
    });

    describe("Search", () => {
      describe("by name", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "alex" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "ale" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      describe("by surname", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Green" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Gree" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      describe("by email", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Aron@Musk.co.uk" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Aron@Mus" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      it("should show a label if not users found", () => {
        fireEvent.change(wrapper.container.querySelector("#filter"), {
          target: { value: "abcde" }
        });
        expect(wrapper.queryAllByTestId("list-item")).toHaveLength(0);

        screen.getByText("sidePanel.search.noResult");
      });
    });
  });

  describe("Details", () => {
    it("should have a default user", () => {
      const userCard = screen.getByTestId("user-card");
      expect(userCard).toHaveTextContent("Alex Green");
      expect(userCard).toHaveTextContent("company admin");
    });

    it("should show certifications", () => {
      const table = screen.getByTestId("certification-table");
      expect(table).toHaveTextContent("Certification name 1");
      expect(table).toHaveTextContent("Certification name 11");
    });

    it("show another member", async () => {
      fireEvent.click(screen.getByText("Aron Musk"));

      const userCard = screen.getByTestId("user-card");
      expect(userCard).toHaveTextContent("Aron Musk");
      expect(userCard).toHaveTextContent("installer");

      const table = screen.getByTestId("certification-table");
      expect(table).toHaveTextContent("Certification name 2");
      expect(table).toHaveTextContent("Certification name 22");
    });

    describe("Member invitation", () => {
      it("should invite new users", () => {
        fireEvent.click(screen.getByTestId("footer-btn"));
        fireEvent.change(screen.getByTestId("emails"), {
          target: {
            value: "email@email.co.uk, email1@email.co.uk"
          }
        });
        fireEvent.change(screen.getByTestId("personalNote"), {
          target: {
            value: "Lorem ipsum"
          }
        });
        fireEvent.click(screen.getByTestId("submit"));

        expect(inviteMock).toHaveBeenCalledWith({
          variables: {
            input: {
              emails: ["email@email.co.uk", "email1@email.co.uk"],
              personalNote: "Lorem ipsum"
            }
          }
        });
      });
    });
  });
});
