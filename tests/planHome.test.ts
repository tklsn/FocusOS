import assert from "node:assert/strict";
import { test } from "node:test";
import { planHome } from "../app/utils/planHome";

const task = (id: string) => ({ id });
const [a, b, c, d] = ["a", "b", "c", "d"].map(task);

test("a primeira tarefa de hoje é o destaque; as demais ficam para depois", () => {
  const plan = planHome([a!, b!], [c!], null);
  assert.equal(plan.highlight, a);
  assert.equal(plan.isSuggestion, false);
  assert.deepEqual(plan.laterToday, [b]);
  assert.deepEqual(plan.moreSuggestions, [c]);
});

test("'Focar' troca o destaque sem tirar nada de hoje", () => {
  const plan = planHome([a!, b!], [], "b");
  assert.equal(plan.highlight, b);
  assert.deepEqual(plan.laterToday, [a]);
});

test("sem nada em hoje, a primeira próxima ação vira sugestão em destaque", () => {
  const plan = planHome([], [c!, d!], null);
  assert.equal(plan.highlight, c);
  assert.equal(plan.isSuggestion, true);
  assert.deepEqual(plan.moreSuggestions, [d]);
});

test("próxima ação que já está em hoje não aparece como sugestão", () => {
  const plan = planHome([a!], [task("a"), c!], null);
  assert.deepEqual(plan.moreSuggestions, [c]);
});

test("sem tarefas não há destaque", () => {
  assert.equal(planHome([], [], null).highlight, undefined);
});
