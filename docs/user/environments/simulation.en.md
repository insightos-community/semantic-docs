---
title: "Simulation"
weight: 10
---

Semantic uses simulated Scenes as embodied environments for Projects. A Scene provides space, objects, sensor data, and virtual Robots. Virtual Robots execute through the same Pilot, Ability, and Robot Skill chain as physical Robots.

![Simulation running](../../../static/images/user/getting-started/06-simulation-running.png)

Simulation is not a separate demo path. Project, Conversation, Workflow, Pilot, Ability, Robot SDK, and Robot Skill behave the same way; MuJoCo Runtime simply provides the physical backend.

## Scene, Layout, and Runtime

- **Scene**: the runnable environment type and resources.
- **Layout**: object placement, Robot initial state, and spatial arrangement for one run.
- **Runtime Profile**: the Runtime capabilities required by the Scene.
- **Runtime Installation**: an actual Runtime this Server can start or connect to.

The start panel lists compatible Runtime Installations for the selected Profile. If several candidates exist, the user can choose one and save the Project preference.

![Select a Layout](../../../static/images/user/getting-started/05-layout001-selected.png)

## Start a Scene

In Project environment resources:

1. Select Scene and Layout.
2. Confirm the Runtime Installation.
3. Click “Start this Layout”.
4. Watch Scene Instance, Runtime, and virtual Robot startup state.

After initial Scene state synchronization, Framework starts the virtual Robot instance, including Pilot, required Abilities, and Robot Skills. The Robot becomes idle when it is ready.

Check three places after startup:

- whether Physics Viewer keeps refreshing;
- whether Scene Instance is `running` in Inspector;
- whether Project Robot is online and idle.

## Viewer and Semantic Map

Viewer shows the live simulated state. Semantic Map describes objects, regions, and spatial relations for Agent reasoning.

![Semantic Map](../../../static/images/user/getting-started/13-map-panel.png)

Use the map to answer “what exists in the environment”:

- whether pallets, regions, totes, and Robots exist;
- which map generation they belong to;
- whether regions and object relations are complete;
- whether names queried by the Agent match the page.

## Sensors

The sensor page answers “what the Runtime currently observes”. RGB, Depth, and Contact data help verify simulation health, object contact, and tool state.

![Sensor Viewer](../../../static/images/user/getting-started/14-sensors-panel.png)

Planning usually does not require manual sensor reading; Agents and Robot Skills query it as needed. During troubleshooting, sensors help compare map facts with live physical state.

## Reset, switch, and stop

- **Reset**: Robot enters hold first, then the Scene returns to the Layout initial state.
- **Switch Layout**: safely stops related Robot execution, stops the current Scene Instance, and starts the new Layout.
- **Stop Scene**: stops active execution and managed Robot instances, then ends the Scene Instance.

Externally shared Runtimes are managed by their owner. Stopping a Project Scene only ends the Scene and managed instances created by that Project.

## Startup problems

The startup panel shows Scene Runtime, Robot Runtime, Pilot, Ability, and Robot Skill state. If one virtual Robot fails, the Scene may still be viewable and that Robot appears as degraded with an error.

If the Runtime is occupied by another Project, stop that Project's Scene first or continue in the Project that already owns the Runtime.
