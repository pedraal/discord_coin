import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";
import { all } from "../deps.ts";

export async function reportHandler(_request: Request) {
  const cmcApi = await CoinMarketCapApi.init();
  const meApi = await MagicEdenApi.init();

  const coinTable = cmcApi.discordTable([{ name: "full", value: true }]);
  const nftTable = meApi.discordTable();

  const tables = await all([nftTable, coinTable]);

  return new Response(tables.map((t) => t.content).join("\n\n"));
}
