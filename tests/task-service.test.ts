import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

// Banco descartável: precisa estar definido antes de carregar server/utils/db.
process.env.DB_FILE_NAME = join(
  mkdtempSync(join(tmpdir(), "focusos-test-")),
  "test.db",
);
const { db } = await import("../server/utils/db");
const { areas, projects, users } = await import("../server/db/schema");
const { taskService } = await import("../server/services/task.service");

function createUser(name: string) {
  return db
    .insert(users)
    .values({ username: name, name, email: `${name}@local.local` })
    .returning()
    .get();
}

function createProject(userId: string, name: string) {
  const area = db
    .insert(areas)
    .values({ user_id: userId, name: `Área de ${name}` })
    .returning()
    .get();
  return db
    .insert(projects)
    .values({ user_id: userId, area_id: area.id, name })
    .returning()
    .get();
}

const user = createUser("ana");
const stranger = createUser("bia");
const project = createProject(user.id, "Site");
const foreignProject = createProject(stranger.id, "Alheio");

const reload = async (id: string) =>
  (await taskService.findTasksByUserId(user.id)).find((task) => task.id === id);

test("tarefa sem projeto nasce na Inbox; com projeto, no fim da lista", async () => {
  const inbox = await taskService.createTask(user.id, "Solta");
  assert.equal(inbox?.status, "inbox");
  assert.equal(inbox?.project_id, null);

  const first = await taskService.createTask(user.id, "Primeira", project.id);
  const second = await taskService.createTask(user.id, "Segunda", project.id);
  assert.equal(first?.status, "todo");
  assert.equal(second!.sort_order, first!.sort_order + 1);

  assert.equal(
    await taskService.createTask(user.id, "Intrusa", foreignProject.id),
    undefined,
  );
});

test("mover para projeto vira 'todo'; projeto ou tarefa de outro usuário não grava", async () => {
  const task = (await taskService.createTask(user.id, "Triar"))!;

  const moved = await taskService.updateTask(user.id, task.id, {
    project_id: project.id,
  });
  assert.equal(moved?.project_id, project.id);
  assert.equal(moved?.status, "todo");

  assert.equal(
    await taskService.updateTask(user.id, task.id, {
      title: "Não deve gravar",
      project_id: foreignProject.id,
    }),
    undefined,
  );
  assert.equal((await reload(task.id))?.title, "Triar");

  assert.equal(
    await taskService.updateTask(stranger.id, task.id, { title: "Invasão" }),
    undefined,
  );
  assert.equal((await reload(task.id))?.title, "Triar");
});

test("uma próxima ação por projeto; concluir tira a marca", async () => {
  const a = (await taskService.createTask(user.id, "A", project.id))!;
  const b = (await taskService.createTask(user.id, "B", project.id))!;

  await taskService.updateTask(user.id, a.id, { is_next_action: true });
  await taskService.updateTask(user.id, b.id, { is_next_action: true });
  assert.equal((await reload(a.id))?.is_next_action, false);
  assert.equal((await reload(b.id))?.is_next_action, true);

  const done = await taskService.updateTask(user.id, b.id, { done: true });
  assert.equal(done?.status, "done");
  assert.equal(done?.is_next_action, false);
  assert.ok(done?.completed_at);

  // concluída não pode ser próxima ação, a menos que seja reaberta junto
  assert.equal(
    await taskService.updateTask(user.id, b.id, { is_next_action: true }),
    undefined,
  );
  const reopened = await taskService.updateTask(user.id, b.id, {
    done: false,
    is_next_action: true,
  });
  assert.equal(reopened?.status, "todo");
  assert.equal(reopened?.is_next_action, true);
  assert.equal(reopened?.completed_at, null);
});

test("tarefa da Inbox não vira próxima ação e nada do pedido é gravado", async () => {
  const task = (await taskService.createTask(user.id, "Na Inbox"))!;

  assert.equal(
    await taskService.updateTask(user.id, task.id, {
      title: "Outro título",
      is_next_action: true,
    }),
    undefined,
  );
  assert.equal((await reload(task.id))?.title, "Na Inbox");

  const done = await taskService.updateTask(user.id, task.id, { done: true });
  assert.equal(done?.status, "done");
  const reopened = await taskService.updateTask(user.id, task.id, {
    done: false,
  });
  assert.equal(reopened?.status, "inbox");
});

test("'today' marca e desmarca sem mexer em status ou projeto", async () => {
  const task = (await taskService.createTask(user.id, "Para hoje"))!;

  const marked = await taskService.updateTask(user.id, task.id, {
    today: true,
  });
  assert.ok(marked?.scheduled_for);
  assert.equal(marked?.status, "inbox");
  assert.ok(
    (await taskService.findToday(user.id)).some((t) => t.id === task.id),
  );

  const cleared = await taskService.updateTask(user.id, task.id, {
    today: false,
  });
  assert.equal(cleared?.scheduled_for, null);
});

test("campos de texto: intenção vazia grava null", async () => {
  const task = (await taskService.createTask(user.id, "Texto", project.id))!;

  const updated = await taskService.updateTask(user.id, task.id, {
    notes: "uma nota",
    implementation_intention: "depois do almoço",
  });
  assert.equal(updated?.notes, "uma nota");
  assert.equal(updated?.implementation_intention, "depois do almoço");

  const cleared = await taskService.updateTask(user.id, task.id, {
    implementation_intention: null,
  });
  assert.equal(cleared?.implementation_intention, null);
});
