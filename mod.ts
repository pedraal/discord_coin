import { serve } from "./deps.ts";
import { discordCommandsHandler } from "./services/discord_commands.ts";
import { reportHandler } from "./services/report.ts";
import { contentType } from "https://deno.land/x/media_types/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
serve({
  "/discord": discordCommandsHandler,
  "/": handleStaticAsset,
  "/api": reportHandler,
  "/:filename+": handleStaticAsset,
});

async function handleStaticAsset(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname === "/") {
    const file = await Deno.readFile(path.join("public", "index.html"));
    return new Response(file);
  }

  const type = contentType(path.extname(pathname));
  const file = await Deno.readFile(path.join("public", pathname));

  if (!type) {
    throw new Error("invalid content type requested");
  }
  return new Response(file, {
    headers: {
      "content-type": type,
    },
  });
}
