import { serve } from "./deps.ts";

import { DiscordAction } from "./discord_action.ts";

// For all requests to "/" endpoint, we want to invoke action() handler.
const discordAction = new DiscordAction();
serve({
  "/": discordAction.call,
});
