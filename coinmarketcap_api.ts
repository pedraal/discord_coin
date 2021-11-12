export interface CoinApiOptions {
  converts: string[];
  symbols: string[];
}

export class CoinApi {
  options: CoinApiOptions;
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
    options: CoinApiOptions = {
      converts: ["USD"],
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
    for await (const convert of this.options.converts) {
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
      content = `${this.title(options.meme)} *$${
        this.truncate(results[options.meme].quote.USD.price)
      }* | ${
        this.truncate(
          results[options.meme].quote.USD[
            options.short ? "percent_change_1h" : "percent_change_24h"
          ],
        )
      }% en ${options.short ? "1h" : "24h"}
  ${this.calcScore(results[options.meme], options.short)}`;
    } else {
      content = coinsKeys.map((c) => {
        const coin = results[c];
        const usdQuote = coin.quote.USD;

        return `${this.title(c)} | H: ${
          this.truncate(usdQuote.percent_change_1h)
        }% ${this.growth(usdQuote.percent_change_1h)} | J: ${
          this.truncate(usdQuote.percent_change_24h)
        }% ${this.growth(usdQuote.percent_change_24h)} | S: ${
          this.truncate(usdQuote.percent_change_7d)
        }% ${this.growth(usdQuote.percent_change_7d)} | M: ${
          this.truncate(usdQuote.percent_change_30d)
        }% ${this.growth(usdQuote.percent_change_30d)} | *$${
          this.truncate(usdQuote.price)
        }*`;
      }).join("\n");
    }

    return content;
  }

  truncate(val: number) {
    return Math.round(val * 100) / 100;
  }

  growth(val: number) {
    if (val > 0) return ":green_circle:";
    else return ":red_circle:";
  }

  // deno-lint-ignore no-explicit-any
  calcScore(coin: any, short = false) {
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

  title(coin: string) {
    return `**${coin.length === 4 ? coin : coin + " "} :**`;
  }
}
