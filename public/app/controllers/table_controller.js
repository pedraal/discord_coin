import { Stimulus } from "../deps.js";

export default class extends Stimulus.Controller {
  static values = {
    headers: Array,
    headersUnits: Array,
    rows: Array,
    sortedBy: Number,
    sortedDir: Number,
    scorableColumns: Array,
  };

  connect() {
    this.#sort();
    this.renderTable();
  }

  rowsValueChanged() {
    this.#sort();
    this.renderTable();
  }

  sortedByValueChanged() {
    this.#sort();
  }

  sortedDirValueChanged() {
    this.#sort();
  }

  #sort() {
    this.rowsValue = this.rowsValue.sort((a, b) => {
      return (
        (a[this.sortedByValue] - b[this.sortedByValue]) * this.sortedDirValue
      );
    });
  }

  setSorting(event) {
    const index = parseInt(event.target.closest("[data-index]").dataset.index);

    if (this.sortedByValue !== index) {
      this.sortedDirValue = -1;
      this.sortedByValue = index;
    } else if (this.sortedDirValue > 0) {
      this.sortedDirValue = -1;
    } else {
      this.sortedDirValue = 1;
    }
  }

  renderTable() {
    const table = `<table class="border-collapse rounded-lg table-auto bg-slate-800">${
      this.renderHead() + this.renderRows()
    }</table>`;
    this.element.innerHTML = table;
  }

  renderHead() {
    const heads = this.headersValue
      .map((header, index) => {
        const sorting =
          index === this.sortedByValue
            ? this.sortedDirValue > 0
              ? this.arrowUp
              : this.arrowDown
            : "";

        const unit = this.headersUnitsValue[index]
          ? `( ${this.headersUnitsValue[index]} )`
          : "";

        return `
      <th class="p-4 text-lg font-medium text-left border-b text-slate-200 border-sky-600 cursor-pointer pl-8" data-action="click->table#setSorting" data-index="${index}">
        <span class="flex items-center">
          <span class="first-letter:uppercase">${header}</span>
          <span class="text-xs ml-1 mr-3 whitespace-nowrap">${unit}</span>
          <span>${sorting}</span>
        </span>
      </th>`;
      })
      .join("");

    return `<thead><tr>${heads}</tr></thead>`;
  }

  renderRows() {
    return `<tbody class="overflow-hidden rounded-b-lg">${this.rowsValue
      .map((r) => this.renderRow(r))
      .join("")}</tbody>`;
  }

  renderRow(row = []) {
    const cols = row
      .map((col, index) => {
        const extraClass = this.scorableColumnsValue.includes(index)
          ? this.scoreClass(parseFloat(col))
          : "";
        return `<td class="pl-8 p-4 first:font-semibold border-b first:text-sky-400 text-slate-300 border-slate-600 ${extraClass}">${col}</td>`;
      })
      .join("");

    return `<tr class="odd:bg-slate-700 even:bg-slate-600">${cols}</tr>`;
  }

  get arrowUp() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>`;
  }

  get arrowDown() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>`;
  }

  scoreClass(score) {
    if (score > 1) return "!text-green-500";
    else if (score > -1) return "!text-yellow-500";
    else return "!text-red-500";
  }
}
