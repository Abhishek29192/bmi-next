import dataJson from "../data/systems/pim-mock-data.json";
import type { SystemDetails } from "../templates/systemDetails/types";

export const systemDetailsMockData = {
  ...dataJson,
  systemLayers: dataJson.systemLayers.map((layer) => ({
    ...layer,
    relatedProducts: [
      {
        name: "Zanda Protector normalstein",
        variantOptions: [
          {
            path: "p/zanda-protector-normalstein/svart/935895622/"
          },
          {
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          },
          {
            path: "p/zanda-protector-normalstein/rød/619975412/"
          },
          {
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          }
        ]
      }
    ],
    relatedOptionalProducts: [
      {
        name: "Zanda Protector normalstein",
        variantOptions: [
          {
            path: "p/zanda-protector-normalstein/svart/935895622/"
          },
          {
            path: "p/zanda-protector-normalstein/grå/3844278835/"
          },
          {
            path: "p/zanda-protector-normalstein/rød/619975412/"
          },
          {
            path: "p/zanda-protector-normalstein/teglrød/1856300947/"
          }
        ]
      }
    ]
  }))
} as unknown as SystemDetails;
