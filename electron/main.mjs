import { app, BrowserWindow, Menu, session, shell } from "electron";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const isDev = process.argv.includes("--dev");
const HOST = "127.0.0.1";
const PREFERRED_PORT = 41730;

const DEV_ORIGIN = "http://localhost:3000";
const SECRET_HEADER = "x-focusos-secret";

const secret = randomBytes(32).toString("hex");

let origin;
let devServer;

function pickPort(port) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", (error) => {
      if (port === 0) reject(error);
      else resolve(pickPort(0));
    });
    probe.listen(port, HOST, () => {
      const chosen = probe.address().port;
      probe.close(() => resolve(chosen));
    });
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 300; attempt++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw new Error(`Servidor não respondeu em ${url}`);
}

async function isUp(url) {
  try {
    await fetch(url);
    return true;
  } catch {
    return false;
  }
}

async function startDevServer() {
  origin = DEV_ORIGIN;
  if (await isUp(origin)) return;

  devServer = spawn("pnpm", ["exec", "nuxt", "dev"], {
    stdio: "inherit",
    detached: true,
    env: { ...process.env, APP_MODE: "local" },
  });
  devServer.once("exit", () => app.quit());
  await waitForServer(origin);
}

async function startEmbeddedServer() {
  const port = await pickPort(PREFERRED_PORT);
  origin = `http://${HOST}:${port}`;

  const root = app.isPackaged ? process.resourcesPath : app.getAppPath();
  Object.assign(process.env, {
    APP_MODE: "local",
    FOCUSOS_API_SECRET: secret,
    NITRO_HOST: HOST,
    NITRO_PORT: String(port),
    DB_FILE_NAME: join(app.getPath("userData"), "focusos.db"),
    DB_MIGRATIONS_DIR: app.isPackaged
      ? join(root, "migrations")
      : join(root, "server/db/migrations"),
  });
  const entry = app.isPackaged
    ? join(root, "server/server/index.mjs")
    : join(root, ".output/server/index.mjs");
  await import(pathToFileURL(entry).href);

  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: [`${origin}/*`] },
    (details, callback) => {
      details.requestHeaders[SECRET_HEADER] = secret;
      callback({ requestHeaders: details.requestHeaders });
    },
  );

  await waitForServer(origin);
}

function createWindow(path = "/") {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 400,
    ...(process.platform === "darwin" && {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 16, y: 25 },
    }),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (new URL(url).origin !== origin) event.preventDefault();
  });

  window.loadURL(origin + path);
}

function navigate(path) {
  const [window] = BrowserWindow.getAllWindows();
  if (!window) {
    createWindow(path);
    return;
  }
  window.show();
  window.webContents.executeJavaScript(
    `(() => {
      const path = ${JSON.stringify(path)};
      const router = window.useNuxtApp?.().$router;
      if (router) router.push(path);
      else location.assign(path);
    })()`,
  );
}

function capture() {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
  const [window] = BrowserWindow.getAllWindows();
  window.show();
  const modifiers = [process.platform === "darwin" ? "meta" : "control"];
  window.webContents.sendInputEvent({
    type: "keyDown",
    keyCode: "I",
    modifiers,
  });
  window.webContents.sendInputEvent({ type: "keyUp", keyCode: "I", modifiers });
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const settings = {
    label: "Configurações…",
    accelerator: "CmdOrCtrl+,",
    click: () => navigate("/settings"),
  };

  return Menu.buildFromTemplate([
    ...(isMac
      ? [
        {
          label: app.name,
          submenu: [
            { role: "about", label: `Sobre o ${app.name}` },
            { type: "separator" },
            settings,
            { type: "separator" },
            { role: "services", label: "Serviços" },
            { type: "separator" },
            { role: "hide", label: `Ocultar ${app.name}` },
            { role: "hideOthers", label: "Ocultar Outros" },
            { role: "unhide", label: "Mostrar Todos" },
            { type: "separator" },
            { role: "quit", label: `Encerrar ${app.name}` },
          ],
        },
      ]
      : []),
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Capturar Tarefa",
          accelerator: "CmdOrCtrl+I",
          // o atalho continua sendo tratado pelo app; o menu só o mostra
          registerAccelerator: false,
          click: capture,
        },
        { type: "separator" },
        ...(isMac
          ? [{ role: "close", label: "Fechar Janela" }]
          : [settings, { type: "separator" }, { role: "quit", label: "Sair" }]),
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Desfazer" },
        { role: "redo", label: "Refazer" },
        { type: "separator" },
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
        { role: "selectAll", label: "Selecionar Tudo" },
      ],
    },
    {
      label: "Ir",
      submenu: [
        {
          label: "Hoje",
          accelerator: "CmdOrCtrl+1",
          click: () => navigate("/"),
        },
        {
          label: "Inbox",
          accelerator: "CmdOrCtrl+2",
          click: () => navigate("/inbox"),
        },
        {
          label: "Áreas",
          accelerator: "CmdOrCtrl+3",
          click: () => navigate("/areas"),
        },
      ],
    },
    {
      label: "Visualizar",
      submenu: [
        { role: "reload", label: "Recarregar" },
        ...(isDev
          ? [
            {
              role: "toggleDevTools",
              label: "Ferramentas de Desenvolvimento",
            },
          ]
          : []),
        { type: "separator" },
        { role: "resetZoom", label: "Tamanho Real" },
        { role: "zoomIn", label: "Aumentar" },
        { role: "zoomOut", label: "Diminuir" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Tela Cheia" },
      ],
    },
    {
      label: "Janela",
      role: "window",
      submenu: [
        { role: "minimize", label: "Minimizar" },
        { role: "zoom", label: "Zoom" },
        ...(isMac
          ? [
            { type: "separator" },
            { role: "front", label: "Trazer Todas para a Frente" },
          ]
          : []),
      ],
    },
  ]);
}

// Uma instância só: duas disputariam o mesmo arquivo de banco.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [window] = BrowserWindow.getAllWindows();
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });

  app.whenReady().then(async () => {
    await (isDev ? startDevServer() : startEmbeddedServer());

    Menu.setApplicationMenu(buildMenu());
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // No macOS o app continua aberto sem janelas até o Cmd+Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // Ctrl+C no terminal ou um kill também passam por aqui, para o nuxt dev não ficar órfão.
  process.on("SIGINT", () => app.quit());
  process.on("SIGTERM", () => app.quit());
  process.on("exit", () => {
    if (devServer?.pid) {
      try {
        process.kill(-devServer.pid);
      } catch {
        // já encerrado
      }
    }
  });
}
