import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";

export class StonksCommand {
  nft: any;
  short: any;
  meme: any;
  constructor(reqData: any) {
    const options = reqData.options || [];

    this.nft = options.find(
      (option: { name: string; value: string }) => option.name === "nft",
    );
    this.short = options.find(
      (option: { name: string; value: string }) => option.name === "short",
    );
    this.meme = options.find(
      (option: { name: string; value: string }) => option.name === "meme",
    );
  }

  async handler() {
    const response = {
      type: 4,
      data: {
        content: "",
      },
    };

    if (this.nft) {
      const meApi = new MagicEdenApi();
      response.data.content = await meApi.nftsTable();
    } else {
      const api = new CoinMarketCapApi();
      response.data.content = await api.call({
        short: this.short ? this.short.value : false,
        meme: this.meme ? this.meme.value : false,
      });
    }

    return response;
  }

  static definition() {
    return {
      "name": "stonks",
      "description": "Affiche les valeurs des coins suivis",
      "options": [
        {
          "name": "short",
          "description": "Affiche les valeurs à très court terme",
          "type": 5,
          "required": false,
        },
        {
          "name": "meme",
          "description": "Affiche des gifs représentant les valeurs du jour",
          "type": 3,
          "required": false,
        },
        {
          "name": "nft",
          "description": "Affiche le FP des NFT suivis",
          "type": 5,
          "required": false,
        },
      ],
    };
  }
}
