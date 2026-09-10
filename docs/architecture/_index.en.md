---
title: "Semantic Architecture"
weight: 10
mermaid: true
cascade:
  type: docs
---

Semantic is a framework for building and operating embodied AI applications. It connects users, Agents, environments, and Robots through semantic state: Agents understand goals and the environment, organize work that can continue over time, and Robot Skills, Abilities, and Robot SDKs turn that work into physical actions.

An embodied task always happens in a real or simulated environment. Agents need to know which objects, regions, and Robots exist, choose the next goal, and receive new information after actions change the environment. Semantic therefore follows a continuous loop:

```text
Understand the goal and environment
→ Plan the task
→ Execute embodied actions
→ Receive Feedback and perform active Observation
→ Update environment and task state
→ Continue or adjust the task
```

The Chinese architecture section currently contains the detailed architecture pages. The English User Guide in this release already covers the user-facing architecture, main flows, and operating model.
