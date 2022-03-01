import { Stimulus } from "../deps.js";

export default class extends Stimulus.Controller {
  static targets = ["loader"];

  connect() {
    this.apiData = {};
    this.fetch();
  }

  async fetch() {
    const req = await fetch("/api");
    this.apiData = await req.json();

    if (this.hasLoaderTarget) this.loaderTarget.remove();
    this.renderDataInTables();
  }

  renderDataInTables() {
    const dataKeys = Object.keys(this.apiData);

    dataKeys.forEach((key) => {
      const set = this.apiData[key];

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
