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
      event.target.dataset.index ?? event.target.parentElement.dataset.index,
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
    const heads = this.headersValue.map((header, index) =>
      `<th class="${this.classes.th}" data-action="click->table#setSorting" data-index="${index}">${header}
        <span class="text-xs">${
        index === this.sortedByValue
          ? (this.sortedDirValue > 0 ? "asc" : "desc")
          : ""
      }
        </span>
      </th>`
    ).join("");

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
        "p-4 pl-8 text-lg font-medium text-left border-b text-slate-200 border-sky-600 first-letter:uppercase cursor-pointer",
      tbody: "overflow-hidden rounded-b-lg bg-slate-700",
      td:
        "p-4 pl-8 border-b first:font-semibold first:text-sky-400 text-slate-300 border-slate-600",
    };
  }
}
