---
title: "安装与启动"
weight: 10
description: "使用预编译产物快速部署 Semantic，或从源码构建完整开发工作区。"
---

Semantic 有两条安装路径：

- **路径 A：预编译产物部署**。目标机不克隆 Git、不运行 Go / xmake / npm 构建，直接从发布包初始化一套独立实例，适合快速体验和正式部署。
- **路径 B：源码构建工作区**。从 quick-start 和组件源码构建 Server、Web、Runtime、Robot Bundle 和 Skill，适合开发、调试和修改代码。

两条路径最终都会得到 Semantic Server、Semantic Studio、Native MuJoCo Runtime、R1 Pro Bundle 和三个 Robot Skill。普通用户优先选择路径 A。

## 路径 A：预编译产物部署

预编译产物部署是独立入口，不要求目标机存在源码工作区。安装器会下载并校验归档、检查系统依赖、初始化配置、创建随机管理员密码、安装 Runtime、启动 Server/Web，并发布 Robot Skill。

介绍与安装入口：[https://semantic.insightos.cn/](https://semantic.insightos.cn/)

### 支持平台

当前制品目标：

- Linux x86_64；
- glibc 2.28 或更高版本；
- 完整 Server + Web + Native MuJoCo + R1 Pro Bundle。

应用程序采用静态 ELF。glibc 门槛来自 uv、Python 和 Wheel 运行栈；满足门槛不等于所有发行版都已完成产品验收。ARM64、Alpine/musl、Windows 和 macOS 的完整运行栈当前不支持。

安装包包含应用二进制和 Python Wheel，不包含操作系统，也不包含独立的系统 Python。目标机缺少 Python 3.13 或 3.10.19 时，uv 仍需要联网下载；系统依赖安装也需要网络。因此这不是完全离线的 OS 安装介质。

### 新安装并开放局域网访问

```bash
curl -fsSL https://semantic.insightos.cn/install.sh | bash -s -- --install-system-deps
```

新安装的 Web 默认监听 `0.0.0.0:3000`，同时接受 `127.0.0.1` 和本机局域网 IPv4 地址访问。API、WebSocket 和 Runtime 仍保持本机监听，由 Web 网关统一代理。

可选参数：

```bash
# 明确开放局域网
--lan

# 指定 Web 监听地址和端口
--web-host <本机网卡IP> --web-port 3001

# 只允许本机访问
--web-host 127.0.0.1

# 非交互确认
--yes

# 只初始化，不启动 Server/Web
--no-start
```

安装器不会修改防火墙或云安全组。只应向可信局域网开放 Web 端口；不要直接公开 API、WebSocket 或 Runtime。公网访问应使用 HTTPS 反向代理、访问控制或 SSH 隧道，HTTP 本身不加密。

### 更新已有实例的管理工具和局域网配置

已经安装的实例，包括 `.4` 版本，不需要重新部署数据库和运行包。可以只更新管理工具、监听配置和桌面入口：

```bash
curl -fsSL https://semantic.insightos.cn/install.sh | bash -s -- \
  --configure-existing --dir "$HOME/.local/share/semantic" --lan --desktop-shortcut
```

这个模式仍会下载并校验新版本完整归档，但只安装：

- `bin/semantic-manager`；
- `semanticctl`；
- 监听配置；
- 桌面快捷入口。

它会保留业务版本、原始发布包、数据库、密码和运行环境，并把旧 `install.json` 保存到 `configs/`。需要变更监听时只重启 Web，不重启正在运行的 Server。已有实例不传网络参数时会保留原监听配置；切换到“本机 + 局域网”需要显式传 `--lan`。

### 安装过程会看到什么

安装器会显示真实下载字节进度、SHA-256 校验、解包阶段、任务清单和各阶段耗时。交互终端使用单页任务表原位刷新；失败后保留任务状态和日志位置。

密码只向 `/dev/tty` 输出，不写入 stdout、stderr 管道或安装日志。没有控制终端时，安装器会提示密码文件位置。分享终端截图前应先遮挡密码。

桌面环境下可以创建快捷入口：

- `--desktop-shortcut`：显式创建；
- `--no-desktop-shortcut`：跳过。

快捷方式只打开本机 Web，不携带账号密码，也不会自动启动服务。GNOME 等环境可能需要右键“允许启动”。

### 安装后的目录结构

默认安装目录是 `$HOME/.local/share/semantic`：

```text
<install-dir>/
├── releases/<version>/   当前版本产物和重建的 Python 环境
├── current -> releases/<version>
├── bin/semanticctl       本实例管理入口
├── configs/              Server、Agent、Skill 配置和 secrets.json
├── data/                 SQLite 数据库和业务数据
├── runtimes.d/           已登记的 Native MuJoCo Runtime
├── runtime-packs/        解包后的正式 Runtime Pack
├── runtime-envs/         目标机独立 MuJoCo venv
├── content/              场景目录
├── python/               uv 按需下载的 Python
├── run/                  PID、身份和安装锁
└── logs/                 安装、Server 和 Web 日志
```

初始化流程依次执行：

1. SHA-256 校验；
2. 平台和系统依赖检查；
3. 提取到安装目录；
4. 重建 Robot Python 环境并执行导入检查；
5. `semantic init`；
6. 创建随机管理员密码；
7. 安装正式 Runtime Pack 并执行隔离场景 smoke；
8. 检查 Server/Web 健康状态；
9. 登录并发布三个 Robot Skill。

安装完成后，访问：

```text
http://127.0.0.1:3000
http://<局域网IP>:3000
```

初始用户名是 `admin`。随机密码保存在：

```text
<install-dir>/configs/secrets.json
```

该文件权限为 `0600`。同版本重跑会保留密码、配置和数据库。

### 日常启动、状态和停止

安装完成页会给出环境变量和启停指引。安装器不会擅自修改 shell 启动文件：

```bash
export SEMANTIC_HOME="$HOME/.local/share/semantic"
export PATH="$SEMANTIC_HOME/bin:$PATH"

semanticctl start
semanticctl status
semanticctl stop
semanticctl welcome
```

如需持久生效，可以把前两行加入 `~/.bashrc` 或 `~/.zshrc`。当前不会配置开机自启动。

也可以直接使用完整路径：

```bash
"$HOME/.local/share/semantic/bin/semanticctl" status
"$HOME/.local/share/semantic/bin/semanticctl" start
"$HOME/.local/share/semantic/bin/semanticctl" doctor
"$HOME/.local/share/semantic/bin/semanticctl" logs
"$HOME/.local/share/semantic/bin/semanticctl" stop
```

停止 Server/Web 前，应先在 Studio 中安全停止场景和 Robot。`semanticctl` 使用 PID、进程启动时间和实例路径校验进程身份，避免因 PID 重用误操作其他进程。

### 使用本地发布包安装

如果已经有发布包，可以不通过 HTTPS 入口，直接本地安装：

```bash
bash artifacts/install.sh \
  --package artifacts/releases/<version>/linux-x86_64/semantic-<version>-linux-x86_64.tar.gz \
  --dir "$HOME/.local/share/semantic" \
  --yes
```

归档旁边的 `.sha256` 文件必须保留，也可以显式传：

```bash
--sha256 <HASH>
```

默认端口依次是：

| 服务 | 默认端口 |
|---|---:|
| Server HTTP | 8080 |
| Server WebSocket | 8081 |
| Web | 3000 |
| MuJoCo Runtime | 8090 |

可以使用 `--http-port`、`--ws-port`、`--web-port`、`--runtime-port` 避开已有服务。安装器不会自动停止其他进程来腾出端口。

### 使用自己的 HTTPS 分发地址

把 `install.sh`、`channels/` 和 `releases/` 按相同相对结构放到可信 HTTPS 静态站点后，可以执行：

```bash
curl -fsSL https://YOUR-HOST/semantic/install.sh | \
  bash -s -- --base-url https://YOUR-HOST/semantic --yes
```

固定版本时添加：

```bash
--version <version>
```

也可以提前设置 `SEMANTIC_DOWNLOAD_BASE`，省略 `--base-url`。本地 HTTP 测试需要显式传 `--allow-http`；默认会拒绝 HTTP 和 HTTPS 降级重定向。

SHA-256 能防止文件损坏，但不能替代签名。生产环境应确保 HTTPS 站点和引导脚本可信；高信任环境可以先下载并审阅入口，再使用独立可信渠道提供的 `--sha256` 固定制品。

### 卸载

卸载前先在 Studio 中安全停止场景和 Robot。新版 `install.sh` 不需要重新下载发布包即可卸载：

```bash
# 只显示计划，不停止或删除
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic" --dry-run

# 保留用户配置、数据库和日志
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic"

# 永久删除整个实例，包括用户数据
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic" --purge --yes

# 使用在线入口卸载
curl -fsSL https://semantic.insightos.cn/install.sh | \
  bash -s -- --uninstall --dir "$HOME/.local/share/semantic" --yes
```

默认卸载会删除 `releases/`、`python/`、`runtime-envs/`、`runtime-packs/`、`bin/` 和 `current` 链接，保留 `configs/`、`data/`、`logs/`、`content/`、`runtimes.d/`、Robot 实例数据和其他非程序目录。保留数据模式不是备份；重要数据应另行备份。

`--purge` 会永久删除不可由脚本恢复的数据。每次卸载，包括失败和 dry-run，都会在系统临时目录生成权限为 `0600` 的 `semantic-uninstall-*.log`。

## 路径 B：源码构建工作区

源码构建适合需要修改 Server、Web、Simulation、Robot Skill、Ability 或部署逻辑的开发者。quick-start 仓库协调多个组件仓库，本身不是 Server。

公开源码工作区入口：

```bash
git clone https://github.com/insightos-community/quick-start.git
cd quick-start
python3 semantic_installer.py --list
```

部署基线面向 Linux x86_64，并已在 Ubuntu 24.04 验证。下载模型后仍需要完成源码构建、Bundle 激活和 Skill 发布，并不是下载模型即完成部署。安装系统依赖可能需要 sudo。

安装器按工作区版本清单中的远端与 revision 准备其余仓库；在 TUI 中按 `e` 可配置工作根目录 `SEMANTIC`、管理员密码、服务地址与镜像等。开始前检查所选清单是否适合当前托管组织。公开仓库使用标准 Git 认证；不要把个人凭据写入清单或提交到仓库。

### 源码构建要求

需要：

- Linux；
- Git 和 Git LFS；
- 支持 curses 的 Python；
- Go 1.23+；
- Node.js 22；
- uv；
- xmake；
- Ubuntu/apt 系统依赖环境。

原生 MuJoCo 和 Robot Worker 使用独立的 Python 3.10 / 3.13 环境。

场景资产通过 Git LFS 拉取。第三方 Wheel 优先复用已校验的本地缓存，再通过 `UV_DEFAULT_INDEX` 指定的包源下载。`RUNTIME_WHEEL_SOURCE` 可设置为：

- `auto`：默认策略；
- `lfs`：跳过包源；
- `offline`：仅检查运行时缓存，场景资产仍走 LFS。

已修改的缓存文件会保留并报错。经过特殊处理的 TinyXML2 / urdfdom Wheel 仍使用 LFS。

### 运行源码安装器

```bash
python3 semantic_installer.py --list
python3 semantic_installer.py
```

开始前确认工作目录和仓库地址。版本由 `repo-versions.json` 固定，安装器会按清单切换 revision。个人设置、凭据和构建输出不要提交到版本库。

安装过程：

| 顺序 | 工作内容 | 产物 |
|---|---|---|
| 1–2 | 配置工具、克隆仓库、拉取所需 LFS 资产 | 源码工作区与资产 |
| 3 | 编译 Server / Pilot，初始化配置 | `semantic-framework/.output/` |
| 4 | 准备并登记 Native MuJoCo | Runtime 登记与独立环境 |
| 5 | 编译 AbilityFramework、Python Wheel，组装并激活 Robot Bundle | Runtime 种子、Bundle 与目录 |
| 6 | 启动 Server / Web，发布 Robot Skill | Studio 与版本化 Skill 注册表 |
| 7 | 在 Studio 配置模型、Project、场景和 Robot | 可执行任务环境 |

**Bundle 激活与 Skill 发布是两个独立步骤。** 仅编译 Bundle 不会安装 Robot 请求的 Skill。

### 源码工作区结构

| 目录 | 职责 |
|---|---|
| `semantic-framework/` | Server、Pilot、管理 CLI |
| `semantic-web/` · `semantic-docs/` | Studio 前端与文档站 |
| `semantic-robotsdk/robot-sdk/` | 机器人统一契约与适配层 |
| `semantic-ability/r1pro-ability/` | R1 Pro 语义能力 |
| `semantic-skill/robot-skill/` | Skill Worker SDK 与任务级 Skill |
| `semantic-simulation/mujoco-runtime/` · `semantic-scene/mujoco-asset/` | 物理仿真与独立治理的资产 |
| `semantic-robot-deployment/` | Bundle 打包与单 Robot 进程管理 |
| `semantic-ability/ability-runtime/` | 构建输入与离线依赖缓存 |
| `ability-framework/{abilityframework,ability-py-sdk,ability-scaffold}/` | Ability 宿主、Python SDK 与工程生成工具 |

各组件均有中英文 README。仓库名称不一定等于本地目录名；跨仓构建时应保留上述布局。

### 版本和日常使用

发布和镜像同步基于已验证的维护版本，不跟随上游或默认分支的领先版本。使用 `repo-versions.json` 固定的 Tag 和提交。

```bash
python3 repo_versions.py --env github.env --show-config
python3 -m unittest discover -s tests
```

`repo_versions.py` 用于源码版本清单，不是安装器参数。TUI 中：

- `e`：配置；
- `Enter`：执行步骤；
- `L`：查看服务日志；
- `x`：停止托管服务。

预编译安装实例日常使用 `semanticctl start|stop|status|doctor`。

## 发布包维护者补充

以下内容面向负责生成预编译产物的维护者，普通用户可以跳过。

发布包目录包含：

```text
artifacts/
├── install.sh
├── site/
├── build_release.py
├── build_native.py
├── smoke_release.py
├── smoke_uninstall.py
├── runtime/installer.py
├── runtime/uninstall.py
├── gateway/main.go
├── channels/stable.json
└── releases/<version>/linux-x86_64/
```

归档内部按组件存放：

```text
bin/                semantic-server / semantic / semantic-pilot / Web gateway / uv
web/                Vite production 静态文件
robot-bundles/      AbilityFramework、Pilot、七类 Ability ZIP、Wheel、部署模板
robot-skills/       grasp-object / semantic-navigation / place-object 发布 ZIP
runtime-packs/      Native MuJoCo 正式 Runtime Pack
assets/mujoco/      模型、网格、场景和资产目录
defaults/           干净 Server 配置
release.json        组件版本及来源提交
native-linkage.json 静态链接检查
files.json          每个产物的 SHA256
installer.py        初始化逻辑
```

发布包不会提取 `.env`、用户数据库、Project/Task/会话、Pilot 凭据、运行日志、`.git`、`node_modules`、现有 `.venv` 或指向构建机的 Python 符号链接。

构建发布包前先完成源码构建，然后执行：

```bash
python -B artifacts/build_native.py
uv run --no-project --with PyYAML python artifacts/build_release.py \
  --version <version>
```

构建器会检查真实 LFS 文件、Wheel ZIP、三个 Skill 的精确版本和 Bundle 模板一致性。相同版本目录拒绝覆盖；重建应使用新版本。

英文安装入口是 `artifacts/install-en.sh`：

```bash
curl -fsSL https://semantic.insightos.cn/install-en.sh | bash -s -- --install-system-deps
```

## 验证安装

安装完成后，按以下顺序检查：

1. `semanticctl status` 显示 Server/Web 正常；
2. 浏览器能打开 Studio 登录页；
3. `admin` 能使用 `configs/secrets.json` 中的密码登录；
4. 系统设置中可以查看模型服务和 Runtime；
5. 设备中心能看到 Robot 和 Pilot；
6. 最佳实践中的 R1 Pro 拆码垛场景可以添加并启动。

维护者验证发布包时，还应执行：

```bash
python -B -m unittest discover -s tests -q
go test artifacts/gateway/main.go artifacts/gateway/main_test.go
bash -n artifacts/install.sh
python -B artifacts/smoke_release.py \
  --package artifacts/releases/<version>/linux-x86_64/semantic-<version>-linux-x86_64.tar.gz \
  --port-base 28180
```

“安装完成”不能替代 Robot 真正就绪、物理抓取和任务执行的产品验收。

## 常见问题

**Wheel 无效或不是二进制产物**

重跑源码构建中的 Wheel 构建和复制步骤。Git LFS 指针文件不是 Wheel 本身。

**sudo 密码和 Web 管理员密码是同一个吗**

不是。sudo 使用 Linux 用户登录密码；Web 管理员密码保存在 Semantic 实例配置中。TUI 输入 sudo 有问题时，按 `e` 设置 `SUDO_AUTH=terminal` 后重跑。

**Robot 离线或缺 Skill**

检查 Runtime 登记、激活的 Bundle 和已发布 Skill 的精确版本。Bundle 激活不等于 Skill 已发布。

**步骤失败**

安装器会停止队列。重跑前查看 `.tui-logs/` 或安装目录下 `logs/` 的第一条明确错误。

**模型密钥如何配置**

安装完成后默认使用 mock 模型。真实模型服务和 Token 需要在 Studio 系统设置中配置，密码和模型 Key 只保存在本地，不要向不可信网络开放开发服务。

## 下一步

安装并登录成功后，继续阅读[最佳实践：从 Project 到规划](best-practice.md)，按截图完成第一条完整产品流程。若需要理解 Studio 页面结构，继续阅读[Project 与 Semantic Studio](../workspace/project-and-studio.md)。
