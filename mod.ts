import { contentType, path, serve } from "./deps.ts";
import { discordCommandsHandler } from "./services/discord_commands.ts";
import api from "./services/api.ts";

serve({
  "/discord": discordCommandsHandler,
  "/": handleStaticAsset,
  "/api/coin": api.coin,
  "/api/nft": api.nft,
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
