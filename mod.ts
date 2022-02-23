import { serve, serveStatic } from "./deps.ts";
import { discordCommandsHandler } from "./services/discord_commands.ts";
import { reportHandler } from "./services/report.ts";

console.log(import.meta.url);

serve({
  "/discord": discordCommandsHandler,
  "/": serveStatic("public/index.html", { baseUrl: import.meta.url }),
  "/api": reportHandler,
  "/:filename+": serveStatic("public", { baseUrl: import.meta.url }),
});
