import { serve } from "./deps.ts";

import { call } from "./discord_action.ts";

// For all requests to "/" endpoint, we want to invoke action() handler.
serve({
  "/": call,
});
