---
title: "Troubleshooting"
weight: 90
---

This chapter locates common problems by system layer. First identify which layer failed, then inspect that layer and its neighbors.

> **Scope**: this chapter covers runtime and product-use issues. For development, build, extension, and integration issues, see the [Developer Guide](../../developer/_index.en.md).

## Check state before logs

Open the bottom Process panel first, then expand Logs. Do not start by searching the full log; first determine whether the issue is in the model, tool, Workflow, Robot, Runtime, or browser connection.

![Bottom process panel](../../../static/images/user/getting-started/focus-bottom-process.png)

![Bottom logs panel](../../../static/images/user/getting-started/focus-bottom-logs.png)

## Locate by layer

| Symptom | Check first |
|---|---|
| Page cannot connect or disconnects | Web address, Server HTTP/WebSocket, proxy, and port forwarding |
| Conversation has no response or model error | Model provider, token, default model, and model logs |
| Scene cannot start | Runtime Installation, Layout, Runtime occupancy, and scene logs |
| Robot is offline | Pilot heartbeat, AbilityFramework, Ability, and Robot Skill expected/actual state |
| Plan does not match intent | Conversation, Agent Skill, map query, and Plan Proposal revision |
| Workflow does not advance | Task dependencies, Agent/Robot availability, and pending Interactions |
| Robot action looks wrong | Robot Execution Stage, Action, Feedback, Viewer, and sensors |

## Web cannot connect to Server

Check:

- whether Server listens on HTTP `8080` and WebSocket `8081`;
- whether `VITE_SERVER_HTTP` and `VITE_SERVER_WS` point to the right addresses;
- browser console and Server logs for connection errors;
- whether proxy, containers, or firewall rules allow WebSocket.

## Robot stays offline after Scene starts

Inspect, in order:

1. whether Runtime created the Scene Instance;
2. whether initial Scene state was synchronized;
3. whether Robot Runtime started;
4. whether Pilot connected to Server;
5. whether AbilityFramework and required Abilities are ready;
6. whether Robot Skill is installed and enabled.

Handle the first explicit error before restarting. Stop the old instance before starting a new one so two Pilots do not use the same Robot ID.

## Workflow keeps waiting for assignment

Check the required role, capabilities, and resource constraints:

- a compatible Agent exists;
- the Robot is online and idle;
- required Robot Skills are installed and enabled;
- required Abilities and tools are available;
- dependent Tasks are complete;
- no active Task in the Project is occupying the same Robot.

The Task card shows the exact waiting reason.

## Robot Skill stays running or paused

Open Robot Execution and inspect the last Stage and Action:

- `running`: check whether Feedback continues to update and inspect Robot/Ability state;
- `waiting_agent`: inspect the Robot Agent question or decision activity in Conversation;
- `paused`: read the reason and available action in the waiting card;
- `execution_state_unknown`: restore Pilot connectivity and confirm actual Robot state.

Use the safe-stop entry in Execution or Workflow when ending the action.

## Stop does not finish immediately

A physical action must wait for Pilot to stop the Action and confirm Robot hold:

1. Open **Run & Debug → Workflows** and find the original Workflow by goal, state, and update time.
2. If it is stopping, retry stop and inspect Pilot, AbilityFramework, and Robot Runtime.
3. If execution state is unknown, restore Pilot connectivity and retry normal stop.
4. If connectivity cannot be restored, ask on-site staff to inspect the Robot, end effector, and surroundings. Only after they confirm safe hold should you use “Confirm site safety and finalize”.

Do not delete Workflow, Task, SubTask, or Robot Execution records to release a Robot. Device offline, Runtime exit, or a closed browser window is not proof of safe hold.

## Vite reports inotify watcher exhaustion

This is a Linux file-watch resource issue. Close extra Vite, editor, or test watchers. For long-running parallel frontend work, increase `fs.inotify.max_user_watches` and `fs.inotify.max_user_instances`, then run `npm run dev` again.

## What to include in an issue

Provide minimal reproduction steps, relevant IDs, component versions, log time ranges, and observed behavior. For robot motion issues, include Viewer recordings or images and the Observation from the corresponding Execution Stage.
