export interface CoinApiOptions {
  converts: string[];
  symbols: string[];
}

export class CoinApi {
  options: CoinApiOptions;
  constructor(
    options: CoinApiOptions = {
      converts: ["EUR", "USD"],
      symbols: ["BTC", "ETH", "ADA", "LINK"],
    },
  ) {
    this.options = options;
  }

  async call() {
    // deno-lint-ignore no-explicit-any
    const results: any = {};
    for await (const convert of this.options.converts) {
      const url =
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${
          this.options.symbols.join(",")
        }&convert=${convert}`;
      const req = await fetch(
        url,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CMC_PRO_API_KEY": Deno.env.get("API_TOKEN")!,
          },
        },
      );
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

    const text = coinsKeys.map((c) => {
      const coin = results[c];
      const eurQuote = coin.quote.EUR;
      const usdQuote = coin.quote.USD;
      return `**${results[c].name} (${c}) :**
       *$${this.truncate(usdQuote.price)} / ${this.truncate(eurQuote.price)}€*
       Jour: ${this.truncate(usdQuote.percent_change_24h)}% ${
        this.growth(usdQuote.percent_change_24h)
      }
       Sem.: ${this.truncate(usdQuote.percent_change_7d)}% ${
        this.growth(usdQuote.percent_change_7d)
      }
       `;
    }).join("\n");

    return text;
  }

  truncate(val: number) {
    return Math.round(val * 100) / 100;
  }

  growth(val: number) {
    if (val > 0) return ":greencircle:";
    else return ":redcircle:";
  }
}

const api = new CoinApi();
const text = await api.call();

console.log(text);
