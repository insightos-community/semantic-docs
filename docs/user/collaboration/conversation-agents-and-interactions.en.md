---
title: "Conversation, Agents, and Interactions"
weight: 10
---

Conversation is the main interface for collaborating with Agents. Leader understands the overall goal and coordinates work. Task-owning Agents produce concrete results. Robot Agents combine the current Robot and available Skills to advance robot tasks.

![Planning Conversation and Plan Proposal](../../../static/images/user/getting-started/focus-plan-conversation.png)

The right Conversation panel can stay open beside the scene. You can describe the goal while watching simulation, Robot state, and the resulting Plan Proposal.

## Collaboration and Planning modes

The input area provides two main modes:

- **Collaboration**:问答, analysis, discussion, and general tool-using work.
- **Planning**: tasks that may produce physical robot actions. The Agent first creates a Plan Proposal and waits for user review.

![Collaboration mode conversation](../../../static/images/user/getting-started/collaboration-mode.png)

The image above is **Collaboration mode**: you ask an ordinary question and Leader answers with several `map_query` tool calls, without producing a Plan Proposal.

![Planning mode multi-Agent conversation](../../../static/images/user/getting-started/planning-conversation.png)

The image above is **Planning mode**: you describe a goal that produces robot actions. Leader queries the environment, submits a Plan Proposal, and system activity (Plan approved, Task assigned/started) plus Robot Agent execution messages appear.

Planning mode does not execute immediately. Its purpose is to turn goal, scope, Robot, Skills, and completion criteria into a plan card before execution.

## Describe goals in natural language

A message can include:

- business goal and completion criteria;
- target objects, regions, or Robots;
- time, resource, and safety constraints;
- entities selected from Viewer or Semantic Map;
- images, files, and other Artifacts.

When the goal is clear, the Agent can query the environment, propose a plan, or continue current work. You do not need to describe low-level Stages, Actions, joint trajectories, or device commands.

## Multi-Agent messages

The main Conversation shows outputs that matter to collaboration:

- Leader's goal understanding, planning notes, and final summary;
- planning summaries from Robot, Map, Monitor, Developer, and other Agents;
- structured Interactions from Agents;
- Recovery analysis and adjustment results;
- Task results and related Artifacts.

Task assignment, Run start, Robot Execution acceptance, and state changes appear as system activity. Tool calls, raw model structures, and Stage flow live in Trace, Execution, and debug panels.

![Execution run logs](../../../static/images/user/getting-started/execution-logs.png)

Use the bottom Logs tab to expand model calls, Skill calls, map queries, and Plan submission traces. Normal work can stay in Conversation; use these records when diagnosing a problem.

## Structured Interactions

When an Agent needs a choice, parameter, or authorization from the user, it inserts an Interaction into Conversation. Common forms include:

- confirmation;
- forms;
- single or multiple choice;
- parameter input;
- image, map entity, and file selection.

After you submit an answer, the original Agent continues in the same task context. An Interaction card can be submitted, postponed, skipped when allowed, or cancelled.

## Ask effective tasks

A clear request usually has three parts:

```text
What should be completed
Which environment or objects to use
How completion should be judged
```

Example:

```text
Move the four movable totes on the top layer of the source pallet to the empty columns of the target pallet.
Use the available Robot in the current Scene and keep tote orientation.
When finished, confirm all four totes are stable, tools are empty, and summarize occupancy in each target column.
```

The Agent queries Semantic Map and live resources as needed. When several reasonable business choices exist, an Interaction lets the user decide.

## How to read a long Agent response

1. Read the final conclusion or Plan Proposal first.
2. Review the environment facts the Agent queried.
3. Check the allowed Robot, Skills, and object scope.
4. Expand reasoning, tool calls, and Trace only when diagnosing.
5. If the plan needs changes, say exactly what to change and ask for a new revision.

Do not approve execution from a single sentence. For robot actions, the Plan Proposal card is the final review boundary.
