export class AirtableApi {
  constructor() {
  }

  async fetchCoins() {
    return await this.#fetchTable("coins");
  }

  async fetchNfts() {
    return await this.#fetchTable("nft");
  }

  async #fetchTable(table: string) {
    const res = await fetch(
      `https://api.airtable.com/v0/appJ6mh2akOAOgtEo/${table}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("AIRTABLE_API_KEY")}`,
        },
      },
    );
    const { records } = await res.json();

    return records.map((d: any) => d.fields.symbol);
  }
}
