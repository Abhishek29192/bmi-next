// istanbul ignore file: doesn't hold any logic

export const file = {
  url: "//assets.ctfassets.net/18fop5x17y3g/4uRPslBQGbZNmJRWBzomYQ/8225336f7b6dddde748e5204dbe5a474/Monarflex-prisliste-1juni2022.pdf",
  details: {
    size: 267526
  },
  fileName: "Monarflex-prisliste-1juni2022.pdf",
  contentType: "application/pdf"
};
export const assetType = { name: "Prislister", code: "PL" };
export const contenfulDocumentsResponseMock = [
  {
    metadata: {
      tags: []
    },
    sys: {
      space: {
        sys: {
          type: "Link",
          linkType: "Space",
          id: "18fop5x17y3g"
        }
      },
      id: "1OpBG0EhsSAjuuAXFp44k9",
      type: "Entry",
      createdAt: "2022-02-02T13:56:54.824Z",
      updatedAt: "2022-06-14T09:28:05.129Z",
      environment: {
        sys: {
          id: "master",
          type: "Link",
          linkType: "Environment"
        }
      },
      revision: 2,
      contentType: {
        sys: {
          type: "Link",
          linkType: "ContentType",
          id: "document"
        }
      },
      locale: "nb-NO"
    },
    fields: {
      title: "Prisliste - Monarflex",
      asset: {
        metadata: {
          tags: []
        },
        sys: {
          space: {
            sys: {
              type: "Link",
              linkType: "Space",
              id: "18fop5x17y3g"
            }
          },
          id: "4uRPslBQGbZNmJRWBzomYQ",
          type: "Asset",
          createdAt: "2022-02-02T13:54:51.707Z",
          updatedAt: "2022-05-31T22:52:16.258Z",
          environment: {
            sys: {
              id: "master",
              type: "Link",
              linkType: "Environment"
            }
          },
          revision: 4,
          locale: "nb-NO"
        },
        fields: {
          title: "Prisliste Monarflex 1. juni 2022",
          description: "",
          file: { ...file }
        }
      },
      assetType: {
        metadata: {
          tags: []
        },
        sys: {
          space: {
            sys: {
              type: "Link",
              linkType: "Space",
              id: "18fop5x17y3g"
            }
          },
          id: "7DhbTW6UITNkLNHTw3EjEp",
          type: "Entry",
          createdAt: "2020-12-16T03:24:21.444Z",
          updatedAt: "2020-12-16T03:24:21.444Z",
          environment: {
            sys: {
              id: "master",
              type: "Link",
              linkType: "Environment"
            }
          },
          revision: 1,
          contentType: {
            sys: {
              type: "Link",
              linkType: "ContentType",
              id: "assetType"
            }
          },
          locale: "nb-NO"
        },
        fields: {
          ...assetType
        }
      },
      noIndex: false,
      brand: "Icopal"
    }
  }
];

export const getEsDocumentMock = (id?: string) => ({
  __typename: "ContentfulDocument",
  id: id || contenfulDocumentsResponseMock[0].sys.id,
  title: contenfulDocumentsResponseMock[0].fields.title,
  titleAndSize: `${contenfulDocumentsResponseMock[0].fields.title}_${file.details.size}`,
  realFileName: file.fileName,
  asset: {
    file: {
      ...file
    }
  },
  assetType: {
    ...assetType
  },
  noIndex: false,
  BRAND: {
    code: "Icopal",
    name: "Icopal"
  }
});
