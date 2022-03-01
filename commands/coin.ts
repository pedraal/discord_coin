import { CoinMarketCapApi } from "../apis/coinmarketcap_api.ts";

const cmcApi = await CoinMarketCapApi.init();

export class CoinCommand {
  interaction: any;
  constructor(interaction: any) {
    this.interaction = interaction;
  }

  async handler() {
    const subCommand = this.interaction.options[0];

    let response;
    if (subCommand.name === "all") {
      response = await cmcApi.discordTable(subCommand.options);
    } else if (subCommand.name === "one") {
      response = await cmcApi.discordDetails(subCommand.options);
      // } else if (subCommand.name === "add") {
      //   return await cmcApi.discordDetails(subCommand.options);
      // } else if (subCommand.name === "remove") {
      //   return await cmcApi.discordDetails(subCommand.options);
    } else {
      throw new Error("Invalid subCommand");
    }

    return {
      type: 4,
      data: response,
    };
  }

  static definition() {
    return {
      name: "coin",
      description: "Display tokens data from CoinMarketCap",
      options: [
        {
          name: "all",
          description: "Display all tracked coins",
          type: 1,
          options: [
            {
              name: "full",
              description: "Wider timerange data",
              type: 5,
              required: false,
            },
          ],
        },
        {
          name: "one",
          description: "Display specified coin",
          type: 1,
          options: [
            {
              name: "symbol",
              description: "Token symbol",
              type: 3,
              required: true,
            },
            {
              name: "short",
              description: "Smaller timerange",
              type: 5,
              required: false,
            },
          ],
        },
      ],
    };
  }
}
