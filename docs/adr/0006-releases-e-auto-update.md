# 0006: Releases no GitHub e auto-update com electron-updater

**Status:** aceito (2026-10-26). Revê a consequência da 0002 que deixava auto-update fora do MVP.

## Contexto

O desktop (ADR 0002) sai hoje só como `.dmg` macOS gerado na máquina do desenvolvedor (ticket 41). Queremos versões para macOS, Windows e Linux, publicadas sem passo manual, e que os apps instalados se atualizem.

No macOS, quem aplica a atualização é o Squirrel.Mac, embutido no Electron. Ele recusa uma atualização sem assinatura Developer ID válida, use-se electron-builder, electron-forge ou `update-electron-app`. Assinar exige o Apple Developer Program (US$ 99/ano), que fica para depois. No Windows (NSIS) e no Linux (AppImage), o `electron-updater` atualiza apps sem assinatura.

## Decisão

- **Empacotamento:** continua o **electron-builder** (já usado no ticket 41). Alvos: macOS `dmg` + `zip` (arm64 e x64), Windows `nsis` (x64), Linux `AppImage` (x64).
- **Distribuição:** **GitHub Releases** do repositório público `tklsn/FocusOS`, com o provider `github` do electron-builder. Sem servidor próprio e sem token no app.
- **Disparo:** push de tag `vX.Y.Z` roda um workflow do GitHub Actions com um runner por sistema. A release fica em rascunho enquanto os builds sobem e é publicada automaticamente quando os três terminam bem. Não há conferência manual entre a tag e os usuários.
- **Auto-update:** `electron-updater` no processo main.
  - Windows e Linux: verifica, baixa em segundo plano e instala ao sair do app. Nada de modal; um item de menu permite reiniciar já.
  - macOS (sem assinatura): só detecta a versão nova e oferece abrir a página da release; o usuário baixa o `.dmg` à mão.
- **Dados:** antes de aplicar migrations pendentes no boot, o banco é copiado. As migrations seguem só para frente (ADR 0005); a cópia é o caminho de volta.

## Alternativas descartadas

- **electron-forge + `update-electron-app`:** não evita a assinatura no macOS e obrigaria a refazer o empacotamento do ticket 41.
- **Assinar o macOS já:** custo anual antes de haver usuários. Fica como ticket posterior.
- **Servidor de updates próprio (Hazel, Nuts, S3):** infraestrutura a manter sem ganho sobre o GitHub Releases para um repositório público.

## Consequências

- Primeira instalação sem assinatura: o macOS pede "Abrir" pelo menu de contexto; o Windows mostra o aviso do SmartScreen de editor desconhecido.
- Uma tag com bug chega aos usuários de Windows e Linux sem conferência humana. A correção é uma nova tag; não há rollback de versão pelo updater.
- `electron-updater` vira dependência de runtime e precisa ir para dentro do `app.asar` (hoje o build exclui `node_modules`).
- Cada release ocupa ~400 MB de artefatos no GitHub; não há limite prático para repositório público.
