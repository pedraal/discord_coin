import { MagicEdenApi } from "../apis/magic_eden_api.ts";
import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.125.0/testing/asserts.ts";
import * as env from "../env.ts";
env.set(true);

const meApi = await MagicEdenApi.init();

Deno.test("MagicEdenApi", async (test) => {
  await test.step(".fetchNfts", async () => {
    const nfts = await meApi.fetchNfts(["enviro", "cryptocribs"]);

    assertEquals(nfts.length, 2);
    const enviro = nfts.find((nft) => nft.symbol === "enviro");
    const cryptocribs = nfts.find((nft) => nft.symbol === "cryptocribs");
    const keys = ["floor", "listed", "vat", "v24h", "avg"];
    for (const nft of [enviro, cryptocribs]) {
      assertExists(nft);
      for (const key of keys) {
        assertExists(nft[key]);
      }
    }
  });

  await test.step(".discordTable", async () => {
    const discordResponse = await meApi.discordTable();
    const shouldIncludes = [
      "```",
      "------",
      "NFT",
      "Name",
      "◎",
      "enviro",
      "cryptocribs",
    ];
    for (const shouldInclude of shouldIncludes) {
      assertStringIncludes(discordResponse.content, shouldInclude);
    }
  });

  await test.step(".discordDetails", async () => {
    const discordResponse = await meApi.discordDetails([
      {
        name: "name",
        value: "enviro",
      },
    ]);
    const shouldIncludes = [
      "```",
      "------",
      "enviro",
      "Floor",
      "Listed",
      "VAT",
      "V24h",
      "Avg.",
    ];
    for (const shouldInclude of shouldIncludes) {
      assertStringIncludes(discordResponse.content, shouldInclude);
    }
  });
});
