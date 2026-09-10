---
title: "Install and Start"
weight: 10
description: "Deploy Semantic from prebuilt artifacts or build a full development workspace from source."
---

Semantic has two installation paths:

- **Path A: prebuilt artifact deployment**. The target machine does not clone Git or run Go / xmake / npm builds. It initializes an independent instance from a release package, which suits quick evaluation and production deployment.
- **Path B: source workspace build**. Build Server, Web, Runtime, Robot Bundle, and Skills from quick-start and component source repositories, which suits development and debugging.

Both paths produce Semantic Server, Semantic Studio, Native MuJoCo Runtime, R1 Pro Bundle, and three Robot Skills. Most users should choose Path A.

## Path A: prebuilt artifact deployment

Prebuilt deployment is a separate entry point that does not require a source workspace on the target machine. The installer downloads and verifies the archive, checks system dependencies, initializes configuration, creates a random admin password, installs the Runtime, starts Server/Web, and publishes Robot Skills.

Introduction and install entry: [https://semantic.insightos.cn/](https://semantic.insightos.cn/)

### Supported platform

Current artifacts target:

- Linux x86_64;
- glibc 2.28 or newer;
- complete Server + Web + Native MuJoCo + R1 Pro Bundle.

Application binaries are static ELF files. The glibc requirement comes from the uv/Python/Wheel runtime stack; meeting it does not mean every distribution is product-validated. Full runtime stacks for ARM64, Alpine/musl, Windows, and macOS are not yet supported.

The package contains application binaries and Python Wheels, but no operating system and no standalone system Python. If Python 3.13 or 3.10.19 is missing, uv still needs network access to download it; system dependency installation also needs network access. This is not a fully offline OS installation medium.

### New install with LAN access

```bash
curl -fsSL https://semantic.insightos.cn/install.sh | bash -s -- --install-system-deps
```

Web listens on `0.0.0.0:3000` by default and accepts connections from both `127.0.0.1` and the machine's LAN IPv4 addresses. API, WebSocket, and Runtime stay localhost-bound and are proxied by the Web gateway.

Optional flags:

```bash
--lan
--web-host <LAN IP> --web-port 3001
--web-host 127.0.0.1
--yes
--no-start
```

The installer does not modify firewalls or cloud security groups. Only expose the Web port to a trusted LAN. Do not expose API, WebSocket, or Runtime directly. For public access use an HTTPS reverse proxy, access control, or an SSH tunnel; HTTP is not encrypted.

### Update the management tool and LAN configuration

Existing instances, including `.4` versions, do not need to redeploy the database or runtime packages. You can update only the management tool, listener configuration, and desktop entry:

```bash
curl -fsSL https://semantic.insightos.cn/install.sh | bash -s -- \
  --configure-existing --dir "$HOME/.local/share/semantic" --lan --desktop-shortcut
```

This mode still downloads and verifies the full archive but installs only:

- `bin/semantic-manager`;
- `semanticctl`;
- listener configuration;
- desktop shortcut.

It keeps the business version, original release package, database, password, and runtime environment, and saves the old `install.json` under `configs/`. Changing the listener restarts only Web; the running Server is not restarted. An existing instance keeps its previous network settings unless you explicitly pass `--lan`.

### What the installer shows

The installer shows real download byte progress, SHA-256 verification, extraction stages, a task list, and per-stage timing. Interactive terminals use a single-page task table with in-place refresh; failures keep the task state and log location.

The password is written only to `/dev/tty`, never to stdout, stderr pipes, or install logs. Without a controlling terminal the installer reports where the password file is stored. Redact the password before sharing terminal screenshots.

Desktop shortcuts:

- `--desktop-shortcut`: create;
- `--no-desktop-shortcut`: skip.

A shortcut opens the local Web without carrying credentials and does not start services. GNOME may require “Allow launching”.

### Installed directory layout

The default install directory is `$HOME/.local/share/semantic`:

```text
<install-dir>/
├── releases/<version>/   artifacts and rebuilt Python environment
├── current -> releases/<version>
├── bin/semanticctl       instance management entry
├── configs/              Server, Agent, Skill configs and secrets.json
├── data/                 SQLite database and business data
├── runtimes.d/           registered Native MuJoCo Runtime
├── runtime-packs/        unpacked production Runtime Pack
├── runtime-envs/         independent MuJoCo venv
├── content/              scene catalog
├── python/               uv-downloaded Python
├── run/                  PID, identity, and install lock
└── logs/                 install, Server, and Web logs
```

Initialization runs:

1. SHA-256 verification;
2. platform and system dependency checks;
3. extraction to the install directory;
4. Robot Python environment rebuild and import check;
5. `semantic init`;
6. random admin password creation;
7. production Runtime Pack install with isolated scene smoke;
8. Server/Web health checks;
9. login and publication of three Robot Skills.

After install, open:

```text
http://127.0.0.1:3000
http://<LAN IP>:3000
```

The initial username is `admin`. The random password is stored in:

```text
<install-dir>/configs/secrets.json
```

The file mode is `0600`. Re-running the same version keeps the password, configuration, and database.

### Daily start, status, and stop

The completion page prints environment variables and start/stop guidance. The installer does not edit shell startup files:

```bash
export SEMANTIC_HOME="$HOME/.local/share/semantic"
export PATH="$SEMANTIC_HOME/bin:$PATH"

semanticctl start
semanticctl status
semanticctl stop
semanticctl welcome
```

To persist, add the two `export` lines to `~/.bashrc` or `~/.zshrc`. No automatic startup is configured.

You can also use full paths:

```bash
"$HOME/.local/share/semantic/bin/semanticctl" status
"$HOME/.local/share/semantic/bin/semanticctl" start
"$HOME/.local/share/semantic/bin/semanticctl" doctor
"$HOME/.local/share/semantic/bin/semanticctl" logs
"$HOME/.local/share/semantic/bin/semanticctl" stop
```

Safely stop Scenes and Robots in Studio before stopping Server/Web. `semanticctl` verifies PID, process start time, and instance path to avoid PID-reuse mistakes.

### Install from a local release package

If you already have a release package:

```bash
bash artifacts/install.sh \
  --package artifacts/releases/<version>/linux-x86_64/semantic-<version>-linux-x86_64.tar.gz \
  --dir "$HOME/.local/share/semantic" \
  --yes
```

Keep the adjacent `.sha256` file, or pass `--sha256 <HASH>`.

Default ports:

| Service | Default port |
|---|---:|
| Server HTTP | 8080 |
| Server WebSocket | 8081 |
| Web | 3000 |
| MuJoCo Runtime | 8090 |

Use `--http-port`, `--ws-port`, `--web-port`, and `--runtime-port` to avoid existing services. The installer does not stop other processes to free ports.

### Serve from your own HTTPS endpoint

Place `install.sh`, `channels/`, and `releases/` on a trusted HTTPS static site with the same relative layout, then:

```bash
curl -fsSL https://YOUR-HOST/semantic/install.sh | \
  bash -s -- --base-url https://YOUR-HOST/semantic --yes
```

Pin a version with `--version <version>`, or set `SEMANTIC_DOWNLOAD_BASE` instead of `--base-url`. Local HTTP testing requires `--allow-http`; HTTP and HTTPS downgrade redirects are rejected by default.

SHA-256 protects against corruption but is not a signature. The HTTPS site and bootstrap script must be trusted in production. In high-trust environments, download and review the entry first, then pin artifacts with `--sha256` from an independent trusted channel.

### Uninstall

Safely stop Scenes and Robots in Studio first. A new `install.sh` can uninstall without downloading the release package:

```bash
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic" --dry-run
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic"
bash artifacts/install.sh --uninstall --dir "$HOME/.local/share/semantic" --purge --yes
curl -fsSL https://semantic.insightos.cn/install.sh | \
  bash -s -- --uninstall --dir "$HOME/.local/share/semantic" --yes
```

Default uninstall removes `releases/`, `python/`, `runtime-envs/`, `runtime-packs/`, `bin/`, and the `current` link. It keeps `configs/`, `data/`, `logs/`, `content/`, `runtimes.d/`, Robot instance data, and other non-program directories. Data-keeping mode is not a backup; back up important data separately.

`--purge` permanently removes data that the script cannot recover. Every uninstall, including failures and dry runs, writes a `semantic-uninstall-*.log` with mode `0600` in the system temp directory.

## Path B: source workspace build

Source build suits developers who need to modify Server, Web, Simulation, Robot Skill, Ability, or deployment logic. The quick-start repository coordinates component repositories and is not itself a Server.

Public source workspace entry:

```bash
git clone https://github.com/insightos-community/quick-start.git
cd quick-start
python3 semantic_installer.py --list
```

The baseline targets Linux x86_64 and is validated on Ubuntu 24.04. Downloading models is not deployment; you still need source build, Bundle activation, and Skill publication. Installing system dependencies may require sudo.

### Requirements

- Linux;
- Git and Git LFS;
- a curses-capable Python;
- Go 1.23+;
- Node.js 22;
- uv;
- xmake;
- Ubuntu/apt system dependencies.

Native MuJoCo and Robot Worker use separate Python 3.10 / 3.13 environments.

Scene assets come from Git LFS. Third-party Wheels prefer a verified local cache and fall back to the package index selected by `UV_DEFAULT_INDEX`. `RUNTIME_WHEEL_SOURCE` can be `auto`, `lfs`, or `offline`. The specially handled TinyXML2 / urdfdom Wheels still use LFS.

### Run the source installer

```bash
python3 semantic_installer.py --list
python3 semantic_installer.py
```

Confirm the working directory and repository addresses first. Versions are pinned by `repo-versions.json`; the installer switches revisions from that manifest. Do not commit personal settings, credentials, or build output.

| Order | Work | Output |
|---|---|---|
| 1–2 | Configure tools, clone repositories, pull required LFS assets | Source workspace and assets |
| 3 | Build Server / Pilot and initialize configuration | `semantic-framework/.output/` |
| 4 | Prepare and register Native MuJoCo | Runtime registration and isolated environment |
| 5 | Build AbilityFramework, Python Wheels, assemble and activate Robot Bundle | Runtime seed, Bundle, and directories |
| 6 | Start Server / Web and publish Robot Skills | Studio and versioned Skill Registry |
| 7 | Configure model, Project, Scene, and Robot in Studio | Runnable task environment |

**Bundle activation and Skill publication are separate steps.** Building a Bundle does not install the Skills a Robot requests.

### Source workspace layout

| Directory | Responsibility |
|---|---|
| `semantic-framework/` | Server, Pilot, management CLI |
| `semantic-web/` · `semantic-docs/` | Studio frontend and documentation site |
| `semantic-robotsdk/robot-sdk/` | Robot contract and adapter layer |
| `semantic-ability/r1pro-ability/` | R1 Pro semantic abilities |
| `semantic-skill/robot-skill/` | Skill Worker SDK and task-level Skills |
| `semantic-simulation/mujoco-runtime/` · `semantic-scene/mujoco-asset/` | Physics simulation and governed assets |
| `semantic-robot-deployment/` | Bundle packaging and single-Robot process management |
| `semantic-ability/ability-runtime/` | Build inputs and offline dependency cache |
| `ability-framework/{abilityframework,ability-py-sdk,ability-scaffold}/` | Ability host, Python SDK, and scaffolding tools |

Repository names do not always match local directory names. Keep this layout for cross-repository builds.

### Versions and daily use

Releases and mirror synchronization use validated maintenance versions, not the leading edge of upstream or default branches. Use the tags and commits pinned in `repo-versions.json`.

```bash
python3 repo_versions.py --env github.env --show-config
python3 -m unittest discover -s tests
```

In the TUI:

- `e`: configure;
- `Enter`: run steps;
- `L`: view service logs;
- `x`: stop managed services.

Prebuilt instances use `semanticctl start|stop|status|doctor` for daily operations.

## Release maintainer notes

The following details are for maintainers who build prebuilt artifacts; regular users can skip this section.

The release directory contains:

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

The archive stores components by type:

```text
bin/                semantic-server / semantic / semantic-pilot / Web gateway / uv
web/                Vite production static files
robot-bundles/      AbilityFramework, Pilot, seven Ability ZIPs, Wheels, templates
robot-skills/       grasp-object / semantic-navigation / place-object release ZIPs
runtime-packs/      Native MuJoCo production Runtime Pack
assets/mujoco/      models, meshes, scenes, and asset directories
defaults/           clean Server configs
release.json        component versions and source commits
native-linkage.json static linkage checks
files.json          SHA256 for every artifact
installer.py        initialization logic
```

The package excludes `.env`, user databases, Project/Task/session data, Pilot credentials, run logs, `.git`, `node_modules`, existing `.venv`, and Python symlinks pointing to the build machine.

Build the release package after completing source build:

```bash
python -B artifacts/build_native.py
uv run --no-project --with PyYAML python artifacts/build_release.py \
  --version <version>
```

The builder checks real LFS files, Wheel ZIPs, exact versions of three Skills, and Bundle template consistency. Existing version directories are not overwritten; rebuild with a new version.

The English installer entry is `artifacts/install-en.sh`:

```bash
curl -fsSL https://semantic.insightos.cn/install-en.sh | bash -s -- --install-system-deps
```

## Verify the installation

After install, check in order:

1. `semanticctl status` shows Server/Web healthy.
2. The browser opens the Studio login page.
3. `admin` can log in with the password in `configs/secrets.json`.
4. System settings show model services and Runtime.
5. The device center shows Robot and Pilot.
6. The R1 Pro depalletizing Scene in the best practice can be added and started.

Maintainers validating a release package should also run:

```bash
python -B -m unittest discover -s tests -q
go test artifacts/gateway/main.go artifacts/gateway/main_test.go
bash -n artifacts/install.sh
python -B artifacts/smoke_release.py \
  --package artifacts/releases/<version>/linux-x86_64/semantic-<version>-linux-x86_64.tar.gz \
  --port-base 28180
```

“Installation complete” is not a substitute for product verification of real Robot readiness, physical grasping, and task execution.

## Common issues

**Wheel invalid or not a binary**

Re-run the Wheel build and copy steps in the source build. Git LFS pointers are not Wheels.

**Are the sudo password and Web admin password the same?**

No. sudo uses the Linux user login password; the Web admin password is stored in the Semantic instance configuration. If TUI sudo input is problematic, press `e` and set `SUDO_AUTH=terminal`, then rerun.

**Robot offline or missing Skill**

Check Runtime registration, the activated Bundle, and the exact published Skill versions. Bundle activation is not Skill publication.

**A step fails**

The installer stops the queue. Check `.tui-logs/` or the first explicit error under the instance `logs/` before rerunning.

**How do I configure a model key?**

After install the default is the mock model. Configure real model services and tokens in Studio system settings. Keep passwords and model keys local; do not expose development services to untrusted networks.

## Next step

After install and login, continue with the [Best Practice: From Project to Plan](best-practice.en.md) for a screenshot-based end-to-end flow, or read [Project and Semantic Studio](../workspace/project-and-studio.en.md) to learn the page structure.
