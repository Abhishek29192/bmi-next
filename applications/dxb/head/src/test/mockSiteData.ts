import { Data as SiteData } from "../components/Site";

export const createMockSiteData = (): SiteData =>
  ({
    node_locale: "en-GB",
    homePage: {
      title: "Home"
    },
    countryCode: "en",
    menuNavigation: {
      __typename: "ContentfulNavigation",
      label: null,
      links: [
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Products",
          promos: null,
          links: [
            {
              __typename: "ContentfulNavigationItem",
              type: "Heading",
              value: "Select category"
            },
            {
              __typename: "ContentfulNavigation",
              link: null,
              label: "Roof",
              links: [
                {
                  __typename: "ContentfulNavigation",
                  link: {
                    __typename: "ContentfulLink",
                    id: "98566b68-bad1-5d5a-ab42-ddad6f67120d",
                    label: "All Stone Roofs",
                    icon: null,
                    isLabelHidden: null,
                    url: null,
                    type: "Internal",
                    linkedPage: {
                      path: "roof-tiles/"
                    },
                    asset: null,
                    parameters: null,
                    dialogContent: null
                  },
                  label: "Stone Roofs",
                  links: [
                    {
                      __typename: "ContentfulLink",
                      id: "7574ab07-2da6-576f-ae16-38a2bd67f504",
                      label: "Roof tiles",
                      icon: "Monier",
                      isLabelHidden: null,
                      url: null,
                      type: "Internal",
                      linkedPage: {
                        path: "roof-tiles/stone-roof-tiles/"
                      },
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    },
                    {
                      __typename: "ContentfulLink",
                      id: "719ee372-c653-5682-9826-2b2335ead187",
                      label: "Concrete roof tiles",
                      icon: "Zanda",
                      isLabelHidden: null,
                      url: null,
                      type: "Internal",
                      linkedPage: {
                        path: "roof-tiles/betongtakstein/"
                      },
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    }
                  ]
                },
                {
                  __typename: "ContentfulNavigation",
                  link: null,
                  label: "Steel Roof Tiles",
                  links: [
                    {
                      __typename: "ContentfulLink",
                      id: "2f26190b-ddf7-5049-bf4e-94e42d5da569",
                      label: "Quadro Plus",
                      icon: "AeroDek",
                      isLabelHidden: null,
                      url: "#",
                      type: "Internal",
                      linkedPage: {
                        path: "aerodek-quadro-plus/"
                      },
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    }
                  ]
                },
                {
                  __typename: "ContentfulNavigation",
                  link: {
                    __typename: "ContentfulLink",
                    id: "3939848d-20c8-50ab-b138-3e9373bbc3e8",
                    label: "All Shingle",
                    icon: null,
                    isLabelHidden: null,
                    url: null,
                    type: "Internal",
                    linkedPage: {
                      path: "kontakt-oss/"
                    },
                    asset: null,
                    parameters: null,
                    dialogContent: null
                  },
                  label: "Shingle",
                  links: [
                    {
                      __typename: "ContentfulLink",
                      id: "c60e6a41-4d7e-5c39-89d9-ad3e95a90386",
                      label: "Type S",
                      icon: "Icopal",
                      isLabelHidden: null,
                      url: null,
                      type: "Internal",
                      linkedPage: {
                        path: "kontakt-oss/"
                      },
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    }
                  ]
                },
                {
                  __typename: "ContentfulNavigation",
                  link: null,
                  label: "Flat Roof Accessories",
                  links: [
                    {
                      __typename: "ContentfulLink",
                      id: "e28a28d0-8070-5396-a879-36df320626bf",
                      label: " Roof ladder",
                      icon: null,
                      isLabelHidden: null,
                      url: null,
                      type: "Internal",
                      linkedPage: {
                        path: "takstige/"
                      },
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    }
                  ]
                }
              ]
            },
            {
              __typename: "ContentfulNavigationItem",
              type: "Separator",
              value: null
            },
            {
              __typename: "ContentfulNavigationItem",
              type: "Heading",
              value: "Our Brands"
            },
            {
              __typename: "ContentfulLink",
              id: "43aea1a4-6ff6-50ec-ab34-ca021df398dd",
              label: "Icopal",
              icon: "Icopal",
              isLabelHidden: true,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "004038f9-8d99-56a1-ae22-de32ffa718c3",
              label: "Zanda",
              icon: "Zanda",
              isLabelHidden: true,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "9d85c312-d806-530a-bbf5-3b2b1769f0ea",
              label: "Monier",
              icon: "Monier",
              isLabelHidden: true,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "6f861efe-5cfe-59c6-8028-f26bb379e7d3",
              label: "AeroDek",
              icon: "AeroDek",
              isLabelHidden: true,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Systems",
          promos: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "c6f3af7d-3cc0-568c-9873-80032f17e451",
              label: "Pitched Roof",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "69fb6407-3394-5d1a-acbe-5576047282e5",
              label: "Flat roof",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "2eb3f1db-56e4-5ada-aadd-33e3bda1199f",
              label: "Membranes",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "b548b98d-374f-50d1-af1b-3ee3db15dad4",
              label: "Sealing systems",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Brands",
          promos: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "2d3e7dfd-e7dd-5daa-b1a0-43fe2a43ae32",
              label: "Icopal",
              icon: "Icopal",
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: {
                path: "icopal-base/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "24ce0a99-92b2-58d4-a1d7-243ab165b57b",
              label: "AeroDek",
              icon: "AeroDek",
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: {
                path: "aerodek-quadro-plus/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "c92656e4-dfff-53c2-a7cb-3262870dd4d1",
              label: "Zanda",
              icon: "Zanda",
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: {
                path: "zanda-arktis/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Tips and Inspiration",
          promos: null,
          links: [
            {
              __typename: "ContentfulNavigation",
              link: {
                __typename: "ContentfulLink",
                id: "96c6b49f-5860-5d68-bf46-77fcef667d22",
                label: "All Inspiration",
                icon: null,
                isLabelHidden: null,
                url: null,
                type: "Internal",
                linkedPage: {
                  path: "case-study-landing-page/"
                },
                asset: null,
                parameters: null,
                dialogContent: null
              },
              label: "Inspiration",
              links: [
                {
                  __typename: "ContentfulLink",
                  id: "5dd9482e-51c5-5e00-aec8-1d97209db24f",
                  label: "Homeowners",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                },
                {
                  __typename: "ContentfulLink",
                  id: "943d7846-32e7-5439-bc93-c7d6c995a4a7",
                  label: "Professionals",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                },
                {
                  __typename: "ContentfulLink",
                  id: "49ecb67d-9068-56b3-8fe2-b868b59ebc5d",
                  label: "Commercial building",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                },
                {
                  __typename: "ContentfulLink",
                  id: "46fd4485-8202-5018-bc1e-cd9fa20da771",
                  label: "Architect and engineer",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                }
              ]
            },
            {
              __typename: "ContentfulNavigation",
              link: null,
              label: "Construction tips",
              links: [
                {
                  __typename: "ContentfulLink",
                  id: "f7b14dae-daf8-53a9-8e8e-84c72dd9f8be",
                  label: "For Professionals",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                },
                {
                  __typename: "ContentfulNavigation",
                  link: null,
                  label: "For the self-builder",
                  links: [
                    {
                      __typename: "ContentfulLink",
                      id: "40fa5ece-fd7f-5d88-b9a5-6084ade9631c",
                      label: "Build houses",
                      icon: null,
                      isLabelHidden: null,
                      url: null,
                      type: "External",
                      linkedPage: null,
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    },
                    {
                      __typename: "ContentfulLink",
                      id: "ed62c72e-6393-5792-bb5a-af791b48ef21",
                      label: "Build cottage",
                      icon: null,
                      isLabelHidden: null,
                      url: null,
                      type: "External",
                      linkedPage: null,
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    },
                    {
                      __typename: "ContentfulLink",
                      id: "2d536078-5925-5601-97b4-ad8d86944a3e",
                      label: "Build terrace",
                      icon: null,
                      isLabelHidden: null,
                      url: null,
                      type: "External",
                      linkedPage: null,
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    },
                    {
                      __typename: "ContentfulLink",
                      id: "dcb75981-3fb5-586b-b85f-a00137eb9fb6",
                      label: "Build garage",
                      icon: null,
                      isLabelHidden: null,
                      url: null,
                      type: "External",
                      linkedPage: null,
                      asset: null,
                      parameters: null,
                      dialogContent: null
                    }
                  ]
                },
                {
                  __typename: "ContentfulLink",
                  id: "992ff943-a7c2-5988-ab31-7ff754250cd5",
                  label: "Other construction tips",
                  icon: null,
                  isLabelHidden: null,
                  url: null,
                  type: "External",
                  linkedPage: null,
                  asset: null,
                  parameters: null,
                  dialogContent: null
                }
              ]
            },
            {
              __typename: "ContentfulLink",
              id: "e511fa50-4a12-5f68-9085-12a0bffaddce",
              label: "News",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Support",
          promos: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "e8528008-431c-59ee-bcfc-be1d0b030d13",
              label: "Roof Calculator",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "548b555a-e008-595f-8226-30394c89c540",
              label: "FAQs",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "Internal",
              linkedPage: {
                path: "ofte-stilte-sporsmal/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "acba91a3-6d3f-5057-8f93-41a09160619f",
              label: "Puja's test page",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "Internal",
              linkedPage: {
                path: "test-page-puja/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          link: null,
          label: "Documentation",
          promos: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "61a1c13d-371e-51db-829d-d42f6c7ba81f",
              label: "All Documentation",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "c2f50f54-ac65-59a7-9914-a41f04e02bd6",
              label: "Test Doc Lib",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "Internal",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "3ff52935-c003-58e0-93c4-34721230d0dc",
              label: "What our roofers say",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "Internal",
              linkedPage: {
                path: "simple-page-playground-gp/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        }
      ]
    },
    menuUtilities: {
      label: "Shortcuts",
      links: [
        {
          __typename: "ContentfulLink",
          id: "1ee019cc-0400-5ca1-a185-e14974398f47",
          label: "Find a dealer",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "External",
          linkedPage: null,
          asset: null,
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "2e2b1a9b-2092-5660-9c99-3caa6503667e",
          label: "Find a roofer",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "External",
          linkedPage: null,
          asset: null,
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "e734a870-8c96-51ee-952a-a524bcccb1ff",
          label: "Partner portal",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "External",
          linkedPage: null,
          asset: null,
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "bd3f6ea3-3f12-5c64-b005-94f7ac7ee665",
          label: "News",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "External",
          linkedPage: null,
          asset: null,
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "a2184bd5-9fa4-52ef-b615-d3c57b5ba1c9",
          label: "Contact Us",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "Internal",
          linkedPage: {
            path: "kontakt-oss/"
          },
          asset: null,
          parameters: null,
          dialogContent: null
        }
      ]
    },
    footerMainNavigation: {
      label: "Contact Us",
      links: [
        {
          label: "Contact Us",
          links: null
        },
        {
          label: "About BMI",
          links: [
            {
              __typename: "ContentfulLink",
              id: "a10e464f-cad1-58ee-b112-31cf35f6d0f2",
              label: "Our Story",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "e56eb951-d327-51a9-8dbb-07bfffdd20b5",
              label: "Our Brands",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "039ebd1d-0288-5daa-95d4-d391771f93d8",
              label: "Our Values",
              icon: null,
              isLabelHidden: false,
              url: null,
              type: "Internal",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "4c91d4b2-d319-5d10-9c42-936eb321c737",
              label: "Sustainability",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          label: " Our portals",
          links: [
            {
              __typename: "ContentfulLink",
              id: "081cdd16-3770-528e-a64f-614d9d98c1d4",
              label: "BMI RoofPro",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "b6d4ab50-efe8-5d42-bf2c-6ff76e9035c2",
              label: "Team Icopal",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "30daa69e-579c-5b39-842c-479e933ebc63",
              label: "Training",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "59ba5f73-5d87-5e2e-9a3d-fadb7fb88405",
              label: "Mediabank",
              icon: null,
              isLabelHidden: null,
              url: "#",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        },
        {
          label: "Careers",
          links: [
            {
              __typename: "ContentfulLink",
              id: "adfaa2f0-7aa3-51e2-87fa-9a0f6089c362",
              label: "Diversity",
              icon: null,
              isLabelHidden: null,
              url: null,
              type: "Internal",
              linkedPage: {
                path: "mangfold/"
              },
              asset: null,
              parameters: null,
              dialogContent: null
            },
            {
              __typename: "ContentfulLink",
              id: "6d376f80-8886-51b1-ac48-b7367ad419d6",
              label: "BMI Job Board",
              icon: null,
              isLabelHidden: null,
              url: "https://bmi.jobboard.io/",
              type: "External",
              linkedPage: null,
              asset: null,
              parameters: null,
              dialogContent: null
            }
          ]
        }
      ]
    },
    footerSecondaryNavigation: {
      label: "Secondary Navigation ",
      links: [
        {
          __typename: "ContentfulLink",
          id: "2a20ec46-b622-5ac7-a8bf-5e7c7ec742f8",
          label: "Cookies",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "Internal",
          linkedPage: {
            path: "bruk-av-informasjonskapsler/"
          },
          asset: null,
          parameters: null,
          dialogContent: null
        },
        {
          __typename: "ContentfulLink",
          id: "fe05f6e2-0481-5f69-88c4-40a06efa691e",
          label: "Sitemap",
          icon: null,
          isLabelHidden: null,
          url: null,
          type: "External",
          linkedPage: null,
          asset: null,
          parameters: null,
          dialogContent: null
        }
      ]
    },
    resources: {
      microCopy: [
        {
          key: "page.linkLabel",
          value: "Go to page"
        },
        {
          key: "search.placeholder",
          value: "Skriv ditt spørsmål her"
        },
        {
          key: "pdp.overview.size",
          value: "Størrelse"
        },
        {
          key: "pdp.overview.addSample",
          value: "Add Sample"
        },
        {
          key: "pdp.leadBlock.about",
          value: "Om produktet"
        },
        {
          key: "pdp.leadBlock.technicalSpecifications",
          value: "Tekniske spesifikasjoner"
        },
        {
          key: "pdp.relatedProducts.title",
          value: "Kompatible produkter"
        },
        {
          key: "pdp.relatedProducts.showMore",
          value: "Se fler produkter"
        },
        {
          key: "global.viewMore",
          value: "Vis flere"
        },
        {
          key: "global.viewLess",
          value: "Vis mindre"
        },
        {
          key: "dialog.cancel",
          value: "Lukk"
        },
        {
          key: "confirmationMessage.title",
          value: "Takk for at du meldte deg på vårt nyhetsbrev! "
        },
        {
          key: "page.jumpToSection",
          value: "Hurtignavigering"
        },
        {
          key: "nba.title",
          value: "Mer informasjon"
        },
        {
          key: "cardCollection.groupTitle",
          value: "Filtrer via kategori"
        },
        {
          key: "documentLibrary.headers.typeCode",
          value: "Type"
        },
        {
          key: "global.address",
          value: "WOW THIS IS NEW"
        }
      ],
      pdpSidebarItems: null,
      pdpCardsTitle: "Tips and Information",
      pdpCards: [
        {
          __typename: "ContentfulProductListerPage",
          id: "4f6c8de7-22be-5631-b334-024ca098ae57",
          title: "Zanda Arktis ",
          subtitle:
            "Zanda Arctic is our most durable concrete roof tile. To make the roof tile really durable and resistant to weather and wind, we have cast in quartz and color pigments. Then we painted it twice.",
          brandLogo: "Zanda",
          slug: "zanda-arktis",
          path: "zanda-arktis/",
          tags: null,
          featuredVideo: null,
          featuredMedia: {
            type: "Decorative",
            altText: "BMI-Norge-produktbilde-zanda-arktis",
            caption: {
              caption: "produktbilde av zanda arktis"
            },
            focalPoint: null,
            image: {
              file: {
                fileName: "BMI_Zanda_Arktis.jpg",
                url: "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg"
              },
              gatsbyImageData: {
                images: {
                  sources: [
                    {
                      srcSet:
                        "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&q=50&fm=webp 1597w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=3195&h=2426&q=50&fm=webp 3195w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=4000&h=3037&q=50&fm=webp 4000w",
                      sizes: "(min-width: 6389px) 6389px, 100vw",
                      type: "image/webp"
                    }
                  ],
                  fallback: {
                    src: "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&fl=progressive&q=50&fm=jpg",
                    srcSet:
                      "//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=1597&h=1213&fl=progressive&q=50&fm=jpg 1597w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=3195&h=2426&fl=progressive&q=50&fm=jpg 3195w,\n//images.ctfassets.net/un5bh1z034o8/7cEa9QXFAsCMmvnhJLrZqK/debb0d8db1db80413b7903194e366616/BMI_Zanda_Arktis.jpg?w=4000&h=3037&fl=progressive&q=50&fm=jpg 4000w",
                    sizes: "(min-width: 6389px) 6389px, 100vw"
                  }
                },
                layout: "constrained",
                width: 6389,
                height: 4852,
                placeholder: {
                  fallback:
                    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4gJASUNDX1BST0ZJTEUAAQEAAAIwQURCRQIQAABtbnRyUkdCIFhZWiAH0AAIAAsAEwAzADthY3NwQVBQTAAAAABub25lAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUFEQkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApjcHJ0AAAA/AAAADJkZXNjAAABMAAAAGt3dHB0AAABnAAAABRia3B0AAABsAAAABRyVFJDAAABxAAAAA5nVFJDAAAB1AAAAA5iVFJDAAAB5AAAAA5yWFlaAAAB9AAAABRnWFlaAAACCAAAABRiWFlaAAACHAAAABR0ZXh0AAAAAENvcHlyaWdodCAyMDAwIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkAAAAZGVzYwAAAAAAAAARQWRvYmUgUkdCICgxOTk4KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAFhZWiAAAAAAAACcGAAAT6UAAAT8WFlaIAAAAAAAADSNAACgLAAAD5VYWVogAAAAAAAAJjEAABAvAAC+nP/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAA8AFAMBEQACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAGAgUI/8QAJBAAAQIFAwUBAAAAAAAAAAAAAQIDAAQFESEGUWESEzFB8DL/xAAXAQEBAQEAAAAAAAAAAAAAAAADAgEE/8QAHxEAAgIBBAMAAAAAAAAAAAAAAQIAAxEEEiFBE1Fh/9oADAMBAAIRAxEAPwDENFpUu70rdt1qwAPKjsOYhmCDJiIjWMFWOJLSstM04Oy7oTnGLg/cxivuwVHBlPV4wQ5ww69yuVQFtrWm/g+4SDC9OeTMS/bKSFejf7PMQ67hFrsKH5F9EqKacwpTjinH/wBEi4STvbffeDrqCcxrdS9vHUi5qO7ijY5MPOOf/9k="
                }
              }
            }
          }
        },
        {
          __typename: "ContentfulSimplePage",
          id: "71846648-f4f3-59b6-8763-43740703c8d8",
          title: "Stone roof tiles",
          subtitle:
            " Brick is a clean and very durable natural material that only gets more beautiful with age. Brick roof tiles actually have a lifespan of over 75 years!",
          brandLogo: "Monier",
          slug: "stone-roof-tiles",
          path: "roof-tiles/stone-roof-tiles/",
          tags: [
            {
              title: "Roof Tile",
              type: "Group"
            }
          ],
          featuredVideo: null,
          featuredMedia: {
            type: "Decorative",
            altText: "BMI-Norge-miljøbilde-Tegl-nortelg-overflate",
            caption: {
              caption: "miljøbilde av BMI Monier Nortegl Naturell på tak. "
            },
            focalPoint: null,
            image: {
              file: {
                fileName: "BMI-Norge-miljøbilde-Tegl-nortelg-overflate.jpg",
                url: "//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg"
              },
              gatsbyImageData: {
                images: {
                  sources: [
                    {
                      srcSet:
                        "//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=411&h=265&q=50&fm=webp 411w,\n//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=821&h=529&q=50&fm=webp 821w,\n//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=1642&h=1058&q=50&fm=webp 1642w",
                      sizes: "(min-width: 1642px) 1642px, 100vw",
                      type: "image/webp"
                    }
                  ],
                  fallback: {
                    src: "//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=1642&h=1058&fl=progressive&q=50&fm=jpg",
                    srcSet:
                      "//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=411&h=265&fl=progressive&q=50&fm=jpg 411w,\n//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=821&h=529&fl=progressive&q=50&fm=jpg 821w,\n//images.ctfassets.net/un5bh1z034o8/3vvFgG6vD4FaUD5oRNmUQB/822e560920b21a5915259b36662e7d6e/BMI-Norge-milj_bilde-Tegl-nortelg-overflate.jpg?w=1642&h=1058&fl=progressive&q=50&fm=jpg 1642w",
                    sizes: "(min-width: 1642px) 1642px, 100vw"
                  }
                },
                layout: "constrained",
                width: 1642,
                height: 1058,
                placeholder: {
                  fallback:
                    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4gJASUNDX1BST0ZJTEUAAQEAAAIwQURCRQIQAABtbnRyUkdCIFhZWiAHzwAGAAMAAAAAAABhY3NwQVBQTAAAAABub25lAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUFEQkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApjcHJ0AAAA/AAAADJkZXNjAAABMAAAAGt3dHB0AAABnAAAABRia3B0AAABsAAAABRyVFJDAAABxAAAAA5nVFJDAAAB1AAAAA5iVFJDAAAB5AAAAA5yWFlaAAAB9AAAABRnWFlaAAACCAAAABRiWFlaAAACHAAAABR0ZXh0AAAAAENvcHlyaWdodCAxOTk5IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkAAAAZGVzYwAAAAAAAAARQWRvYmUgUkdCICgxOTk4KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAFhZWiAAAAAAAACcGAAAT6UAAAT8WFlaIAAAAAAAADSNAACgLAAAD5VYWVogAAAAAAAAJjEAABAvAAC+nP/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAA0AFAMBEQACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAACBwMFBv/EACYQAAEDAwMEAgMAAAAAAAAAAAECAxEEEiEABkEFEyIxMmFSgfD/xAAaAQABBQEAAAAAAAAAAAAAAAADAAQFBgcC/8QAIhEAAQMDAwUAAAAAAAAAAAAAAgABEQQSIQNRoRMxceHw/9oADAMBAAIRAxEAPwBfO9Ha2883StOGpZS2gpeWkAqx7Ign6AnJBOs2DW6w3u0OtLpiuDwhet7gUlSgpfjJlRu9jNv2RAj5aMOcJwWMqjrktqfknMcupGl2XUTmU0XWxXM07igJ8ouklPjdiCM+88TqH05tfO3KqT1JaJEzKKo2UKlS7qpOZTho8Cfz/uZ1ZwooiC49qWaugYt5WG3Bt9LfUDY92wpIUUtoASD+50UKW5skm417tLEMx9sv/9k="
                }
              }
            }
          }
        },
        {
          __typename: "ContentfulSimplePage",
          id: "65e9f69a-fbb8-5bc5-96cb-9b660002d2c6",
          title: "Concrete roof tiles",
          subtitle:
            " Concrete is a natural, strong and easy-to-handle material. Our Zanda concrete roof tiles are easy to lay and give you a very durable and weather-resistant roof that is easy to maintain.",
          brandLogo: "Zanda",
          slug: "betongtakstein",
          path: "roof-tiles/betongtakstein/",
          tags: null,
          featuredVideo: null,
          featuredMedia: {
            type: "Decorative",
            altText: "BMI-Norge-Miljøbilde-betongtakstein-arktis",
            caption: {
              caption: "Miljøbilde av Zanda Arktis på tak. "
            },
            focalPoint: null,
            image: {
              file: {
                fileName: "BMI-Norge-miljøbilde-betongstein-Arktis.jpg",
                url: "//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg"
              },
              gatsbyImageData: {
                images: {
                  sources: [
                    {
                      srcSet:
                        "//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=419&h=298&q=50&fm=webp 419w,\n//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=838&h=596&q=50&fm=webp 838w,\n//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=1676&h=1192&q=50&fm=webp 1676w",
                      sizes: "(min-width: 1676px) 1676px, 100vw",
                      type: "image/webp"
                    }
                  ],
                  fallback: {
                    src: "//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=1676&h=1192&fl=progressive&q=50&fm=jpg",
                    srcSet:
                      "//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=419&h=298&fl=progressive&q=50&fm=jpg 419w,\n//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=838&h=596&fl=progressive&q=50&fm=jpg 838w,\n//images.ctfassets.net/un5bh1z034o8/4pqV0q6UfA6xV7bcDBAtKS/c4c841aaa7661ba6ce55aac9a47d07ef/BMI-Norge-milj_bilde-betongstein-Arktis.jpg?w=1676&h=1192&fl=progressive&q=50&fm=jpg 1676w",
                    sizes: "(min-width: 1676px) 1676px, 100vw"
                  }
                },
                layout: "constrained",
                width: 1676,
                height: 1192,
                placeholder: {
                  fallback:
                    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAlgCWAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAOABQDAREAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAQUDBgf/xAArEAABAwEECAcAAAAAAAAAAAABAgMEBQAGBxESFSExQWGT0RMUIyU2UXH/xAAZAQEAAgMAAAAAAAAAAAAAAAADBAYAAQX/xAAmEQABAwMCBQUAAAAAAAAAAAABAAISAwQRBWETIVJx0TFBQqGx/9oADAMBAAIRAxEAPwCG/Mmu3UplIVTIXm5kzxlvBx4aKGwsJSBkPsOZ79wtarjUYPw0ZG4Krtvp82ZeTnuFXWMTL6MrWTdGmvlQA9VRWdnLS/LQDqDz8l0m2NNvq3PdMmsVr8FPxCkpHAJY2bhzsZvHdX75Ti2b0D68JzjrT4wvZBhRYLL8WHAaQ0p9amyQsqeOaU5gbXDxtAqVeIQ7J5pqdODYgLPdRpyHtVP6zvaxy3Sx2Q1C2kkarhddztbc91kM+y//2Q=="
                }
              }
            }
          }
        }
      ],
      pdpExploreBar: {
        label: "Nyttige linker:",
        links: [
          {
            __typename: "ContentfulLink",
            id: "67eed339-b3c3-55f2-9003-44e3a0289a75",
            label: "Zanda Arktis",
            icon: null,
            isLabelHidden: null,
            url: null,
            type: "Internal",
            linkedPage: {
              path: "zanda-arktis/"
            },
            asset: null,
            parameters: null,
            dialogContent: null
          },
          {
            __typename: "ContentfulLink",
            id: "c4414200-48b9-5167-876a-6427f9fbc0b1",
            label: "All roof tiles",
            icon: null,
            isLabelHidden: null,
            url: null,
            type: "Internal",
            linkedPage: {
              path: "roof-tiles/"
            },
            asset: null,
            parameters: null,
            dialogContent: null
          }
        ]
      },
      pdpShareWidget: {
        title: "Share",
        message: "Thanks for sharing this page!",
        clipboardSuccessMessage: "Copied to the clipboard",
        clipboardErrorMessage: "Oops... something went wrong",
        isLeftAligned: false,
        email: false,
        copy: true,
        linkedin: true,
        twitter: true,
        facebook: true,
        pinterest: true
      },
      sdpLeadBlockCta: {
        asset: null,
        dialogContent: null,
        hubSpotCTAID: null,
        icon: null,
        id: "27b85d0e-2170-5ce2-8dae-734c8a784cbb",
        isLabelHidden: false,
        label: "Get a Quotation",
        linkedPage: { path: "roof-tiles/betongtakstein/" },
        parameters: null,
        type: "Internal",
        url: null,
        __typename: "ContentfulLink"
      },
      sdpShareWidget: {
        title: "Share",
        message: "Thanks for sharing this page!",
        clipboardSuccessMessage: "Copied to the clipboard",
        clipboardErrorMessage: "Oops... something went wrong",
        isLeftAligned: false,
        email: false,
        copy: true,
        linkedin: true,
        twitter: true,
        facebook: true,
        pinterest: true
      },
      visualiserShareWidget: null,
      pdpSignupBlock: null,
      searchPageSearchTips: null,
      searchPageSidebarItems: null,
      searchPageNextBestActions: null,
      searchPageExploreBar: null,
      errorFourOFour: {
        __typename: "ContentfulPromo",
        id: "46950b8b-b119-5f10-abc3-86b0f7d84fcd",
        title: "404",
        subtitle: "not found",
        body: {
          raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"oops","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
          references: []
        },
        brandLogo: null,
        tags: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null,
        featuredMedia: {
          type: "Decorative",
          altText: "BMI-Norge-Verdier-inspire",
          caption: {
            caption: "icon av BMIs verdi, inspire"
          },
          focalPoint: null,
          image: {
            file: {
              fileName: "BMI-Norge-Verdier-inspire.png",
              url: "//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png"
            },
            gatsbyImageData: {
              images: {
                sources: [
                  {
                    srcSet:
                      "//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=563&h=563&q=50&fm=webp 563w,\n//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=1127&h=1126&q=50&fm=webp 1127w,\n//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=2253&h=2252&q=50&fm=webp 2253w",
                    sizes: "(min-width: 2253px) 2253px, 100vw",
                    type: "image/webp"
                  }
                ],
                fallback: {
                  src: "//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=2253&h=2252&q=50&fm=png",
                  srcSet:
                    "//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=563&h=563&q=50&fm=png 563w,\n//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=1127&h=1126&q=50&fm=png 1127w,\n//images.ctfassets.net/un5bh1z034o8/2JAGuqwBxeIXx4K7heouI7/1675523db890a7fed9b63f961ee20355/BMI-Norge-Verdier-inspire.png?w=2253&h=2252&q=50&fm=png 2253w",
                  sizes: "(min-width: 2253px) 2253px, 100vw"
                }
              },
              layout: "constrained",
              width: 2253,
              height: 2251.9999999999995,
              placeholder: {
                fallback:
                  "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABklBMVEXAEE3AEE3CIlnMPW7BFFC5EEqmQmPceZvAEU2qJVHmsMO6FU6OEzuYNFPTXobdi6fQTHqgEkGHFDilT2qwYXqhEkGvM1zbepu4boXqscTprMHVkqilFUWWMFCxZ36aOVifQ2DilK/UXIXbeJrGKF/UWoTORXSMHkGqWXK2cYa8fJDNQXHpqr+0EUiuWnW1Yn3DKF2nU27cepvNQHHUi6OKFDmNFDq3EUrYrbvFI1vls8SOIEKhRmLRVH/JM2e6bYWgRWHtvM3mn7jCfZOVME/oq8DegqLVYoqKGT2iSGS+gJTQna3MmamuYXmoVW/GXoHAEU7MPG7XaI/EIFmoVG7Ei53Xn7LimbLXaY/IMGXCF1LRUn7hkq3kmbLkmrPjk6/hjarcepzWYorru8zUXYbFJVzegaHhjqvmorndgaHPl6m7JFfCGVTBEk/DGlTDHVbUW4XbqbqhQ2CxEUfKNWnYa5HYn7LJlaXRnq7gn7XcfJ3hpbmzaoGKFTrSnq+8e4+KGTyZNlW2b4W4c4mNIEKJFDlC01mMAAAAAXRSTlP9g+pWxwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB+UGFwoiHHb3Ja4AAADeSURBVBgZBcE9jk1xAMDR83vvn7mTiXAzoRahQqUQtVjAazW6qUQUekt4hSj1VBILsIG7BYWPRINMwiQkknGdUwAArBsAbQBsgK0xBtMWDHBY1V/T4U8YMFf/tj9c6Rso5nBQ9RWsg/lCnV3sk2u5Xh8Y5o7q7Cg+3rpdYVw+9x1T3KlasDkHPh/cM021QMeAm9WfFlgHwKhagAEwqgUwcLeqil29Zdyv6s3DqkdVGHOv4PVJ9OtSoeBxL59E1Z613Y2+XK16Z1e/91h73vsHL/C06nQPa8cAPDvdg/U/YgQuFgfeb5cAAAAASUVORK5CYII="
              }
            }
          }
        }
      },
      errorGeneral: {
        __typename: "ContentfulPromo",
        id: "941aacf4-2fb7-5283-88cc-255612c1c7e6",
        title: "oops",
        subtitle: "something went wrong",
        body: {
          raw: '{"data":{},"content":[{"data":{},"content":[{"data":{},"marks":[],"value":"please try again","nodeType":"text"}],"nodeType":"paragraph"}],"nodeType":"document"}',
          references: []
        },
        brandLogo: null,
        tags: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null,
        featuredMedia: {
          type: "Decorative",
          altText: "BMI Decra rense takrennen BMI Norge",
          caption: null,
          focalPoint: null,
          image: {
            file: {
              fileName: "BMI_Decra_rense_takrennen_BMI_Norge.jpg",
              url: "//images.ctfassets.net/un5bh1z034o8/2uiUayMfc3Cr7DzNFhZIKi/e9eaf6f69a2448d267cacb95022f12f6/BMI_Decra_rense_takrennen_BMI_Norge.jpg"
            },
            gatsbyImageData: {
              images: {
                sources: [
                  {
                    srcSet:
                      "//images.ctfassets.net/un5bh1z034o8/2uiUayMfc3Cr7DzNFhZIKi/e9eaf6f69a2448d267cacb95022f12f6/BMI_Decra_rense_takrennen_BMI_Norge.jpg?w=480&h=320&q=50&fm=webp 480w,\n//images.ctfassets.net/un5bh1z034o8/2uiUayMfc3Cr7DzNFhZIKi/e9eaf6f69a2448d267cacb95022f12f6/BMI_Decra_rense_takrennen_BMI_Norge.jpg?w=960&h=640&q=50&fm=webp 960w,\n//images.ctfassets.net/un5bh1z034o8/2uiUayMfc3Cr7DzNFhZIKi/e9eaf6f69a2448d267cacb95022f12f6/BMI_Decra_rense_takrennen_BMI_Norge.jpg?w=1920&h=1280&q=50&fm=webp 1920w",
                    sizes: "(min-width: 1920px) 1920px, 100vw",
                    type: "image/webp"
                  }
                ]
              },
              layout: "constrained",
              width: 1920,
              height: 1280,
              placeholder: {
                fallback:
                  "data:image/jpeg;base64,UklGRuYAAABXRUJQVlA4INoAAABQBQCdASoUAA0APpE4l0eloyIhMAgAsBIJbACdMoR3JoIpnz/9kkkRYLIrACKU94IdlzwA+SS0JQFVIQGjO/5xppSPpcodrthGceUn3sDbf/M+m0hz9Ghy8Lfhnu+6B8JDaSiMo+5n61Mj+JaHX4Ex/dypg8JRi63zjFO1cruiRmCPqNJS/tesC1YYYDAVdgBtR28Kp9lwtH3IDbCh87/VZr/kFQ2/9H4HKDIH/Ia/w10rbYyB1uJAcOUHk7eTftbl0W/dvxx/5clPxrlwjT2f978IMHc/M2uAAA=="
              }
            }
          }
        }
      },
      welcomeDialogTitle: null,
      welcomeDialogBrands: null,
      welcomeDialogBody: null
    },
    headScripts: null,
    scriptOnetrust: null,
    regions: [
      {
        label: "Europe",
        menu: [
          { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
          { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
          { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" },
          { code: "en", label: "English", icon: "/icons/flags/uk.svg" }
        ]
      }
    ]
  } as SiteData);
