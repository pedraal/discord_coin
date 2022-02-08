import all from "https://deno.land/x/promise_fns/src/all.ts";

const magic_eden_base_url =
  "https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/";
export class MagicEdenApi {
  nftSymbols: string[];

  constructor(
    nftSymbols: string[] = [
      "enviro",
      "metavillage",
      "the_tower",
      "solsteads_surreal_estate",
      "cryptocribs",
      "neonexus_residential",
      "neonexus_commercial",
      "sovana",
      "portals",
      "nftabs",
      "monsterz",
      "spookyz",
      "bounty_hunter_space_guild",
    ],
  ) {
    this.nftSymbols = nftSymbols;
  }

  async call() {
    const ress = await all(
      this.nftSymbols.map((symbol) => fetch(magic_eden_base_url + symbol)),
    );
    const datas = await all(ress.map((res) => res.json()));
    return datas.map((d) => {
      return {
        symbol: d.results.symbol,
        floor: (Math.floor(d.results.floorPrice * 0.000000001 * 100) / 100)
          .toFixed(2),
      };
    }).map((d) => `${d.symbol} : ${d.floor} ◎`).join(
      ` :small_orange_diamond: `,
    );
  }
}
