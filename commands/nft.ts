import { MagicEdenApi } from "../apis/magic_eden_api.ts";

const meApi = await MagicEdenApi.init();

export class NftCommand {
  interaction: any;
  constructor(interaction: any) {
    this.interaction = interaction;
  }

  async handler() {
    const subCommand = this.interaction.options[0];

    let response;
    if (subCommand.name === "all") {
      response = await meApi.discordTable();
    } else if (subCommand.name === "one") {
      response = await meApi.discordDetails(subCommand.options);
      // } else if (subCommand.name === "add") {
      //   return await meApi.discordDetails(subCommand.options);
      // } else if (subCommand.name === "remove") {
      //   return await meApi.discordDetails(subCommand.options);
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
      name: "nft",
      description: "Display NFTs MagicEden data",
      options: [
        {
          name: "all",
          description: "Display all tracked NFTs",
          type: 1,
        },
        {
          name: "one",
          description: "Display specified NFT",
          type: 1,
          options: [
            {
              name: "name",
              description: "MagicEden symbol (from the collection URL)",
              type: 3,
              required: true,
            },
          ],
        },
      ],
    };
  }
}
