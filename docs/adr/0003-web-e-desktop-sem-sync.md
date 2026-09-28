# 0003: Web e desktop como instâncias independentes, sem sync

**Status:** aceito (2026-09-28)

## Contexto

O mesmo código roda como site multiusuário e como app desktop com banco local. Sincronizar dados entre as duas instâncias exigiria resolução de conflitos, identidade compartilhada e um servidor sempre disponível.

## Decisão

No MVP, **web e desktop são instâncias separadas**: cada uma tem seu banco, suas contas e seus dados. Não há sync.

- **Web:** cadastro e login obrigatórios, multiusuário.
- **Desktop:** o mesmo fluxo de cadastro e login funciona, e além disso existe a opção de entrar sem login com um usuário local criado automaticamente.

O código não ramifica por plataforma além da configuração (conector do banco, modo sem login habilitado ou não).

## Consequências

- Uma tarefa criada no desktop não aparece na web, e vice-versa.
- Sync fica para a Fase 2; exportar/importar pode ser um paliativo se a falta de sync incomodar.
