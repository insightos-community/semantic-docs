// Copyright 2026 InsightOS
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// postinstall：把 pinned 版本的 Hugo extended 安装到 node_modules/.bin/hugo。
// 团队网络约定：优先 GITHUB_PROXY（CI 里为 https://ghfast.top/），直连 GitHub 兜底。
// 已安装且版本一致时跳过，保证 npm ci 幂等。
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const HUGO_VERSION = "0.128.2";

const PLATFORMS = {
  "linux-x64": { file: `hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz`, bin: "hugo" },
  "linux-arm64": { file: `hugo_extended_${HUGO_VERSION}_linux-arm64.tar.gz`, bin: "hugo" },
  // Hugo 0.128.2 的 macOS Extended 制品统一发布为 universal。
  "darwin-x64": { file: `hugo_extended_${HUGO_VERSION}_darwin-universal.tar.gz`, bin: "hugo" },
  "darwin-arm64": { file: `hugo_extended_${HUGO_VERSION}_darwin-universal.tar.gz`, bin: "hugo" },
};

const RELEASE_URL = `https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}`;

function main() {
  const root = path.join(__dirname, "..");
  const binDir = path.join(root, "node_modules", ".bin");
  const binPath = path.join(binDir, "hugo");
  const versionStamp = path.join(binDir, "hugo.version");

  // 幂等：版本一致则跳过
  if (fs.existsSync(binPath) && fs.existsSync(versionStamp) &&
      fs.readFileSync(versionStamp, "utf8").trim() === HUGO_VERSION) {
    console.log(`[install-hugo] hugo ${HUGO_VERSION} 已存在，跳过`);
    return;
  }

  const key = `${process.platform}-${os.arch()}`;
  const target = PLATFORMS[key];
  if (!target) {
    console.error(`[install-hugo] 不支持的平台 ${key}，请手动安装 Hugo ${HUGO_VERSION} extended`);
    process.exit(1);
  }

  // 代理地址不可用时必须继续尝试 GitHub 官方地址。此前先 filter(Boolean)
  // 会把用于直连的空前缀删掉，实际行为与文件头的“直连兜底”约定不一致。
  const prefixes = [process.env.GITHUB_PROXY || "https://ghfast.top/", ""];
  const proxies = [...new Set(prefixes)].map((prefix) => {
    if (!prefix) return RELEASE_URL + "/" + target.file;
    return prefix.replace(/\/?$/, "/") + RELEASE_URL + "/" + target.file;
  });

  fs.mkdirSync(binDir, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hugo-"));
  const archive = path.join(tmp, target.file);

  let ok = false;
  for (const url of proxies) {
    try {
      console.log(`[install-hugo] 下载 ${url}`);
      execFileSync("curl", ["-fsSL", "--retry", "2", "--max-time", "300", "-o", archive, url], { stdio: "inherit" });
      ok = fs.existsSync(archive) && fs.statSync(archive).size > 1024 * 1024;
      if (ok) break;
    } catch (e) {
      console.warn(`[install-hugo] 下载失败：${e.message}`);
    }
  }
  if (!ok) {
    console.error(`[install-hugo] 所有下载源均失败，请设置 GITHUB_PROXY 后重试 npm install`);
    process.exit(1);
  }

  execFileSync("tar", ["-xzf", archive, "-C", tmp, target.bin]);
  // 目标可能是残留的悬空符号链接（如失败安装的 hugo-extended），先删除再复制
  fs.rmSync(binPath, { force: true });
  fs.copyFileSync(path.join(tmp, target.bin), binPath);
  fs.chmodSync(binPath, 0o755);
  fs.writeFileSync(versionStamp, HUGO_VERSION + "\n");
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`[install-hugo] 已安装 hugo ${HUGO_VERSION} → ${binPath}`);
}

main();
