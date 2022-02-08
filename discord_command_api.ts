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
  requestHeaders: { "Content-Type": string; Authorization: string };
  baseURL: string;

  constructor() {
    this.BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    this.CLIENT_ID = Deno.env.get("CLIENT_ID");

    this.commandBody = {
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

    this.requestHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bot ${this.BOT_TOKEN}`,
    };
    this.baseURL =
      `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands`;
  }

  async get() {
    const req = await fetch(
      this.baseURL,
      {
        method: "GET",
        headers: this.requestHeaders,
      },
    );

    return await req.json();
  }

  async create() {
    const req = await fetch(
      this.baseURL,
      {
        method: "POST",
        headers: this.requestHeaders,
        body: JSON.stringify(this.commandBody),
      },
    );

    console.log(await req.json());
  }

  async update(id: string) {
    const req = await fetch(
      this.baseURL + `/${id}`,
      {
        method: "PATCH",
        headers: this.requestHeaders,
        body: JSON.stringify(this.commandBody),
      },
    );

    console.log(await req.json());
  }

  async delete(id: string) {
    await fetch(
      this.baseURL + `/${id}`,
      {
        method: "DELETE",
        headers: this.requestHeaders,
      },
    );
  }
}
