import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";
import { MagicEdenApi } from "../apis/magic_eden_api.ts";

export class StonqCommand {
  interaction: any;
  constructor(interaction: any) {
    this.interaction = interaction;
  }

  async handler() {
    const subCommandGroup = this.interaction.options[0];
    if (subCommandGroup?.name === "coin") {
      return {
        type: 4,
        data: {
          content: await this.coinCommand(subCommandGroup.options[0]),
        },
      };
    } else if (subCommandGroup?.name === "nft") {
      return {
        type: 4,
        data: await this.nftCommand(subCommandGroup.options[0]),
      };
    } else {
      throw new Error("Invalid subCommandGroup");
    }
  }

  async coinCommand(subCommand: any) {
    const cmcApi = new CoinMarketCapApi();

    if (subCommand.name === "all") {
      return await cmcApi.coinsTable(subCommand.options);
    } else if (subCommand.name === "one") {
      return await cmcApi.coinDetails(subCommand.options);
    } else {
      throw new Error("Invalid subCommand");
    }
  }

  async nftCommand(subCommand: any) {
    const meApi = new MagicEdenApi();

    if (subCommand.name === "all") {
      return await meApi.nftsTable();
    } else if (subCommand.name === "one") {
      return await meApi.nftDetails(subCommand.options);
    } else {
      throw new Error("Invalid subcommand");
    }
  }

  static definition() {
    return {
      "name": "stonq",
      "description": "Wouat stonqse ?",
      "options": [
        {
          "name": "coin",
          "description": "Get the value of one coin or tracked coins",
          "type": 2,
          "options": [
            {
              "name": "all",
              "description": "Get the value of all tracked coins",
              "type": 1,
              "options": [
                {
                  "name": "full",
                  "description": "Also display 7d and 30d values",
                  "type": 5,
                  "required": false,
                },
              ],
            },
            {
              "name": "one",
              "description": "Get the value at 24h of target coin",
              "type": 1,
              "options": [
                {
                  "name": "symbol",
                  "description": "Symbol of the target",
                  "type": 3,
                  "required": true,
                },
                {
                  "name": "short",
                  "description": "Show values for 1h",
                  "type": 5,
                  "required": false,
                },
              ],
            },
          ],
        },
        {
          "name": "nft",
          "description": "Get the FP of one nft or tracked nfts",
          "type": 2,
          "options": [
            {
              "name": "all",
              "description": "Get the value of all tracked nfts",
              "type": 1,
            },
            {
              "name": "one",
              "description": "Get the value at 24h of target nft",
              "type": 1,
              "options": [
                {
                  "name": "name",
                  "description": "Name of the target",
                  "type": 3,
                  "required": true,
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
