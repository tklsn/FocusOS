// Bloqueia sites abertos no navegador chamando o servidor em 127.0.0.1:
// Host precisa ser local (contra DNS rebinding) e Origin, quando presente, o próprio servidor.
// ponytail: só hosts locais; a versão web (ADR 0003) vai precisar do domínio público aqui.
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
});
