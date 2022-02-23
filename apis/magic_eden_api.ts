import all from "https://deno.land/x/promise_fns/src/all.ts";
import { AsciiAlign, AsciiTable } from "../deps.ts";
import { AirtableApi } from "./airtable_api.ts";

const airtableApi = new AirtableApi();

const magic_eden_base_url =
  "https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/";

export class MagicEdenApi {
  nftSymbols: string[];

  static async init() {
    const nfts = await this.#fetchConfig();
    return new MagicEdenApi(nfts);
  }

  constructor(
    nftSymbols: string[],
  ) {
    this.nftSymbols = nftSymbols;
  }

  async fetchNfts(symbols: string[]) {
    const responses = await all(
      symbols.map((symbol) => fetch(magic_eden_base_url + symbol)),
    );
    let nfts = await all(responses.map((res) => res.json()));
    nfts = nfts.map((d) => {
      return {
        symbol: d.results.symbol,
        floor: this.formatedPrice(d.results.floorPrice),
        listed: d.results.listedCount,
        vat: this.formatedPrice(d.results.volumeAll),
        v24h: this.formatedPrice(d.results.volume24hr),
        avg: this.formatedPrice(d.results.avgPrice24hr),
      };
    });

    nfts = nfts.sort(function (a, b) {
      return b.floor - a.floor;
    });
    return nfts;
  }

  async discordTable() {
    const nfts = await this.fetchNfts(this.nftSymbols);

    const table = new AsciiTable("NFT");
    table
      .setHeading("Name", "◎");

    nfts.forEach((nft) => {
      table.addRow(nft.symbol, nft.floor);
    });

    return {
      content: "```\n" + table.toString() + "\n```",
    };
  }

  async discordDetails(options: any) {
    const symbol = options.find((o: any) => o.name === "name");
    const nft = (await this.fetchNfts([symbol.value]))[0];

    const table = new AsciiTable(symbol.value);
    table
      .addRow("Floor", nft.floor)
      .addRow("Listed", nft.listed)
      .addRow("VAT", nft.vat)
      .addRow("V24h", nft.v24h)
      .addRow("Avg.", nft.avg)
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
            "url": `https://magiceden.io/marketplace/${nft.symbol}`,
          },
        ],
      }],
    };
  }

  formatedPrice(floorValue: number) {
    return (Math.floor(floorValue * 0.000000001 * 100) / 100)
      .toFixed(2);
  }

  static async #fetchConfig() {
    if (Deno.env.get("AIRTABLE_API_KEY")) {
      return await airtableApi.fetchNfts();
    } else {
      const config = await Deno.readTextFile(
        Deno.env.get("CONFIG_PATH") || "./config.json",
      );
      return JSON.parse(config).nfts;
    }
  }
}
