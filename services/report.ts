import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";

export async function reportHandler(_request: Request) {
  const cmcApi = await CoinMarketCapApi.init();
  const meApi = await MagicEdenApi.init();

  const coinTable = await cmcApi.discordTable([{ name: "full", value: true }]);
  const nftTable = await meApi.discordTable();

  return new Response([coinTable, nftTable.content].join("\n\n"));
}
