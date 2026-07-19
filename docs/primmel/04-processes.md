# Chapter 4 — Processes

> *In this chapter:* the process model — the DOES of every subject.
> Abstract and executable forms, the step vocabulary, executors, state,
> and how process I/O becomes evidence.

---

## 4.1 A process is a subject

Chapter 2 established the recursion: a behavior is a Process, and a
Process answers the same three questions as any subject:

- **Process IS** — its signature (IN/OUT parameters), invariants,
  designed envelope, actor/executor, obligation.
- **Process HAS** — its current state, registers/variables, actual
  context, and *process characteristics* (duration, rate, drift of the
  process itself).
- **Process DOES** — its steps and sub-processes, bottoming out in
  **atomic steps**: a register write, a stimulus application, a wait.

The recursion is what keeps the language small: there is no separate
"step metamodel". A step that needs detail is refined into a sub-process
with its own anatomy; a step that doesn't stays atomic.

## 4.2 Two definition forms — the author's ladder

![The process model](diagrams/process-model.svg)

Every process is authored in one of two forms:

- **Abstract process** — the signature plus invariants, nothing more.
  It says *what* the process is and what must hold, not how it proceeds.
  In a **reference model**, an abstract process reads as *"a process is
  required to fulfil these provisions"* — it is requirement-level.
  **An abstract process is always valid.** Most processes in a standard
  need no more.
- **Executable process** — the signature plus concrete steps,
  transitions, and register operations: the executable digital twin of
  how the process actually proceeds. Required when the process must be
  simulated (R 91's traffic-simulator tests), automated (workflow
  dispatch), or state-gated (warm-up enforcement).

The ladder rule: **author abstract; refine to executable only when
simulation or automation demands it.** Executable steps are additive —
an abstract process refined later is an extension, not a modification
(OCP). The two forms live *within one model*; do not confuse this form
axis with the model-kind axis of chapter 5 (reference vs implementation
— related by mapping, never by refinement).

## 4.3 The step vocabulary

Eight step kinds cover the standard's process content:

| Step kind | Meaning | Executor |
|---|---|---|
| **action** | do work: apply, record, compute, notify | machine or actor |
| **approval** | a role signs off; binds an approver role + an approval registry | actor |
| **gateway** | conditional branch; conditions on outgoing edges, in OCL | machine |
| **parallel gateway** | unordered conjunction — all branches required, no order | machine |
| **start event** | the one entry point of a process | — |
| **end event** | terminates a path; *required* on an empty gateway path to say "no requirement here" | — |
| **timer event** | a period or deadline; with a self-loop = recurrence (re-verification every N months) | machine |
| **signal event** | an external trigger starts/resumes the process | — |

Connection semantics, three rules only:

1. **Serial** — `A → B`: do A, then B.
2. **Parallel** — two unconditioned paths: both, in any order.
3. **Self-loop + timer** — repeat with a period.

Gateway semantics: if edges carry OCL conditions, the satisfied path is
taken (first match in document order; an explicit default edge catches
the rest). If no edge is conditioned, the gateway is fulfilled when *any*
outgoing path is fulfilled (the "implement at least one option" reading).

## 4.4 Executors

Every step declares its **executor** as an IS-level property:

- **machine** — the engine runs it: OCL evaluation, gateway resolution,
  calculations, applicability expansion, state transitions, verdict
  re-execution.
- **actor** — a role performs it: the lab technician applies the load,
  the IA reviewer signs. Actor steps are *recorded*, not run: their
  outputs are captured through forms into evidence.

Executor typing is what makes "an executable suite of workflow programs"
precise rather than rhetorical: the engine executes machine steps
directly, drives actor steps by presenting their input forms, and treats
the process as blocked until the actor's record lands in the registry.

## 4.5 State and registers

A process's HAS is where its memory lives:

- **state** — the process's state machine: named states and guarded
  transitions. Instrument-side example: `off → warming → ready →
  measuring → fault`. Workflow-side example: `draft → submitted →
  under_review → dispatched → …`. Transitions are fired by steps and by
  cascades (a transition in one machine may set states in another, with
  `where` guards and `create` effects).
- **registers** — typed variables the process reads and writes:
  measurement variables with source typing (chapter 6). A step's I/O is
  declared in terms of registers.
- **context** — the actual conditions under which the process executes,
  logged per run.

Preconditions are OCL guards on entry: a violated run-validity
precondition voids the run *as a run* (its verdicts become `invalid`,
never `fail`) — the state gate that keeps an unwarmed instrument from
producing misleading evidence.

## 4.6 Process I/O = evidence

Steps consume and produce **records in registries** (chapter 6): a test
step reads the subject's parameters, enforces conditions, and writes
measurements; a workflow step reads an application and writes a dispatch.

The **execution trace** of one run — the filled registers, the
conditions log, the state trajectory, timestamps, the operator — is the
process's exhibited HAS at run time. That trace is exactly what the
Evidence model stores, and it lives in the workspace (`.pws/`): one
record per filled slot, typed by the process output it satisfies. Facts
only: no verdicts in a trace (the firewall, chapter 1).

## 4.7 Repetition and instances

Two parameterizations keep one process definition serving many runs:

- **per-classification instances** — the process declares instance
  parameters keyed by a subject dimension (R 60: `n_runs` = 5 for
  accuracy classes A/B, 3 for C/D). The applicability engine expands the
  concrete run plan per subject at execution time.
- **timer-driven recurrence** — the process re-fires on a period
  (initial verification, then re-verification every 12 months; tyre
  change on an ego meter re-triggers out of cycle via a signal event).

## 4.8 Processes across model kinds

The same process concept, three voices:

- in a **reference model**: "a process is required" (abstract form) —
  R 60-2's creep test method is a requirement for a process, specified
  to step level but still normative, not actual;
- in an **implementation model**: "this is how we actually do it"
  (usually executable) — the lab's SOP, the platform's dispatch
  workflow — mapped to the reference process (chapter 5);
- in the **workspace**: "this is what happened" — the execution traces.

## 4.9 Grammar sketch *(illustrative v3 syntax)*

```prl
process creep_test {
  is {
    signature {
      in  applied_load : mass, duration : time
      out indication_series : mass[]
    }
    preconditions { ocl{ self.state = #ready and self.warmed_up } }
    executor lab
  }
  does {
    start_event s
    action stabilize   { executor actor  write conditions_log }
    action apply_load  { executor actor  set applied_load }
    action hold        { executor machine wait duration }
    action record      { executor machine capture indication_series }
    end_event e
    flow { s -> stabilize -> apply_load -> hold -> record -> e }
  }
}
```

## 4.10 Validation rules

- exactly one start event per process; end events on every terminal path
  (mandatory on empty gateway branches);
- every gateway edge's condition is OCL over declared registers;
- every step's I/O names declared registers; every register is written
  by exactly one step kind (no competing writers);
- every precondition is an OCL Boolean over signature and state;
- an executable process's steps realize its own signature (the OUT
  parameters are written; the IN parameters are read);
- a timer event's period is a time primitive; a self-loop contains a
  timer (no unguarded infinite loops).

## 4.11 Summary

- A process is a subject: IS the signature, HAS the state and registers,
  DOES the steps.
- Abstract is always valid; executable is added when simulation or
  automation demands it.
- Eight step kinds, three connection rules, two executor kinds.
- Preconditions void runs, never instruments; traces are facts, never
  verdicts.
- Per-classification instances and timer recurrence let one definition
  serve every run.

*Next: [Chapter 5 — Mappings](05-mappings.md): reference and
implementation models, and the coverage calculus.*
