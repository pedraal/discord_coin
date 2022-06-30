import { AsciiAlign, AsciiTable } from "../deps.ts";
import { AirtableApi } from "./airtable_api.ts";

const airtableApi = new AirtableApi();

const magic_eden_base_url =
  "https://api-mainnet.magiceden.io/rpc/getMultiCollectionEscrowStats/";

// https://api-mainnet.magiceden.io/rpc/getNFTsByOwner/CG2t78yajCZjmY15D8oVzqPDEQ2eAMxP6nxtzoknv5Bm

type MagicEdenNft = {
  symbol: string;
  floorPrice: number;
  listedCount: number;
  volumeAll: number;
  volume24hr: number;
  avgPrice24hr: number;
};

type Nft = {
  symbol: string;
  floor: string;
  listed: number;
  vat: string;
  v24h: string;
  avg: string;
};

export class MagicEdenApi {
  nftSymbols: string[];

  static async init() {
    try {
      const nfts = await this.#fetchConfig();
      console.log(nfts);
      return new MagicEdenApi(nfts);
    } catch (error) {
      console.log(error);
    }
    const nfts = await this.#fetchConfig();
    return new MagicEdenApi(nfts);
  }

  constructor(nftSymbols: string[]) {
    this.nftSymbols = nftSymbols;
  }

  async fetchNfts(symbols: string[]) {
    const response = await fetch(
      magic_eden_base_url + symbols.join(",") + "?edge_cache=true",
    );
    console.log(response);
    const rawNfts: MagicEdenNft[] = await response.json();

    const nfts: Nft[] = rawNfts.map((nft: MagicEdenNft) => {
      return {
        symbol: nft.symbol,
        floor: this.formatedPrice(nft.floorPrice),
        listed: nft.listedCount,
        vat: this.formatedPrice(nft.volumeAll),
        v24h: this.formatedPrice(nft.volume24hr),
        avg: this.formatedPrice(nft.avgPrice24hr),
      };
    });

    return nfts.sort(function (a: Nft, b: Nft) {
      return parseFloat(b.floor) - parseFloat(a.floor);
    });
  }

  async discordTable() {
    const nfts = await this.fetchNfts(this.nftSymbols);

    const table = new AsciiTable("NFT");
    table.setHeading("Name", "◎");

    nfts.forEach((nft: Nft) => {
      table.addRow(nft.symbol, nft.floor);
    });

    return {
      content: "```\n" + table.toString() + "\n```",
    };
  }

  async discordDetails(options: Record<string, string>[]) {
    const symbol = options.find((o) => o.name === "name");
    if (!symbol) throw new Error("missing symbol");
    const nft = (await this.fetchNfts([symbol.value]))[0];

    const table = new AsciiTable(symbol.value);
    table
      .addRow("Floor", nft.floor)
      .addRow("Listed", nft.listed)
      .addRow("VAT", nft.vat)
      .addRow("V24h", nft.v24h)
      .addRow("Avg.", nft.avg)
      .setAlign(1, AsciiAlign.RIGHT);

    const content = "```\n" + table.toString() + "\n```";

    return {
      content,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "MagicEden",
              style: 5,
              url: `https://magiceden.io/marketplace/${nft.symbol}`,
            },
          ],
        },
      ],
    };
  }

  formatedPrice(floorValue: number) {
    return (Math.floor(floorValue * 0.000000001 * 100) / 100).toFixed(2);
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
