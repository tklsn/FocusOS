# 60: Pipeline de release no GitHub

**What to build:** Um push de tag `vX.Y.Z` builda o app nos três sistemas no GitHub Actions e publica uma release no GitHub com os instaladores e os arquivos de atualização.

**Blocked by:** 59

**Status:** in-review

- [ ] Workflow em `.github/workflows/release.yml`, disparado só por tag `v*`
- [ ] Um job por sistema (`macos-latest`, `windows-latest`, `ubuntu-latest`), cada um com `pnpm install`, `nuxt build` e electron-builder com `--publish always`
- [ ] O workflow falha antes de buildar se a tag não bater com o `version` do `package.json`
- [ ] Enquanto os jobs rodam, a release é rascunho; ela só é publicada quando os três terminam bem. Se um falhar, fica o rascunho e nenhum app instalado vê a versão
- [ ] A release publicada contém os instaladores do ticket 59 e os arquivos `latest.yml`, `latest-mac.yml` e `latest-linux.yml`
- [ ] Usa só o `GITHUB_TOKEN` do próprio workflow; nenhum segredo novo
- [ ] Como lançar uma versão está escrito no `README.md` (bump do `version`, commit, tag, push)

## Comments

### Nota do PO (2026-10-26)

- Decisões em `docs/adr/0006-releases-e-auto-update.md`. O humano escolheu publicar direto pela tag, sem conferência manual.
- `publish` do electron-builder com provider `github` em `tklsn/FocusOS` e `releaseType: draft`; o passo final, que depende dos três jobs, troca para publicada (ex.: `gh release edit vX.Y.Z --draft=false`). Assim os três jobs sobem no mesmo rascunho em vez de cada um criar uma release.
- Permissão do workflow: `contents: write`.
- Sem assinatura: não definir `CSC_LINK` e manter `identity: null` no mac, para o electron-builder não tentar assinar no runner.

### Implementação 2026-10-26 (agente, a pedido)

- `.github/workflows/release.yml` tem três jobs. `draft` confere a tag contra o `version` e cria o rascunho com `gh release create --draft --generate-notes` (`--prerelease` se a tag tiver `-`). `build` roda um por sistema e sobe os arquivos com `electron-builder --publish always` no mesmo rascunho. `publish` roda depois dos três e chama `gh release edit --draft=false`.
- O rascunho é criado antes dos builds para os três jobs não criarem cada um a sua release ao mesmo tempo.
- Só `GITHUB_TOKEN` (`contents: write`). pnpm 12 e Node 24, as versões locais.
- `README.md` ganhou "Lançar uma versão".
- Não conferido: o workflow ainda não rodou, porque precisa de push de tag e o agente não fez push. Primeiro teste sugerido: subir o `version` para `0.2.0-beta.1` e dar push da tag `v0.2.0-beta.1`.
