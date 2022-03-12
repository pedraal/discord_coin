import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";
import { json } from "../deps.ts";

async function coin(_request: Request) {
  const cmcApi = await CoinMarketCapApi.init();

  const coins = await cmcApi.fetchCoins(cmcApi.options.symbols);

  return json({ coins });
}

async function nft(_request: Request) {
  const meApi = await MagicEdenApi.init();

  const nfts = await meApi.fetchNfts(meApi.nftSymbols);

  return json({ nfts });
}

export default {
  coin,
  nft,
};
