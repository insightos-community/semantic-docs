---
title: "贡献指南"
weight: 30
---

贡献流程帮助跨仓修改保持清晰、可审查和可验证。本文说明所有贡献者都需要遵守的工作方式；流水线触发、版本校验和制品发布见 [CI 与发布流程](ci-and-release.md)。

## 开始修改

1. 阅读相关架构和开发者文档。
2. 确认修改涉及的仓库和接口。
3. 查看工作树中的已有修改。
4. 为功能或缺陷建立 Issue（平台由项目托管方定：GitHub 或 GitLab 模板等价），并记录目标和验收方式。

## 外部贡献者

外部贡献者从 `main`（或默认分支）fork 仓库，创建主题分支后提交 PR/MR：

- 文档仓库遵循根目录 [CONTRIBUTING.md](https://github.com/insightos-community/semantic-docs/blob/main/CONTRIBUTING.zh-CN.md)；
- 首次提交建议从 `docs` 类型的小改动开始，熟悉写作规则和构建验证；
- PR/MR 由维护者评审，评审意见直接落实到代码与文档。

## 分支模型（核心团队）

- 功能分支从 `develop` 创建，通过 Merge Request 合回 `develop`；
- 发布从 `develop` 打 SemVer tag 触发；
- 跨仓功能在各仓建立同主题分支同步推进，分别提交 MR。

## 代码组织

- 让模块职责与架构层次一致。
- 使用已有类型和扩展点。
- 保持状态机和恢复入口清晰。
- 关键中文注释解释设计原因、并发边界和物理安全边界。
- 普通字段赋值和直接分支由代码本身表达。

## 提交规范

提交标题使用约定类型和范围，格式为 `type(scope): 中文结果`：

```text
feat(robot-skill): 完成单侧外拉后的双侧接合
fix(workflow): 收口暂停恢复与幂等停止
docs(user): 重写仿真环境使用手册
```

常用 type：`feat`（新功能）、`fix`（缺陷修复）、`docs`（文档）、`refactor`（重构）、`test`（测试）、`chore`（构建与工具）。scope 取模块或仓库内域名。

提交正文使用中文说明：

- 修改动机；
- 设计边界；
- 关键实现；
- 测试结果。

一个提交聚焦一个可验证职责。跨仓功能在各仓分别提交，避免把构建制品、缓存、密钥和无关格式化带入提交。

## 变更记录

每个变更在对应仓库的 `changelog/vX.Y.Z/` 目录中新增记录文件，说明用户可见变化、接口变化与迁移要求。发布时汇总进根目录 `CHANGELOG.md`（汇总规则见 [CI 与发布流程](ci-and-release.md)）。

## Merge Request

Merge Request 关联 Issue，描述用户流程、影响模块、接口变化和验证结果。界面修改提供截图，Robot 行为修改提供 Execution 记录和实际运行结果。

评审意见直接落实到代码、测试和正式文档。长期有效的设计进入架构或开发者文档。

## 文档贡献

修改行为、接口或流程时同步更新文档站：

- 架构与概念变化 → `docs/architecture/`；
- 用户操作流程变化 → `docs/user/`；
- 扩展点、构建、测试或贡献流程变化 → `docs/developer/`；
- 提交前执行 `npm run docs:build` 确认无死链（详见 [构建、运行与测试](../build/build-run-and-test.md)）。
