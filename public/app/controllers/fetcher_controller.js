import { Stimulus } from "../deps.js";

export default class extends Stimulus.Controller {
  static targets = ["loader"];

  connect() {
    this.fetch();
  }

  fetch() {
    fetch("/api/coin")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (this.hasLoaderTarget) this.loaderTarget.remove();
        this.renderDataInTables(data);
      });
    fetch("/api/nft")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (this.hasLoaderTarget) this.loaderTarget.remove();
        this.renderDataInTables(data);
      });
  }

  renderDataInTables(data) {
    const dataKeys = Object.keys(data);

    dataKeys.forEach((key) => {
      const set = data[key];

      const table = document.querySelector(`#${key}`);
      table.dataset.tableHeadersUnitsValue = JSON.stringify(
        this.headersUnits[key]
      );

      table.dataset.tableHeadersValue = JSON.stringify(Object.keys(set[0]));

      table.dataset.tableRowsValue = JSON.stringify(
        set.map((item) => Object.values(item))
      );
    });
  }

  get headersUnits() {
    return {
      coins: ["", "$", "%", "%", "%", "%"],
      nfts: ["", "⌾", "", "", "⌾", "⌾", "⌾", "⌾"],
    };
  }
}
