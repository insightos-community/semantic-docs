---
title: "Robot Execution and Observation"
weight: 10
---

A Robot Skill run produces a Robot Execution. It organizes business steps, robot actions, live feedback, active observations, and the final result into a browsable execution record.

![Robot instance state](../../../static/images/user/getting-started/robot-device-overview.png)

Before reading an Execution, confirm that the Robot is online, idle or in the expected execution state, and that required Abilities are healthy. Device state answers “can it execute”; Execution answers “how is it executing”.

## Execution layers

```text
Robot Execution
└── Stage
    └── Action
        └── Ability invocation
```

- **Stage**: a Robot Skill phase with a clear goal and advancement condition.
- **Action**: a robot capability requested by the Stage.
- **Ability invocation**: AbilityFramework starts or selects an Ability instance and executes the Action.
- **Feedback**: progress and state reported by lower-level execution.
- **Observation**: active observation used to judge current state.
- **Artifact**: images, depth data, files, and other large execution outputs.

![Robot Execution and Stage timeline](../../../static/images/user/getting-started/wf-execution-inspector.png)

## Execution timeline

The device execution page shows Stages over time. Selecting a Stage shows:

- Stage goal, state, and duration;
- Action and Ability invocation;
- Feedback and Observation;
- errors, recovery information, and Artifacts;
- final result and stop state.

The Project bottom debug area connects Workflow, Task, SubTask, and Stage in one timeline, so you can move from a business task to a concrete robot action.

![Execution waiting for Agent decision](../../../static/images/user/getting-started/robot-execution-waiting-agent.png)

Recommended reading order:

1. Check whether the Execution is still running.
2. Find the last Stage that advanced successfully.
3. Read the current Stage's Action and Feedback.
4. Compare Viewer or sensor state with the Execution judgment.
5. Expand logs and Trace when more detail is needed.

## Observe Skill results through Execution

The manual debugging entry and input contract are described in [Using and Debugging Skills](../skills/use-and-debug.en.md). This chapter focuses on reading the Execution after a debug run starts.

When observing a Skill run, check:

- whether the current Stage matches the task intent;
- whether Action was sent to the expected Ability;
- whether Feedback continues to advance or stops in a lower-level executor;
- whether Observation supports the Stage advancement judgment;
- whether Artifacts match the physical state shown in Viewer;
- whether failure happened in Skill, Ability, Robot SDK, or device connectivity.

Manual debugging and formal Tasks produce the same kind of Robot Execution. The difference is the source: a user starts manual debugging from the device page, while a Workflow Robot SubTask starts formal execution.

![Execution run logs](../../../static/images/user/getting-started/execution-logs.png)

The Logs tab shows Skill, model, tool, Execution, and Trace records. It helps distinguish “Skill did not start”, “Action was sent but Ability did not return”, “model planning was wrong”, and “physical execution was safely stopped”.

## Safe stop

An active Execution provides safe stop. Server sends the stop request to Pilot; Pilot stops the current Action and puts the Robot into hold. The UI shows a terminal state only after real stop evidence arrives.

Once stop enters `stopping`, older delayed events do not move it back to active. If Pilot is offline, Execution shows unknown state, the Robot remains occupied, and the original action is not replayed after Server restart.

Restore Pilot connectivity and retry normal safe stop first. If it cannot be restored, use “Confirm site safety and finalize” from the parent Workflow only after on-site staff confirm the chassis, arm, and tools are stopped and safely held. The confirmation and the original error remain in Execution history.

Never delete database records to release a Robot, and never treat process exit or device offline as proof of safe hold.
