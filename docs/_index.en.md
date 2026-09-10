---
title: "Semantic Documentation"
mermaid: true
hasmermaid: true
---

{{< blocks/cover title="Semantic Documentation" image_anchor="top" height="med" color="primary" >}}
<p class="lead mt-4">Architecture, user, and developer documentation for embodied applications</p>
<p>From Agent collaboration and task planning to Robot Skill, Ability, Robot SDK, simulation, and real-robot execution.</p>
<div class="mt-4">
  <a class="btn btn-lg btn-light me-3 mb-2" href="{{< relref "/architecture" >}}">Understand Semantic</a>
  <a class="btn btn-lg btn-secondary me-3 mb-2" href="{{< relref "/user" >}}">Get started</a>
  <a class="btn btn-lg btn-secondary mb-2" href="{{< relref "/developer" >}}">Build extensions</a>
</div>
{{< /blocks/cover >}}

{{% blocks/section color="white" %}}

## One complete embodied task

```mermaid
flowchart LR
    U[User] --> A[Agent collaboration]
    A --> W[Plan and Workflow]
    W --> R[Robot Skill]
    R --> B[Ability and Robot SDK]
    B --> E[Simulation or physical environment]
    E --> A
```

Semantic keeps user goals, environment understanding, multi-Agent collaboration, and physical robot actions in the same Project.

<div class="row mt-4">
  <div class="col-md-4">
    <h4>Architecture</h4>
    <p>Learn how Project, environments, Agents, Workflow, Robot execution, and extension points form the framework.</p>
    <a href="{{< relref "/architecture" >}}">Read architecture →</a>
  </div>
  <div class="col-md-4">
    <h4>User Guide</h4>
    <p>Use Semantic Studio to connect environments and Robots, plan through Conversation, and observe execution.</p>
    <a href="{{< relref "/user" >}}">Open User Guide →</a>
  </div>
  <div class="col-md-4">
    <h4>Developer Guide</h4>
    <p>Build Agent Skills, Robot Skills, Abilities, Robot SDKs, Scenes, Runtimes, and core framework extensions.</p>
    <a href="{{< relref "/developer" >}}">Open Developer Guide →</a>
  </div>
</div>

{{% /blocks/section %}}
