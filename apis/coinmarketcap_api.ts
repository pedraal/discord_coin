import { AsciiTable } from "../deps.ts";
import { AirtableApi } from "./airtable_api.ts";

const airtableApi = new AirtableApi();
export type Coin = {
  symbol: string;
  price: number;
  hour: number;
  day: number;
  week: number;
  month: number;
};

export interface CoinMarketCapApiOptions {
  fiat: string;
  symbols: string[];
}

export class CoinMarketCapApi {
  options: CoinMarketCapApiOptions;
  memes: {
    worst: string;
    bad: string;
    neutral: string;
    good: string;
    best: string;
  };
  apiOptions: {
    headers: { "Content-Type": string; "X-CMC_PRO_API_KEY": string };
  };

  static async init() {
    const config = await this.#fetchConfig();
    return new CoinMarketCapApi(config);
  }

  constructor(options: CoinMarketCapApiOptions) {
    this.options = options;

    this.memes = {
      worst:
        "https://tenor.com/view/rage-red-stocks-crash-stocks-crashing-downwards-gif-17056650",
      bad:
        "https://tenor.com/view/not-stonks-profit-down-sad-frown-arms-crossed-gif-15684535",
      neutral: "https://tenor.com/view/kalm-calm-panik-meme-mem-gif-19765028",
      good: "https://tenor.com/view/montazac-donatien-de-montazac-gif-21611268",
      best: "https://tenor.com/view/hoge-hoge-finance-rise-arrow-gif-21389148",
    };

    this.apiOptions = {
      headers: {
        "Content-Type": "application/json",
        "X-CMC_PRO_API_KEY": Deno.env.get("API_TOKEN")!,
      },
    };
  }

  async fetchCoins(symbols: string[]) {
    const url =
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${
        symbols.join(
          ",",
        )
      }&convert=${this.options.fiat}`;
    const res = await fetch(url, this.apiOptions);
    const coins = (await res.json()).data;

    const coinsValues = Object.values(coins);

    const serializedCoins: Coin[] = coinsValues.map((coin: any) => {
      return {
        symbol: coin.symbol,
        price: this.truncate(coin.quote.USD.price),
        hour: this.truncate(coin.quote.USD.percent_change_1h),
        day: this.truncate(coin.quote.USD.percent_change_24h),
        week: this.truncate(coin.quote.USD.percent_change_7d),
        month: this.truncate(coin.quote.USD.percent_change_30d),
      };
    });
    return serializedCoins;
  }

  async discordTable(options: any) {
    const fullOption = options.find((o: any) => o.name === "full");
    const coins = await this.fetchCoins(this.options.symbols);

    const table = new AsciiTable("Coins");

    if (fullOption) {
      table.setHeading("Symbol", "Price", "H", "J", "W", "M");
    } else {
      table.setHeading("Symbol", "Price", "H", "J");
    }

    coins
      .sort((a: any, b: any) => {
        return b.price - a.price;
      })
      .forEach((c) => {
        const row = [c.symbol, c.price, c.hour, c.day];
        if (fullOption) {
          row.push(c.week, c.month);
        }
        table.addRow(row);
      });

    return { content: "```\n" + table.toString() + "\n```" };
  }

  async discordDetails(options: any) {
    const symbol = options.find(
      (o: { name: string; value: string }) => o.name === "symbol",
    );
    const short = options.find(
      (o: { name: string; value: string }) => o.name === "short",
    );
    const coin = (await this.fetchCoins([symbol.value]))[0];

    return {
      content: `${this.title(coin.symbol, coin.price)} | ${
        short?.value ? coin.hour : coin.day
      }% en ${short?.value ? "1h" : "24h"}
    ${this.pickMeme(coin, short?.value)}`,
    };
  }

  truncate(val: number) {
    return Math.round(val * 100) / 100;
  }

  // deno-lint-ignore no-explicit-any
  pickMeme(coin: any, short = false) {
    const value = short ? coin.hour : coin.day;
    if (value * 100 >= 100 * 10) {
      return this.memes.best;
    } else if (value * 100 >= 100 * 3) {
      return this.memes.good;
    } else if (value * 100 >= 100 * -3) {
      return this.memes.neutral;
    } else if (value * 100 >= 100 * -10) {
      return this.memes.bad;
    } else {
      return this.memes.worst;
    }
  }

  title(coin: string, price: number) {
    return `**${coin} :** *$${price}*`;
  }

  static async #fetchConfig() {
    if (Deno.env.get("AIRTABLE_API_KEY")) {
      const coinList = await airtableApi.fetchCoins();

      return {
        fiat: "USD",
        symbols: coinList,
      };
    } else {
      const config = await Deno.readTextFile(
        Deno.env.get("CONFIG_PATH") || "./config.json",
      );
      return JSON.parse(config).coins;
    }
  }
}
