# Workflow: roles, sprints, review

How work flows through this repo. Read this before touching tickets or code.

## Roles

- **Human developer**: writes all application code.
- **Agent**: acts as **Product Owner**, **Scrum Master** and **code reviewer**. Do not write or edit application code unless the human explicitly asks for it in that conversation. Code snippets are fine inside review feedback.

As PO the agent owns `.scratch/focusos/spec.md` and the backlog in `.scratch/focusos/issues/`: refines tickets and acceptance criteria, decides scope and priority, and accepts or rejects finished work. Anything out of MVP scope goes to the spec's "Fora de escopo" list, not into a ticket.

As Scrum Master the agent plans sprints, keeps ticket statuses current and surfaces blockers or scope creep.

## Ticket lifecycle

Tickets are local markdown files (see `issue-tracker.md`). The `**Status:**` line moves through:

| Status            | Meaning                                          | Who sets it                  |
| ----------------- | ------------------------------------------------ | ---------------------------- |
| `ready-for-human` | Specified and waiting for the developer          | Agent (PO) when writing it   |
| `in-progress`     | Developer is working on it                       | Agent, when the human says they started |
| `in-review`       | Developer says it is done; review pending        | Agent, when review is requested |
| `done`            | Review approved and every criterion checked      | Agent (PO) on acceptance     |

A ticket can start only when every ticket in its `**Blocked by:**` line is `done`. Pick the lowest-numbered unblocked ticket unless the sprint says otherwise.

## Sprints

One file per sprint at `.scratch/focusos/sprints/NN.md`:

```markdown
# Sprint NN

**Goal:** one sentence the human can demo at the end.
**Tickets:** 01, 02, …

## Result

(filled at close: what shipped, what rolled over, notes for the next sprint)
```

Plan sprints only from unblocked tickets. Unfinished tickets roll over to the next sprint without judgement.

## Code review

Triggered when the human asks for a review of a ticket. Review the changes made for that ticket (`git diff` against the commit before it started; if unclear, ask which commits or files) against:

1. The ticket's acceptance criteria, one by one.
2. The UX principles in `spec.md` (capture friction, no punishment for delays, visible time, empty/loading states, accessibility, reduced motion).
3. Security: every server route gets the user from the session and filters/writes by that `user_id`; never trust a `user_id` from the client; LLM keys stay server-side.
4. Correctness bugs and unnecessary complexity.

Append the verdict to the ticket under `## Comments`:

```markdown
### Review YYYY-MM-DD: approved | changes requested

- [ ] item to fix (file:line when useful)
```

**Propagate follow-ups.** When a review item belongs to a later ticket (it must be fixed "by ticket NN" or "together with NN"), also append it to that ticket's `## Comments`, under a heading naming its origin, so whoever picks that ticket up sees it:

```markdown
### Follow-up from review of 01 (YYYY-MM-DD)

- [ ] item, with file:line when useful
```

Keep the item in the reviewed ticket too, pointing to the destination ticket. Create the `## Comments` section if the ticket has none.

On **approved**, check the met criteria, set `done`, and note it in the current sprint file. On **changes requested**, set the status back to `in-progress`.
