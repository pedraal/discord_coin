import { StonqCommand } from "../commands/stonq.ts";

const definitions = {
  stonq: StonqCommand.definition(),
};

export class DiscordCommandApi {
  BOT_TOKEN: string | undefined;
  CLIENT_ID: string | undefined;
  commandBody: {
    name: string;
    description: string;
    options: {
      name: string;
      description?: string;
      type: number;
      required?: boolean;
    }[];
  };
  requestHeaders: { "Content-Type": string; Authorization: string };
  baseURL: string;

  constructor(command?: keyof typeof definitions) {
    this.BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    this.CLIENT_ID = Deno.env.get("CLIENT_ID");

    this.commandBody = definitions[command || "stonq"];

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

    const json = await req.json();

    return json;
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
    const json = await req.json();

    return json;
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
