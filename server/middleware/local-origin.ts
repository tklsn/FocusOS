import { timingSafeEqual } from "node:crypto";

const secret = process.env.FOCUSOS_API_SECRET;

function hasSecret(given = "") {
  return (
    !secret ||
    (given.length === secret.length &&
      timingSafeEqual(Buffer.from(given), Buffer.from(secret)))
  );
}

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

export default defineEventHandler((event) => {
  if (!event.path.startsWith("/api/")) return;

  const host = getRequestHeader(event, "host") ?? "";
  const origin = getRequestHeader(event, "origin");
  const hostname = host.replace(/:\d+$/, "");

  const badHost = !LOCAL_HOSTNAMES.has(hostname);
  const badOrigin =
    origin !== undefined &&
    (!URL.canParse(origin) || new URL(origin).host !== host);
  if (badHost || badOrigin) throw createError({ statusCode: 403 });

  if (!hasSecret(getRequestHeader(event, "x-focusos-secret"))) {
    throw createError({ statusCode: 403 });
  }
});
