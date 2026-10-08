# 0003: Desktop offline-first primeiro; web depois, sem sync

**Status:** aceito (2026-09-28)

## Contexto

O mesmo código roda como site multiusuário e como app desktop com banco local. Sincronizar dados entre as duas instâncias exigiria resolução de conflitos, identidade compartilhada e um servidor sempre disponível.

## Decisão

- **v1: só desktop, offline-first.** Um usuário local é criado automaticamente no primeiro boot; não há cadastro nem login.
- **Depois: versão web**, multiusuário, com cadastro e login. É uma instância separada, com banco e contas próprios. Não há sync entre web e desktop.

Toda rota obtém o usuário por um helper "usuário atual": no desktop devolve o usuário local; na web, o usuário da sessão. Assim a versão web entra sem mudar as rotas. O código não ramifica por plataforma além da configuração (conector do banco, modo web ligado ou não).

_Revisado em 2026-09-28: antes, o desktop também teria cadastro e login, com "usar sem conta" opcional._

## Consequências

- Uma tarefa criada no desktop não aparece na web, e vice-versa.
- Sync fica para a Fase 2; exportar/importar pode ser um paliativo se a falta de sync incomodar.
