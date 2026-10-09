# License scope

Copyright 2026 InsightOS.

InsightOS-owned source files carrying an Apache-2.0 header are licensed under the accompanying LICENSE. This maintenance change adds notices, aligns first-party license metadata and removes decorative comment separators only; it does not change business logic. Docstrings, meaningful comments and build/tool directives are preserved.

This is not a blanket relicensing of third-party code, dependencies, generated files, fonts, icons, model/scene assets, binary executables, Wheels, lockfiles or vendor trees. Existing upstream notices and licenses remain in force. Files with unclear provenance are not relabeled. Templates and formats without safe comment syntax are not injected with headers. Unmarked assets are not made Apache-2.0 by this notice; review their original distribution terms separately.

## Specifically preserved paths

- `_vendor/`
- `assets/js/offline-search.js`
- `assets/vendor/`
- `layouts/`

## Bundled third-party components

- `_vendor/github.com/google/docsy/` — [Docsy](https://github.com/google/docsy) v0.10.0, Apache-2.0, Copyright The Docsy Authors. Upstream LICENSE restored in-tree.
- `_vendor/github.com/google/docsy/dependencies/` — [Docsy dependencies](https://github.com/google/docsy-dependencies) v0.7.2, Apache-2.0.
- `_vendor/github.com/twbs/bootstrap/` — [Bootstrap](https://github.com/twbs/bootstrap) v5.3.3, MIT, Copyright (c) 2011-2024 The Bootstrap Authors. Upstream LICENSE restored in-tree.
- `assets/vendor/jquery/jquery.min.js` — [jQuery](https://jquery.com) v3.7.1, MIT, Copyright OpenJS Foundation and other contributors. Upstream license banner retained in-file.
- `assets/vendor/lunr/lunr.min.js` — [lunr.js](https://lunrjs.com) v2.3.9, MIT, Copyright (C) 2020 Oliver Nightingale. Upstream license banner retained in-file.
- `assets/vendor/mermaid/mermaid.min.js` — [mermaid](https://github.com/mermaid-js/mermaid) v11.17.2, MIT. `@license` legal comments retained in the bundle.
