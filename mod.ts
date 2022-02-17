import { serve } from "./deps.ts";
import { discordCommandsHandler } from "./services/discord_commands.ts";
import { reportHandler } from "./services/report.ts";

// For all requests to "/" endpoint, we want to invoke action() handler.
serve({
  "/": discordCommandsHandler,
  "/report": reportHandler,
});
