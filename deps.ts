// Sift is a small routing library that abstracts the details like registering
// a fetch event listener and provides a simple function (serve) that has an
// API to invoke a function for a specific path.
export {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.4.3/mod.ts";
// TweetNaCl is a cryptography library that we use to verify requests
// from Discord.
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";

export { nacl };
