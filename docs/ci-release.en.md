# CI and releases

PRs and main pushes validate and package `semantic-docs` on GitHub-hosted Ubuntu 24.04. Version tag pushes publish a release. For existing tags, run **CI and Release** on **main** with the exact tag as input. Published releases are never overwritten and tags are never moved.

Release assets include component payloads, Python wheels where applicable, `release.json` with source/tag and build recipe SHA, and `SHA256SUMS`. Consumers must verify checksums and compare the source commit with quick-start's `repo-versions.json`. Python package versions follow tagged pyproject metadata. Build commands and payload selection are in `.github/scripts/`.

CI covers component tests or package integrity/smoke checks, not GPU, real hardware or full-stack acceptance. Data packages retain the tagged asset notices and third-party licenses. `ability-runtime` contains the pinned third-party wheel cache; first-party binaries and wheels come from their own releases.

Pushing a version tag publishes automatically; historical tags can be republished manually from main. The installer downloads and verifies artifacts according to the version manifest; the ability and skill repositories also provide installable ZIPs. Data repositories check LFS objects and archive integrity.
