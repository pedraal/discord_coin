import { AsciiTable } from "../deps.ts";

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

  constructor(
    options: CoinMarketCapApiOptions = {
      fiat: "USD",
      symbols: [
        "BTC",
        "ETH",
        "ADA",
        "LINK",
        "SOL",
        "BNB",
        "CAKE",
        "DOT",
        "KCS",
      ],
    },
  ) {
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

  async call(options?: { short?: boolean; meme?: string }) {
    // deno-lint-ignore no-explicit-any
    const results: any = {};
    for await (const convert of this.options.fiat) {
      const symbolsString = options?.meme
        ? options.meme
        : this.options.symbols.join(",");
      const url =
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbolsString}&convert=${convert}`;
      const req = await fetch(url, this.apiOptions);
      const coins = (await req.json()).data;
      const coinsKeys = Object.keys(coins);

      coinsKeys.forEach((key) => {
        const coin = coins[key];
        if (results[key]) {
          results[key].quote = { ...results[key].quote, ...coin.quote };
        } else {
          results[key] = {
            name: coin.name,
            symbol: coin.symbol,
            quote: coin.quote,
          };
        }
      });
    }

    const coinsKeys = Object.keys(results);

    let content;
    if (options?.meme) {
      content = `${
        this.title(options.meme, results[options.meme].quote.USD)
      } | ${
        this.truncate(
          results[options.meme].quote.USD[
            options.short ? "percent_change_1h" : "percent_change_24h"
          ],
        )
      }% en ${options.short ? "1h" : "24h"}
    ${this.pickMeme(results[options.meme], options.short)}`;
    } else {
      content = coinsKeys.map((c) => {
        const coin = results[c];
        const usdQuote = coin.quote.USD;

        return `${this.title(c, usdQuote)} | H: ${
          this.truncate(usdQuote.percent_change_1h)
        }% ${this.growth(usdQuote.percent_change_1h)} | J: ${
          this.truncate(usdQuote.percent_change_24h)
        }% ${this.growth(usdQuote.percent_change_24h)} | S: ${
          this.truncate(usdQuote.percent_change_7d)
        }% ${this.growth(usdQuote.percent_change_7d)} | M: ${
          this.truncate(usdQuote.percent_change_30d)
        }% ${this.growth(usdQuote.percent_change_30d)}`;
      }).join("\n\n");
    }

    return content;
  }

  async coinsTable(options: any) {
    const fullOption = options.find((o: any) => o.name === "full");
    const url =
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${
        this.options.symbols.join(",")
      }&convert=${this.options.fiat}`;
    const res = await fetch(url, this.apiOptions);
    const coins = (await res.json()).data;

    const coinsValues = Object.values(coins);

    const table = new AsciiTable("Coins");

    if (fullOption) {
      table
        .setHeading("Symbol", "Price", "H", "J", "S", "M");
    } else {
      table
        .setHeading("Symbol", "Price", "H", "J");
    }

    coinsValues.sort((a: any, b: any) => {
      return b.quote.USD.price - a.quote.USD.price;
    }).forEach((c: any) => {
      const row = [
        c.symbol,
        this.truncate(c.quote.USD.price),
        this.truncate(c.quote.USD.percent_change_1h),
        this.truncate(c.quote.USD.percent_change_24h),
      ];

      if (fullOption) {
        row.push(
          this.truncate(c.quote.USD.percent_change_7d),
          this.truncate(c.quote.USD.percent_change_30d),
        );
      }
      table.addRow(row);
    });

    return "```\n" + table.toString() + "\n```";
  }

  async coinDetails(options: any) {
    console.log(options);
    const symbol = options.find((o: any) => o.name === "symbol");
    const short = options.find((o: any) => o.name === "short");
    const url =
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol.value}&convert=${this.options.fiat}`;

    const res = await fetch(url, this.apiOptions);
    const coins = (await res.json()).data;

    const coinValues: any = Object.values(coins).shift();

    return `${this.title(coinValues.symbol, coinValues.quote.USD)} | ${
      this.truncate(
        coinValues.quote.USD[
          short?.value ? "percent_change_1h" : "percent_change_24h"
        ],
      )
    }% en ${short?.value ? "1h" : "24h"}
    ${this.pickMeme(coinValues, short?.value)}`;
  }

  truncate(val: number) {
    return Math.round(val * 100) / 100;
  }

  growth(val: number) {
    if (val > 0) return "🟢";
    else return "🔴";
  }

  // deno-lint-ignore no-explicit-any
  pickMeme(coin: any, short = false) {
    const value = short
      ? coin.quote.USD.percent_change_1h
      : coin.quote.USD.percent_change_24h;
    if ((value * 100) >= (100 * 10)) {
      return this.memes.best;
    } else if ((value * 100) >= (100 * 3)) {
      return this.memes.good;
    } else if ((value * 100) >= (100 * -3)) {
      return this.memes.neutral;
    } else if ((value * 100) >= (100 * -10)) {
      return this.memes.bad;
    } else {
      return this.memes.worst;
    }
  }

  // deno-lint-ignore no-explicit-any
  title(coin: string, quote: any) {
    return `**${coin} :** *$${this.truncate(quote.price)}*`;
  }
}
