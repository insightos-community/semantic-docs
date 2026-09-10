---
title: "运行维护"
weight: 10
---

运行维护关注 Server、Runtime、Pilot、Robot 和执行状态。全局设备中心与 Project 运行面板提供日常入口。

![设备中心](../../../static/images/user/getting-started/12-devices.png)

日常巡检先看设备中心：Pilot 是否在线、Robot 是否空闲、Ability 是否健康、当前是否有活动执行。它能快速区分“服务不可用”“设备离线”和“任务仍在占用”。

## 日常检查

建议依次检查：

1. Semantic Server HTTP 与 WebSocket 可用。
2. 数据库迁移完成，模型配置可用。
3. Runtime Installation 在线。
4. Pilot 心跳正常。
5. AbilityFramework 和所需 Ability ready。
6. Robot Skill 期望 / 实际状态一致。
7. Robot 空闲、未处于 hold 或错误状态。

Framework 开发环境可以使用：

```bash
make doctor
make logs
```

预编译产物实例使用：

```bash
semanticctl status
semanticctl doctor
semanticctl logs
```

![系统设置](../../../static/images/user/getting-started/focus-model-settings.png)

系统设置用于确认模型服务和仿真 Runtime。模型异常先看模型服务是否已连接；场景启动异常先看 Runtime Installation 是否 ready。

## 关键文件与目录位置

下表为开发安装（Framework 仓内 `make init` 生成）的默认位置。Server 通过 `-c` 或 `SEMANTIC_CONFIG` 指定其他安装根时，下表中的相对路径随安装根整体移动（源码：`semantic-framework/pkg/config/path.go`、`pkg/log/runtime_file.go`）。

| 内容 | 默认位置 | 说明 |
|---|---|---|
| Server 运行配置（安装副本） | `semantic-framework/.output/configs/semantic-server.yaml` | 由 `semantic init` 从内置模板生成；前端设置与热重载只修改本副本。仓库内 `configs/semantic-server.yaml` 是只读模板，不是运行状态（源码：`cmd/semantic/init.go`） |
| 二进制 | `.output/bin/`（`semantic-server`、`semantic-pilot`、`semantic`） | `make build` 产物（`Makefile`） |
| SQLite 元数据 | `<安装根>/data/semantic.db`，开发安装根为 `.output/` | 运行副本 `store.sqlite_path` 指向安装根下 `data/semantic.db`；运行时伴随 `semantic.db-wal`、`semantic.db-shm` |
| Artifact、Skill、工作区数据 | `.output/data/artifacts/`、`.output/data/robot-skills/`、`.output/data/workspaces/` | 与 SQLite 同在 `data/` 目录下 |
| Server 运行日志 | `<安装根>/logs/semantic-server.jsonl` | 结构化 JSONL；单文件 100 MB 轮转，保留 5 个、14 天（`pkg/log/runtime_file.go`） |
| Pilot 数据目录 | `.output/semantic-pilot` | `semantic-pilot --data-dir` 默认值，含 Pilot 侧 SQLite、Skill 和 Artifact（`cmd/semantic-pilot/main.go`） |
| 数据备份目录 | `<安装根>/backups/` | `semantic init --reset-data` 重建前把整个 `data/` 目录原子移动至此（`cmd/semantic/init.go`） |
| 安装器后台服务日志 | `$SEMANTIC/.tui-logs/server.log`、`web.log` | quick-start 安装器阶段 6/8 后台启动的 Server 与 Web |

修改运行副本配置时注意：`llm.*`、`log.level`、`agents.profiles_dir`、`skills.dir`、`mcp_servers` 属于热重载白名单，保存后自动生效；`server.*`、`store.*` 等其余配置只输出 WARN 日志，需重启 Server 生效（源码：`pkg/config/doc.go`）。

## 状态刷新与重连

Web 首次通过 REST 读取快照，随后通过 WebSocket 接收增量事件。连接恢复后，Web 会重新获取当前 Project、Workflow、Robot 和 Execution 状态。

