import { Controller } from "Stimulus";

export default class extends Controller {
  static values = {
    headers: Array,
    rows: Array,
    scoreHighlightColumns: Array,
    sortedBy: Number,
    sortedDir: Number,
  };

  connect() {
    this.renderTable();
  }

  headersValueChanged() {
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
      return (a[this.sortedByValue] - b[this.sortedByValue]) *
        this.sortedDirValue;
    });
  }

  setSorting(event) {
    const index = parseInt(
      event.target.dataset.index ?? event.target.parentElement.dataset.index ??
        event.target.parentElement.parentElement.dataset.index,
    );

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
    const table = `<table class="${this.classes.table}">${
      this.renderHead() + this.renderRows()
    }</table>`;
    this.element.innerHTML = table;
  }

  renderHead() {
    const heads = this.headersValue.map((header, index) => {
      const sorting = index === this.sortedByValue
        ? (this.sortedDirValue > 0 ? this.arrowUp : this.arrowDown)
        : "";

      return `<th class="${this.classes.th}" data-action="click->table#setSorting" data-index="${index}">
        <span class="flex items-center">
          <span class="mr-3 first-letter:uppercase">${header}</span>
          <span>${sorting}</span>
        </span>
      </th>`;
    }).join("");

    return `<thead><tr>${heads}</tr></thead>`;
  }

  renderRows() {
    return `<tbody class="${this.classes.tbody}">${
      this.rowsValue.map((r) => this.renderRow(r)).join("")
    }</tbody>`;
  }

  renderRow(row = []) {
    const cols = row.map((col, index) => {
      return `<td class="${this.classes.td} ${
        this.scoreHighlightColumnsValue.includes(index)
          ? this.scoreClass(col)
          : ""
      }">${col}</td>`;
    })
      .join(
        "",
      );

    return `<tr>${cols}</tr>`;
  }

  scoreClass(score) {
    if (score > 1) return "!text-green-500";
    else if (score > -1) return "!text-yellow-500";
    else return "!text-red-500";
  }

  get classes() {
    return {
      table: "border-collapse rounded-lg table-auto bg-slate-800",
      th:
        "p-4 pl-8 text-lg font-medium text-left border-b text-slate-200 border-sky-600 cursor-pointer",
      tbody: "overflow-hidden rounded-b-lg bg-slate-700",
      td:
        "p-4 pl-8 border-b first:font-semibold first:text-sky-400 text-slate-300 border-slate-600",
    };
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
}
