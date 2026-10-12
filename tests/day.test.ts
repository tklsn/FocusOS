import assert from "node:assert/strict";
import { test } from "node:test";
import { isTodayOrBefore, startOfLocalDay } from "../shared/utils/day";

const noon = new Date(2026, 9, 12, 12, 0);

test("o dia local inteiro conta como hoje", () => {
  assert.ok(isTodayOrBefore(new Date(2026, 9, 12, 0, 0), noon));
  assert.ok(isTodayOrBefore(new Date(2026, 9, 12, 23, 59, 59, 999), noon));
});

test("virada de dia: o que foi marcado ontem continua valendo hoje", () => {
  const marked = new Date(2026, 9, 11, 23, 59, 59, 999);
  assert.ok(isTodayOrBefore(marked, new Date(2026, 9, 11, 23, 59, 59, 999)));
  assert.ok(isTodayOrBefore(marked, new Date(2026, 9, 12, 0, 0)));
  assert.ok(isTodayOrBefore(new Date(2026, 8, 1, 9, 0), noon));
});

test("o que está marcado para amanhã não é de hoje", () => {
  assert.ok(!isTodayOrBefore(new Date(2026, 9, 13, 0, 0), noon));
});

test("startOfLocalDay não altera a data recebida", () => {
  const start = startOfLocalDay(noon);
  assert.equal(start.getHours(), 0);
  assert.equal(noon.getHours(), 12);
});