Pilot 使用专用 credential 重连。Server 根据 Robot 的实时状态、活动 Task 和 Execution 恢复设备占用和执行视图。

![底部日志](../../../static/images/user/getting-started/focus-bottom-logs.png)

底部日志用于定位某一次 Agent Run、Workflow 或 Robot Execution 的详细过程；Server 日志文件用于定位服务级问题。排障时先确认问题属于哪一层，再选择对应日志。

## 更新 Robot 制品

SDK、Ability、Robot Skill 或类型包更新后，使用项目提供的正式构建入口生成新制品，再重启受管 Robot 实例。MuJoCo 产品开发环境提供：

```bash
make refresh-v050-mujoco-bundle
```

重启后，Pilot 上报实际 Ability 和 Robot Skill，Server 根据 desired 状态完成更新。

## 备份与升级

### 备份元数据

备份 SQLite 前先停止 Server，然后整体拷贝安装根下的 `data/` 目录（包含 `semantic.db` 及其 `-wal`/`-shm` 伴随文件）。Server 运行中数据库处于 WAL 模式，直接拷贝可能得到不一致的副本。Pilot 数据目录（默认 `.output/semantic-pilot`）按同样的"停机后整目录拷贝"方式处理。需要重建开发数据时，使用 `semantic init --reset-data`：旧数据会自动移入 `backups/`，不会直接丢弃。

### 升级版本与制品

制品（SDK、Ability、Robot Skill、类型包、Bundle）的日常更新见上文[更新 Robot 制品](#更新-robot-制品)。升级 Semantic 版本时：

1. 先阅读[发布记录](../../releases/_index.md)对应版本页，确认破坏性变化、配置迁移步骤和组件兼容矩阵；
2. 按[备份元数据](#备份元数据)完成备份；
3. 按发布记录中的升级顺序操作，升级后用[日常检查](#日常检查)确认服务健康。

## 首次登录常见问题

### 首次登录账号从哪来

Server 首次启动时自动创建种子用户 `admin`，初始密码取配置来源中的 `SEMANTIC_ADMIN_PASSWORD`；未设置时使用默认密码 `admin123` 并在启动日志输出 WARN（源码：`semantic-framework/internal/server/auth/service.go` 的 `SeedAdmin`，重复启动幂等）。种子用户创建后，改密码需要用 `semantic init --reset-data` 重建数据目录再重新登录。

### 登录后提示 token 过期

访问 token 是存储在 Server SQLite 中的 opaque token，有效期为 24 小时（源码：`internal/server/auth/service.go`）。过期后请求返回 `AUTH_TOKEN_EXPIRED`，重新登录即可；也可以在过期前用 `POST /api/v1/auth/refresh` 以旧 token 换发新 token，旧 token 立即作废（API 细节见 [HTTP API 参考](../../developer/reference/api/http.md)）。

### 模型密钥未配置有什么表现

未配置任何模型密钥时，Server 只提供内置 `mock` 模型端点，服务照常启动、不发起真实模型请求；Conversation 等功能可以走通，但 Agent 回复来自 mock 而非真实大模型（源码：`semantic-framework/configs/semantic-server.yaml` 模板注释）。需要真实模型时，在 Studio 系统设置中添加模型端点并配置密钥，或通过 `.env` 的 `SEMANTIC_LLM_API_KEY_<名称>` 提供；`llm.*` 配置段支持热重载，配置后无需重启。

## 保存诊断信息

诊断一次问题时记录：

- Project、Workflow、Task 和 Execution ID；
- Scene Instance 与 Robot ID；
- Server、Pilot、Ability 和 Runtime 日志时间段；
- Execution 的 Stage、Action、Feedback 和 Observation；
- 相关 Artifact；
- 用户执行的操作和实际物理表现。

日志中应隐藏模型 Token、Pilot credential 和其他密钥。
