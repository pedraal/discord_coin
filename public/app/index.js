import { Application } from "Stimulus";

import FetcherController from "./controllers/fetcher_controller.js";
import TableController from "./controllers/table_controller.js";

window.Stimulus = Application.start();

Stimulus.register("fetcher", FetcherController);
Stimulus.register("table", TableController);
