---
title: "Connect a Real Robot"
weight: 20
---

A real Robot connects to Semantic through a Robot type package, RobotDeployment, Pilot, AbilityFramework, Abilities, and Robot SDK.

> **No R1 Pro?** You can still use environments, Agent collaboration, Workflow, and Skill debugging in simulation. The simulated Robot uses the same execution chain as a physical Robot. See [Simulation](simulation.en.md) and the [Best Practice](../getting-started/best-practice.en.md).

![Robot instance overview](../../../static/images/user/getting-started/robot-device-overview.png)

The device center and Robot Device page show whether Pilot is online, whether the Robot is idle, whether Abilities are healthy, whether an Execution is active, and whether the Robot is occupied by a Project or Scene.

## Prepare a Robot instance

A Robot type package provides:

- Robot model and backend profile;
- RobotDeployment template;
- Pilot, AbilityFramework, and Ability startup resources;
- Robot SDK and required dependencies;
- a runtime environment for installable Robot Skills.

The user fills in Robot ID, SDK endpoint, frames, safety limits, tool configuration, and desired Robot Skills for the device.

![Robot configuration and deployment](../../../static/images/user/getting-started/robot-device-config.png)

Check these items carefully:

- whether Robot ID is unique and stable;
- whether the SDK endpoint is reachable from the Pilot host;
- whether frames, workspace, and safety limits match the site;
- whether tool configuration matches the physical end effector;
- whether desired Robot Skill versions are published in the Server Registry.

## First enrollment

Create a Pilot enrollment in the global device center to get a short-lived one-time join code. Run the join command from the Robot type package on the Robot host. After enrollment, the launcher writes a dedicated connection configuration and stores the Pilot credential locally.

Pilot uses that credential for future reconnection. The device page shows the bound Pilot, Robot, model, backend, Abilities, and Robot Skill state.

The join code is only for first pairing. Do not put Pilot credentials in Project documentation or Conversation.

## Startup and automatic preparation

The Robot instance launcher manages:

```text
AbilityFramework
→ Required Abilities
→ Pilot
→ Robot Skill expected/actual state sync
```

A Robot can receive Tasks when:

- Pilot is online;
- AbilityFramework is ready;
- required Abilities are available;
- required Robot Skills are installed and enabled;
- the Robot is idle and executable.

If Pilot is online but the Robot is not executable, continue checking AbilityFramework, the seven Abilities, Robot Skill expected/actual state, and Project occupancy. Do not rely on heartbeat alone.

## Stop a Robot instance

Stop first handles active Robot Execution and waits for Robot hold, then stops Abilities, AbilityFramework, and Pilot. Robot SDK and device-controller safety limits always remain in effect.

Follow vendor and site safety procedures for real hardware. Confirm emergency stop, workspace isolation, load, and personnel boundaries before running a task. A page showing “offline” is not proof that the physical robot is safely stopped.
