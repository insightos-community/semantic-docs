---
title: "最佳实践：从 Project 到规划"
weight: 30
description: "使用默认 R1 Pro 拆码垛场景，按截图完成从打开 Project 到生成 Plan Proposal 的完整流程。"
---

本文给第一次使用 Semantic Studio 的用户一条推荐路径。你不需要真实机器人，也不需要先理解 Agent、Workflow 或 Robot Skill 的底层实现；按顺序完成以下步骤，就能看到“前端页面 → Server → Agent → 仿真环境”的完整产品链路。

> 本文截图来自当前 Semantic Studio 界面。页面文案可能随版本微调，但操作顺序保持一致。

## 开始前确认

- Semantic Server 和 Semantic Web 已启动，浏览器可以打开 Studio。
- 已有管理员账号，并能登录 Studio。
- MuJoCo Runtime Profile 已安装且状态为 ready。
- 模型服务可用；推荐使用 DeepSeek。

如需先完成安装，阅读[安装与启动](install-and-start.md)。

## 操作顺序速览

1. 打开默认项目或新建 Project。
2. 在系统设置中选择并配置模型服务。
3. 浏览场景，选择默认 R1 Pro 拆码垛场景并添加到 Project。
4. 选择布局 001，启动此 Layout。
5. 在右侧打开对话功能，新建对话。
6. 选择规划模式，发送拆码垛目标。
7. 观察仿真场景和底部过程面板。
8. 自由探索设备、地图、传感器、日志和其他对话能力。

## 1. 打开默认项目或新建 Project

登录后进入 Project Hub。Project 是 Semantic 的工作边界：Conversation、Scene、Workflow、Robot 执行和 Artifact 都归属于某个 Project。

![Project Hub](../../../static/images/user/getting-started/01-project-hub.png)

推荐直接打开 **Default Project**。如果需要隔离实验，也可以点击“新建 Project”，并在创建时选择 MuJoCo 默认 Runtime Profile。

进入 Project 后，左侧是项目资源，中央是工作区，右侧是 Conversation 或 Inspector，底部可以展开过程和日志。

![Default Project Studio](../../../static/images/user/getting-started/03-default-project-studio.png)

## 2. 配置模型服务

打开“系统设置 → 模型服务”。选择你想使用的模型服务，推荐 DeepSeek。已连接的服务会显示“已连接”，下方会列出自动生成的模型端点。

![模型服务设置](../../../static/images/user/getting-started/02-model-settings.png)

模型服务保存后，Server 会热更新模型注册表。Planning Conversation 默认使用当前全局默认模型，也可以在 Project 或对话中按需要调整。

## 3. 添加 R1 Pro 拆码垛场景

在 Project 左侧点击“场景与 Layout”，然后点击“浏览场景”。选择默认的 **R1 Pro 拆码垛** 场景，保持发布版本和默认 Layout 为 `布局 001`，点击“添加到 Project”。

![添加 R1 Pro 拆码垛场景](../../../static/images/user/getting-started/04-add-r1pro-scene.png)

添加后，Project 只获得了这个场景的引用和默认运行方式；仿真实例还没有启动。

## 4. 选择布局 001 并启动

在“布局与初始状态”中选择 **布局 001**，确认运行环境为已就绪的 Native MuJoCo Runtime，点击“启动此 Layout”。

![选择布局 001](../../../static/images/user/getting-started/05-layout001-selected.png)

启动成功后，中央区域会显示 Physics Viewer，右侧 Inspector 会显示 Scene Instance 的 `state=running`、layout、generation 和仿真时间。项目 Robot 也会从离线变为在线。

![仿真场景运行中](../../../static/images/user/getting-started/06-simulation-running.png)

如果提示“Runtime 已由另一个 Project 使用”，说明当前 Runtime 是单实例资源。先到占用它的 Project 停止场景，或直接使用已经占用 Runtime 的 Project。

## 5. 打开对话功能并新建对话

在右侧工具区选择“对话”，点击“新建对话”。对话是用户向 Leader 描述目标的主要入口；场景、Robot 和执行状态会继续显示在中央和底部区域。

![新建规划对话](../../../static/images/user/getting-started/07-new-planning-conversation.png)

## 6. 使用规划模式发送目标

将对话模式切换为 **规划**。规划模式会让 Leader 先查询环境和资源，再生成 Plan Proposal；计划只有经过用户批准才会进入 Workflow 执行。

发送：

```text
把pallet-a区域顶层4个箱子放在对应的pallet-b区域的指定位置
```

![发送规划请求](../../../static/images/user/getting-started/08-planning-request-sent.png)

等待 Leader 完成查询和计划生成。页面会出现 Plan Proposal 卡片，包含搬运范围、Robot、Skill 范围、主要 Task 和完成条件。

![Plan Proposal 已生成](../../../static/images/user/getting-started/09-plan-proposal-ready.png)

到这里不要急于点击“批准并执行”。先检查计划中的来源、目标、Robot 和完成条件是否符合你的预期。

## 7. 观察仿真和底部过程面板

仿真运行时，中央 Physics Viewer 会持续刷新 pose 和本地渲染帧率。你可以暂停、重置、停止场景，也可以切换自由相机观察 pallet-a、pallet-b 和 Robot。

点击顶部布局控制中的“底部面板”，默认打开“过程”页。这里显示当前运行或最近结果、执行状态、运行记录和属性。

![底部过程面板](../../../static/images/user/getting-started/10-bottom-process-panel.png)

切换到“日志”页，可以按来源、级别和全文搜索查看模型调用、工具调用、Execution 事件和 Trace 记录。

![底部日志面板](../../../static/images/user/getting-started/11-bottom-logs-panel.png)

开发者排查问题时通常按这个顺序看：

1. 过程页确认当前运行是否完成、失败或等待用户。
2. 日志页展开模型、工具或 Execution 记录。
3. 对话中的 Trace 查看 Agent 推理和工具调用。
4. Inspector 查看选中的 Scene、Robot、Task 或 Artifact 属性。

## 8. 自由探索其他功能

完成上述流程后，可以继续探索：

- **设备中心**：查看 Pilot、Robot、Ability 健康状态和当前执行。
- **地图**：查看 Semantic Map 中的对象、区域和关系。
- **传感器**：查看 RGB、Depth、Contact 等传感数据。
- **运行历史**：回看 Agent Run、Workflow、Robot Execution 和 Artifact。
- **协作模式**：与 Agent 继续讨论方案，而不一定生成新的 Plan。

![设备中心](../../../static/images/user/getting-started/12-devices.png)

## 推荐的使用习惯

- 先在仿真中验证目标表达、Plan 和 Robot 状态，再考虑真实设备。
- 使用规划模式处理会产生实际动作的任务；普通问答可以使用协作模式。
- 批准 Plan 前检查 Robot、Skill 范围、对象区域和完成条件。
- 执行过程中同时看 Physics Viewer、底部过程和日志，不要只看最终消息。
- 当 Runtime、模型或设备异常时，先切换到底部“问题”和“日志”页定位，再检查系统设置。

下一步可以阅读[Project 与 Semantic Studio](../workspace/project-and-studio.md)，系统了解前端每个页面和面板的作用。
