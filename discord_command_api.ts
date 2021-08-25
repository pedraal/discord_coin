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

    console.log(await req.json());
  }

  // create() {
  //   fetch(
  //     `https://discord.com/api/v8/applications/${this.CLIENT_ID}/commands`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bot ${this.BOT_TOKEN}`,
  //       },
  //       body: JSON.stringify({
  //         "name": "hello",
  //         "description": "Greet a person",
  //         "options": [{
  //           "name": "name",
  //           "description": "The name of the person",
  //           "type": 3,
  //           "required": true,
  //         }],
  //       }),
  //     },
  //   );
  // }

  // update() {
  // }

  // delete() {
  // }
}
