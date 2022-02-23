import { Controller } from "Stimulus";

export default class extends Controller {
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
      document.querySelector(`#${key}[data-controller="table"]`)
        .dataset.tableHeadersValue = JSON.stringify(Object.keys(set[0]));

      document.querySelector(`#${key}[data-controller="table"]`)
        .dataset.tableRowsValue = JSON.stringify(
          set.map((item) => Object.values(item)),
        );
    });
  }
}
