import { screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import createRichText from "../../__tests__/helpers/RichTextHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import TeamSection, { Data, TeamCategoryType } from "../TeamSection";
import { RichTextData } from "../RichText";

const teamCategory: TeamCategoryType = {
  id: "team-category-id",
  title: "Team category title",
  description: null,
  team_member: [
    {
      name: "Team Memeber",
      jobTitle: "Job Title",
      profileImage: createImageData(),
      links: []
    }
  ]
};

const data: Data = {
  title: "team Section Title",
  __typename: "ContentfulTeamSection",
  backgroundColor: "White",
  teamCategories: [teamCategory]
};

const teamCategoryDescription: RichTextData["json"] = {
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: "Team category description",
          nodeType: "text"
        }
      ],
      nodeType: BLOCKS.PARAGRAPH
    }
  ],
  nodeType: BLOCKS.DOCUMENT
};

describe("TeamSection component", () => {
  it("renders tabs if renderTeamCategoriesInColumn === false", () => {
    renderWithProviders(
      <ConfigProvider configOverride={{ renderTeamCategoriesAsRows: false }}>
        <TeamSection data={data} />
      </ConfigProvider>
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("should not render tabs if renderTeamCategoriesInColumn === true", () => {
    renderWithProviders(
      <ConfigProvider configOverride={{ renderTeamCategoriesAsRows: true }}>
        <TeamSection data={data} />
      </ConfigProvider>
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("renders team category with the description when renderTeamCategoriesInColumn === false", () => {
    renderWithProviders(
      <ConfigProvider configOverride={{ renderTeamCategoriesAsRows: false }}>
        <TeamSection
          data={{
            ...data,
            teamCategories: [
              {
                ...teamCategory,
                description: createRichText({
                  json: teamCategoryDescription
                })
              }
            ]
          }}
        />
      </ConfigProvider>
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByText("Team category description")).toBeInTheDocument();
  });

  it("renders description only for the first team category when renderTeamCategoriesInColumn === true", () => {
    const secondTeamCategoryDescription: RichTextData["json"] = {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: "Second team category description",
              nodeType: "text"
            }
          ],
          nodeType: BLOCKS.PARAGRAPH
        }
      ],
      nodeType: BLOCKS.DOCUMENT
    };

    const teamCategories = [
      {
        ...teamCategory,
        id: "team-category-id-1",
        description: createRichText({
          json: teamCategoryDescription
        })
      },
      {
        ...teamCategory,
        id: "team-category-id-2",
        description: createRichText({
          json: secondTeamCategoryDescription
        })
      }
    ];

    renderWithProviders(
      <ConfigProvider configOverride={{ renderTeamCategoriesAsRows: true }}>
        <TeamSection
          data={{
            ...data,
            teamCategories
          }}
        />
      </ConfigProvider>
    );

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByText("Team category description")).toBeInTheDocument();
    expect(
      screen.queryByText("Second team category description")
    ).not.toBeInTheDocument();
  });
});
