---
title: "计划与 Workflow"
weight: 10
---

Plan Proposal 将自然语言目标整理为可审阅的主要 Task 和依赖。用户批准后，系统创建 Workflow 并开始分配 Agent 与 Robot。

点击对话中的"查看计划"会打开 Plan 详情页，显示批准范围（Robot、允许技能、搬运对象、目标区域）、完成条件、主要流程和 TODO。下图同时展示了 Plan 详情和批准后的真实执行过程。

![Plan 详情与执行过程](../../../static/images/user/getting-started/plan-detail.png)

计划卡是把自然语言目标变成可执行边界的入口。批准前，它是可修改方案；批准后，它会按精确 revision 创建 Workflow。

## 生成 Plan Proposal

Leader 根据 Conversation、Project 资源和工具查询结果生成计划。计划卡包含：

- 目标和摘要；
- 主要 Task；
- Task 依赖；
- 所需角色、Robot 能力和资源范围；
- 约束与完成条件；
- Proposal revision。

继续讨论时，Leader 可以提交新的 revision。卡片会更新为最新内容，旧 revision 保留在历史中。

审阅时重点检查：

- 来源和目标区域是否正确；
- 允许使用的 Robot 是否正确；
- 允许使用的 Robot Skill 是否过宽；
- 主要 Task 是否覆盖了全部目标；
- 完成条件是否能被观察或验证；
- 是否有不应触碰的对象、区域或下层箱体。

## 批准并执行

点击“批准并执行”会以卡片上的精确 revision 创建 Workflow。批准前可以继续讨论或放弃 Proposal。

Workflow 创建后：

1. 依赖已满足的 Task 进入可分配状态。
2. 系统选择兼容且可用的 Agent 和 Robot。
3. 负责 Task 的 Agent 规划 SubTask。
4. SubTask 根据实际结果依次推进。
5. 所有 Task 收敛后，Leader 汇总 Workflow 结果。

多个无依赖 Task 可以并行执行。单个 Task 内的 Robot SubTask 按执行结果逐项推进。

![Workflow 执行过程](../../../static/images/user/getting-started/wf-execution-inspector.png)

上图是一个真实的 Workflow 执行过程：Physics Viewer 中 Robot 正在抓取箱体，底部显示 Task 已分解为 4 个 SubTask（空载导航、抓取、携物导航、放置验证），当前 SubTask 2/4 运行中，Stage 时间轴显示"检查目标、规划路线、导航、确认到达"已完成，右侧 Inspector 显示当前 SubTask 的详细属性和 Workflow Revision。

## 观察 Task

Task 卡展示：

- 当前状态和依赖；
- 所需角色与能力；
- 实际 Agent 和 Robot；
- 等待或暂停原因；
- SubTask 完成进度。

点击 Task 后，Inspector 展示输入、完成条件、SubTask、最近 Agent Run、Robot Execution、结果和 Artifact。

![Execution 运行日志](../../../static/images/user/getting-started/execution-logs.png)

底部"过程"页适合确认当前运行是否完成、失败、等待用户或仍在推进。切换到"日志"页可以看到 Execution 每个 Stage 的动作（如 `robot.get_state`、`verify_tool_load`、`perception.locate_object`）及其输出，以及"已形成无滑移的双侧稳定承载"等关键状态判断。它与 Task 卡读取同一份执行状态，但更偏向时间线和调试。

## 暂停与恢复

暂停表示当前工作正在等待明确条件。界面会说明：

- 暂停原因；
- 当前处理者；
- 正在等待的输入或运行状态；
- 可执行操作。

典型情况包括用户 Interaction、Recovery 分析、Robot 状态确认、环境变化和人工暂停。每种情况由对应入口恢复：回答问题、等待 Agent 决策、恢复设备连接、重新确认环境或点击继续执行。

## 停止 Workflow

在 Studio 的 **Run & Debug → Workflows** 中可以查看当前和历史 Workflow。点击任意记录会按 Workflow ID 重新打开完整运行视图，因此刷新页面、关闭面板或重启 Server 后仍能继续查看和处理原 Workflow。

运行面板提供“停止 Workflow”。停止操作会：

1. 阻止新的 Task 和 SubTask 启动；
2. 取消相关 Agent Run；
3. 对活动 Robot Execution 请求安全停止；
4. 等待 Robot 返回停止和 hold 状态；
5. 收敛 Task 与 Workflow 状态。

`stopping` 状态显示“重试停止”。重复请求会继续对账同一个停止目标，不会创建新的 Workflow 或 Robot Execution。

Robot 离线、Runtime 消失或执行记录不完整时，Workflow 显示“执行状态未知”。系统会保留 Robot、Task 和原 Execution 引用，禁止自动重放。此时有两种操作：

1. Robot/Pilot 可以恢复时，先恢复连接，再点击“重试停止”，等待正常 hold 证据。
2. 无法恢复连接但现场已经检查时，点击“确认现场安全并终结”，核对弹窗列出的 Robot 和 Execution，填写原因后提交。

人工终结只适用于现场已经确认机器人停止并处于安全保持状态的情况。系统会保存确认人、时间、原因和原错误，然后统一停止 Workflow、Task、SubTask 与关联 Execution，并释放调度占用。正常运行中的 Workflow 不能使用该入口，Task 和 SubTask 也没有独立停止按钮。

`completed`、`failed` 和 `stopped` 等终态 Workflow 只读展示，不再显示停止操作；历史记录不会被删除。
