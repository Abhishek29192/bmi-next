import React from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import CompanyMembersPage, { PageProps } from "..";
import { companyMembers } from "../../../../fixtures/companyMembers";

describe("Company Members Page", () => {
  let wrapper;

  let props: PageProps = {
    data: companyMembers
  };
  beforeEach(() => {
    wrapper = render(<CompanyMembersPage {...props} />);
  });

  describe("Member List", () => {
    it("should render members if exists", () => {
      expect(wrapper.queryAllByTestId("list-item")).toHaveLength(4);
    });

    it("should render all the informations", () => {
      let item = wrapper.getAllByTestId("list-item")[0];
      let utils = within(item);
      utils.getByText("Alex Green");
      utils.getByText("company admin");
      utils.getByTestId("icon-FLAT");
      utils.getByTestId("icon-PITCHED");

      item = wrapper.getAllByTestId("list-item")[1];
      utils = within(item);
      utils.getByText("Aron Musk");
      utils.getByText("installer");
      utils.getByTestId("icon-FLAT");
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

        screen.getByText("Member not found");
      });
    });
  });
});
