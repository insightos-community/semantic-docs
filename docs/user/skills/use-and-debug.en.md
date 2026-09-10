---
title: "Using and Debugging Skills"
weight: 10
---

Semantic has two kinds of Skills: Agent Skills and Robot Skills. Agent Skills help Agents understand how to work; Robot Skills help Robots execute reusable embodied tasks.

![Skill Library](../../../static/images/user/getting-started/agent-skill-library.png)

The Skill Library and Agents area manage Agent, Skill, and Tool resources. Most users can start with the defaults. Open these pages when you need to understand why an Agent planned a certain way or why a Robot can execute a Skill.

## Agent Skill

An Agent Skill provides domain guidance, step recommendations, tool usage, and reference material. A Project can select required Agent Skills and control visibility by Agent role.

In the Skill Library you can:

- read `SKILL.md`;
- inspect related resources;
- see applicable Agents;
- associate a Skill with a Project;
- observe how the Agent applies it in Conversation.

![Agent loading a Skill](../../../static/images/user/getting-started/08-planning-request-sent.png)

During planning, Conversation shows tool calls such as Skill loading, map query, and Plan submission. Agent Skills affect how Agents understand and organize work; they do not directly control a Robot.

## Robot Skill

A Robot Skill describes a robot task made of Stages, such as navigation, grasping, and placing. Its detail page shows:

- name and version;
- `SKILL.md`;
- input and result models;
- required Actions and stop Actions;
- compatible Robot models;
- desired version and actual installation state on each Robot;
- scripts, references, and resources.

RobotDeployment declares desired Robot Skills. Server and Pilot synchronize installation, upgrade, and enablement state automatically.

A Robot Skill controls how a task becomes Stages and Actions through Pilot and Ability. It does not treat Semantic Map as physical truth; execution must re-observe current state through Ability.

## Manually debug a Robot Skill

The Robot Skill page on a device provides manual debugging. Before starting, confirm the Robot is online, idle, and not occupied by another active Project task.

![Robot Skill list and basic debugging](../../../static/images/user/getting-started/robot-device-skills.png)

1. Open the Robot Skill page in the device or Project.
2. Select an online and idle Robot.
3. Select an installed and enabled Robot Skill version.
4. Fill the minimum business parameters through the form or JSON editor generated from the Skill input model.
5. Start debugging and open the generated Robot Execution.
6. Observe Viewer, Execution timeline, Stage, Action, and logs.

![Robot Skill debug input contract](../../../static/images/user/getting-started/robot-skill-debug-form.png)

Manual debugging uses the same Robot Execution, Pilot, Ability, and Robot SDK path as formal execution. Simulation and real Robots share the same entry, and Robot safety limits and occupancy rules still apply. After debugging, confirm the Robot is idle before approving a formal Workflow.

Starting a debug run produces a real Robot Execution. The image below shows a grasp-object debug run: the Stage timeline advances, Inspector shows the SubTask details, and the bottom shows evidence images for the current Stage.

![Robot Skill debug execution process](../../../static/images/user/getting-started/wf-execution-inspector.png)

## Locate the problem layer

After starting a debug run, locate issues by execution layer:

1. **Connection and resources**: Robot, Pilot, AbilityFramework, and required Abilities are online.
2. **Input and version**: Skill version, input model, and business parameters are correct.
3. **Stage progression**: current Stage is expected and not waiting for Action, Feedback, or Observation.
4. **Ability execution**: Action routes to the correct Ability instance and returns expected results.
5. **Physical state**: Viewer, sensors, and actual contact match the Execution judgment.
6. **Safe exit**: use safe stop for abnormal physical action and confirm the Robot returns to hold or idle.

![Skill debug Execution logs](../../../static/images/user/getting-started/execution-logs.png)

Robot Skill input carries business goals and constraints. Precise motion, contact judgment, and live state are handled by Skill, Ability, and Robot SDK during execution.

## Do not confuse the two Skill layers

| Item | Agent Skill | Robot Skill |
|---|---|---|
| Used by | Leader, Robot Agent, and other model roles | Robot Skill Worker in Pilot |
| Main role | Planning methods, tool guidance, and domain knowledge | Recoverable Stages and Actions |
| Controls Robot | No | Indirectly, through Pilot and Ability |
| Uses map | Can guide Agent queries | Does not treat map as physical truth; re-observes during execution |
| Debug entry | Conversation, Trace, Project resources | Robot Execution, Stage, logs, Viewer |

If the plan is wrong, inspect Agent Skill and Conversation first. If the physical action is wrong, inspect Robot Skill Execution and Ability first.
