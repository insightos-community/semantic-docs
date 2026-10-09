# Contributing Guide

[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING.zh-CN.md)

Thank you for helping build the Semantic documentation. This document is for both external and internal contributors, and covers environment setup, writing rules, and the submission workflow.

## Before You Start

1. Open an Issue for the change you intend to make (a defect, a content gap, or a proposal for a new page), describing the audience, the goal, and how acceptance will be verified;
2. For large structural changes (moving/removing pages), align on the plan in an Issue first to avoid rework;
3. For content that concerns the behavior of other repositories, confirm the current state of the corresponding repository first — documentation takes the code as its source of truth.

## Local Development

```bash
npm ci          # automatically installs the pinned Hugo; Docsy is vendored
npm run docs:dev
```

Requires Node.js 22+. The build does not depend on external network access.

## Writing Rules

1. **Run it before you write it**: every command, path, port, and version number must have actually been executed successfully on your own machine within the current month before it may be submitted; keep the verified source-code locations in the text.
2. **Every command comes with its expected output**: paste the key excerpts of real output; content that could not be executed must be marked with `<!-- TODO(实跑): ... -->` and must not be stated as fact.
3. **A single source of truth for each fact**: the command matrix lives in `reference/build/`, protocols in `reference/api/`, and the extension decision table in `core-modules/`; tutorials and other pages reference these rather than duplicating them.
4. **UI operations must be substantiated**: with a screenshot or a precise description of the entry point (which page, which button).
5. **Chinese technical writing**: give the English term at a term's first occurrence; annotate code blocks with their language; do not narrate in the first-person "we".
6. Page moves must configure `aliases` so that old links keep working.

## Commits

- Each commit focuses on one verifiable responsibility, with a title in conventional format:

  ```text
  docs(user): 重写仿真环境使用手册
  fix(developer): 修正 cookbook 中 robot skill 测试路径
  ```

- The commit body explains: the motivation for the change, the key changes, and how it was verified.
- Run `npm run docs:build` before committing to ensure zero warnings and no broken links.

## Pull Request / Merge Request

- Link the Issue, and describe the audience, the scope of the change, and the verification results;
- Attach screenshots for UI-related changes; attach execution logs for content involving Robot behavior;
- Address review comments directly in the code and docs; write design conclusions with long-term validity into the architecture or developer documentation.

## Reporting Issues

- Documentation content errors: choose the docs-feedback Issue template, and attach the page URL and the expected wording;
- Security vulnerabilities: do not file them publicly — see [SECURITY.md](./SECURITY.md).
