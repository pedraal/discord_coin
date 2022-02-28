import { Coin, CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.125.0/testing/asserts.ts";
import * as env from "../env.ts";
env.set(true);

const cmcApi = await CoinMarketCapApi.init();

Deno.test("CoinMarketCapApi", async (test) => {
  await test.step(".fetchCoins", async () => {
    const coins = await cmcApi.fetchCoins(["BTC", "ETH"]);

    assertEquals(coins.length, 2);
    const bitcoin = coins.find((coin) => coin.symbol === "BTC");
    const ethereum = coins.find((coin) => coin.symbol === "ETH");
    const keys: (keyof Coin)[] = [
      "symbol",
      "price",
      "hour",
      "day",
      "week",
      "month",
    ];
    for (const coin of [bitcoin, ethereum]) {
      assertExists(coin);
      for (const key of keys) {
        assertExists(coin[key]);
      }
    }
  });

  await test.step(".discordTable", async () => {
    const discordResponse = await cmcApi.discordTable([
      {
        name: "full",
        value: true,
      },
    ]);
    const shouldIncludes = [
      "```",
      "------",
      "Coins",
      "Symbol",
      "BTC",
      "ETH",
      "Price",
      " H ",
      " J ",
      " W ",
      " M ",
    ];
    for (const shouldInclude of shouldIncludes) {
      assertStringIncludes(discordResponse.content, shouldInclude);
    }
  });

  await test.step(".discordDetails", async () => {
    const discordResponse = await cmcApi.discordDetails([
      {
        name: "symbol",
        value: "BTC",
      },
    ]);

    const shouldIncludes = ["**BTC :**", " en 24h", " https://tenor.com/view/"];

    for (const shouldInclude of shouldIncludes) {
      assertStringIncludes(discordResponse.content, shouldInclude);
    }
  });
});
