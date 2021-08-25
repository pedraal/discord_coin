export class DiscordCommandApi {
  BOT_TOKEN: string | undefined;
  CLIENT_ID: string | undefined;

  constructor() {
    this.BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    this.CLIENT_ID = Deno.env.get("CLIENT_ID");
  }

  async get() {
    const req = await fetch(
      `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bot ${this.BOT_TOKEN}`,
        },
      },
    );

    return await req.json();
  }

  async create() {
    const req = await fetch(
      `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bot ${this.BOT_TOKEN}`,
        },
        body: JSON.stringify({
          "name": "teststonks",
          "description": "Affiche la valeur de l'ADA, BTC, ETH, LINK",
          "options": [
            // {
            // "name": "name",
            // "description": "The name of the person",
            // "type": 3,
            // "required": true,
            // },
          ],
        }),
      },
    );

    console.log(await req.json());
  }

  // update() {
  // }

  // delete() {
  // }
}
