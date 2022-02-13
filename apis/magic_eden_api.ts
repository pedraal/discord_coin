import all from "https://deno.land/x/promise_fns/src/all.ts";
import { AsciiAlign, AsciiTable } from "../deps.ts";

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
      "entrance",
      "tiny_colony"
    ],
  ) {
    this.nftSymbols = nftSymbols;
  }

  async nftsTable() {
    const ress = await all(
      this.nftSymbols.map((symbol) => fetch(magic_eden_base_url + symbol)),
    );
    let datas = await all(ress.map((res) => res.json()));
    datas = datas.map((d) => {
      return {
        symbol: d.results.symbol,
        floor: this.formatedPrice(d.results.floorPrice),
      };
    });

    datas = datas.sort(function (a, b) {
      return b.floor - a.floor;
    });

    const table = new AsciiTable("NFT");
    table
      .setHeading("Name", "◎");

    datas.forEach((d) => {
      table.addRow(d.symbol, d.floor);
    });

    return {
      content: "```\n" + table.toString() + "\n```",
    };
  }

  async nftDetails(options: any) {
    const symbol = options.find((o: any) => o.name === "name");
    const res = await fetch(magic_eden_base_url + symbol.value);
    const { results: data } = await res.json();

    const table = new AsciiTable(symbol.value);
    table
      .addRow(
        "Floor",
        this.formatedPrice(data.floorPrice),
      )
      .addRow(
        "Listed",
        data.listedCount,
      )
      .addRow(
        "VAT",
        this.formatedPrice(data.volumeAll),
      )
      .addRow(
        "V24h",
        this.formatedPrice(data.volume24hr),
      )
      .addRow("Avg.", this.formatedPrice(data.avgPrice24hr))
      .setAlign(1, AsciiAlign.RIGHT);

    const content = "```\n" +
      table.toString() +
      "\n```";

    return {
      content,
      components: [{
        "type": 1,
        "components": [
          {
            "type": 2,
            "label": "MagicEden",
            "style": 5,
            "url": `https://magiceden.io/marketplace/${data.symbol}`,
          },
        ],
      }],
    };
  }

  formatedPrice(floorValue: number) {
    return (Math.floor(floorValue * 0.000000001 * 100) / 100)
      .toFixed(2);
  }
}
