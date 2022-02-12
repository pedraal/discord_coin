import { serve } from "./deps.ts";

// For all requests to "/" endpoint, we want to invoke action() handler.
serve({
  "/": call,
});

import { json, nacl, validateRequest } from "./deps.ts";
import { StonqCommand } from "./commands/stonq.ts";

const commands = [
  { name: "stonq", class: StonqCommand },
];

export async function call(request: Request) {
  // validateRequest() ensures that a request is of POST method and
  // has the following headers.
  try {
    const { error } = await validateRequest(request, {
      POST: {
        headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
      },
    });
    if (error) {
      return json({ error: error.message }, { status: error.status });
    }
    // verifySignature() verifies if the request is coming from Discord.
    // When the request's signature is not valid, we return a 401 and this is
    // important as Discord sends invalid requests to test our verification.
    const { valid, body } = await verifySignature(request);
    if (!valid) {
      return json(
        { error: "Invalid request" },
        {
          status: 401,
        },
      );
    }

    const { type = 0, data = { options: [] } } = JSON.parse(body);
    if (type === 1) {
      // Discord performs Ping interactions to test our application.
      // Type 1 in a request implies a Ping interaction.
      return json({
        type: 1, // Type 1 in a response is a Pong interaction response type.
      });
    } else if (type === 2) {
      // Type 2 in a request is an ApplicationCommand interaction.
      // It implies that a user has issued a command.
      const command = commands.find((c) => c.name === data.name);
      if (command) {
        const commandClass = command.class;
        const commandInstance = new commandClass(data);
        const response = await commandInstance.handler();
        return json(response);
      } else {
        return json({ error: "bad request" }, { status: 400 });
      }
    } else {
      // We will return a bad request error as a valid Discord request
      // shouldn't reach here.
      return json({ error: "bad request" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }
}

async function verifySignature(
  request: Request,
): Promise<{ valid: boolean; body: string }> {
  const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
  // Discord sends these headers with every request.
  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(PUBLIC_KEY),
  );

  return { valid, body };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)),
  );
}
