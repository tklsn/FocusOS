# 40: Shell Electron em desenvolvimento

**What to build:** Rodando um comando de desenvolvimento, abre uma janela desktop do FocusOS carregando o app do `nuxt dev`, com hot reload.

**Blocked by:** 01

**Status:** done

- [x] Um script (ex.: `pnpm dev:desktop`) sobe o `nuxt dev` e abre a janela Electron apontando para ele
- [x] Renderer isolado: `contextIsolation` ligado e `nodeIntegration` desligado
- [x] Fechar a janela encerra o processo no macOS conforme a convenção da plataforma (Cmd+Q)
- [x] `pnpm dev` (web) continua funcionando sem Electron

## Comments

### Implementação 2026-10-09 (agente, a pedido)

- `electron/main.mjs` é o processo main; `package.json` aponta para ele em `main`. Electron 44 como dev dependency (`electron: true` em `allowBuilds` do `pnpm-workspace.yaml`, para baixar o binário).
- `pnpm dev:desktop` roda `electron . --dev`: o main sobe o `nuxt dev` em `127.0.0.1:3000`, a mesma do `pnpm dev` (ou numa porta livre, se ocupada), espera responder e abre a janela nele. Hot reload é o do próprio Nuxt.
- Janela com `contextIsolation` ligado, `nodeIntegration` desligado e `sandbox` ligado; sem preload. Links externos abrem no navegador do sistema e a janela não navega para fora do app.
- macOS: fechar a janela mantém o app aberto e clicar no ícone reabre; Cmd+Q encerra. Ao sair (Cmd+Q, Ctrl+C no terminal ou kill) o `nuxt dev` é encerrado junto.
- Uma instância só por vez; abrir de novo foca a janela existente.
- `pnpm dev` não mudou.
- Conferido por linha de comando: o servidor de dev sobe, o renderer carrega o app sem erros no console e a porta é liberada ao encerrar. A janela em si não foi vista: falta a confirmação visual do humano (abrir, editar um arquivo e ver o hot reload, Cmd+Q).

### Janela sem barra de título 2026-10-09 (agente, a pedido)

- macOS: `titleBarStyle: "hiddenInset"`; os botões da janela ficam sobre o topo da barra lateral, que ganhou espaço para eles.
- `app/components/app/Titlebar.vue` substitui o cabeçalho do layout: é a área de arrastar a janela e abre espaço à esquerda quando a barra lateral está recolhida, para o botão dela não ficar sob os botões da janela. O topo da barra lateral também arrasta.
- `app/utils/isDesktopMac.ts` detecta a janela Electron no macOS pelo user agent; no navegador (`pnpm dev`) nada muda.
- Tamanho mínimo da janela: 480 × 400.
- Lint e build passam; a janela não foi vista. Conferir: posição dos botões da janela, arrastar pelo topo, botão da barra lateral clicável nos dois estados.

### Menu do aplicativo 2026-10-09 (agente, a pedido)

- Menu próprio em português, montado em `buildMenu()` no `electron/main.mjs`: FocusOS (Sobre, Configurações…, Ocultar, Encerrar), Arquivo, Editar, Ir, Visualizar e Janela.
- "Ir" navega pelo roteador do app, sem recarregar: Hoje (Cmd+1), Inbox (Cmd+2), Áreas (Cmd+3). Configurações… usa Cmd+,.
- "Capturar Tarefa" mostra Cmd+I, mas o atalho continua tratado pelo app; clicar no item repete a tecla para a janela.
- "Ferramentas de Desenvolvimento" só aparece em `pnpm dev:desktop`.
- O app sobe com o menu sem erros; os itens não foram clicados. Conferir: cada item de "Ir", Configurações…, Capturar Tarefa pelo clique e pelo atalho, e copiar/colar num campo.

### Ajustes 2026-10-09 (agente, a pedido)

- `pnpm dev:desktop` usa `http://localhost:3000`, o mesmo endereço do `pnpm dev`. Se já houver um servidor respondendo ali, a janela o reaproveita em vez de subir outro: dois `nuxt dev` no mesmo projeto disputam a pasta `.nuxt` e quebram a página (erro 500 "reading 'meta'").
- O segredo da API não é mais usado em dev; ele bloqueava o navegador com 403 no mesmo servidor. Continua valendo no app instalado (ticket 41), onde substitui a nota anterior que dizia valer também em `dev:desktop`.
- Botões da janela descidos (`trafficLightPosition.y` de 18 para 25) para alinhar com o botão da barra lateral, que fica 8 px abaixo do topo por causa da margem do conteúdo.
- Em dev o título do menu no macOS continua "Electron": vem do `Info.plist` do Electron.app em `node_modules`. No app empacotado aparece "FocusOS".
- Não rodado depois destas mudanças, só lint e checagem de sintaxe.
