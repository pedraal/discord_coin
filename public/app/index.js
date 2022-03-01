import { Stimulus } from "./deps.js";

import FetcherController from "./controllers/fetcher_controller.js";
import TableController from "./controllers/table_controller.js";

window.Stimulus = Stimulus.Application.start();
window.Stimulus.register("fetcher", FetcherController);
window.Stimulus.register("table", TableController);
