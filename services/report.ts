import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";
import { json } from "../deps.ts";

export async function reportHandler(_request: Request) {
  const cmcApi = await CoinMarketCapApi.init();
  const meApi = await MagicEdenApi.init();

  const coins = await cmcApi.fetchCoins(cmcApi.options.symbols);
  const nfts = await meApi.fetchNfts(meApi.nftSymbols);

  return json({ coins, nfts });
}
