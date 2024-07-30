import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TeamList, { Data } from "../TeamList";
import { DataTypeEnum } from "../link/types";

describe("TeamList component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      }
    ];

    const { container } = render(
      <ThemeProvider>
        <TeamList data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with more than 8", () => {
    const data: Data = [
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      },
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: []
      }
    ];

    const { container } = render(
      <ThemeProvider>
        <TeamList data={data} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText("MC: global.showMore"));

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with links", () => {
    const data: Data = [
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          __typename: "Image",
          title: "Title",
          type: null,
          altText: "Lorem ipsum",
          focalPoint: null,
          image: {
            fileName: "Lorem ipsum",
            contentType: "image/png",
            url: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/?fm=png",
            width: 200,
            height: 200,
            size: 100
          }
        },
        links: [
          {
            __typename: "Link",
            id: "00000000-0000-0000-0000-000000000000",
            label: "Contact us",
            icon: null,
            isLabelHidden: null,
            url: null,
            linkedPage: {
              path: "contact-us"
            },
            type: DataTypeEnum.Internal,
            parameters: null,
            dialogContent: null,
            hubSpotCTAID: null,
            queryParams: null
          }
        ]
      }
    ];

    const { container } = render(
      <ThemeProvider>
        <TeamList data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
