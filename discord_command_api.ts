export class DiscordCommandApi {
  BOT_TOKEN: string | undefined;
  CLIENT_ID: string | undefined;
  commandBody: {
    name: string;
    description: string;
    options: {
      name: string;
      description: string;
      type: number;
      required: boolean;
    }[];
  };

  constructor() {
    this.BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    this.CLIENT_ID = Deno.env.get("CLIENT_ID");

    this.commandBody = {
      "name": "tstonks",
      "description": "Affiche les valeurs de l'ADA, BTC, ETH, LINK",
      "options": [
        {
          "name": "short",
          "description": "Affiche les valeurs à très court terme",
          "type": 5,
          "required": false,
        },
      ],
    };
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
        body: JSON.stringify(this.commandBody),
      },
    );

    console.log(await req.json());
  }

  async update(id: string) {
    const req = await fetch(
      `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bot ${this.BOT_TOKEN}`,
        },
        body: JSON.stringify(this.commandBody),
      },
    );

    console.log(await req.json());
  }

  async delete(id: string) {
    await fetch(
      `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bot ${this.BOT_TOKEN}`,
        },
      },
    );
  }
}
