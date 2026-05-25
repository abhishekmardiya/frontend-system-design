import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { createConnection } from "node:net";
import path from "node:path";
import { afterEach, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

/** Ports used by runnable examples in this repo (avoid clashes between tests). */
const EXAMPLE_PORTS = [3000, 3001, 4000, 30043];

/** Example folders with their own package.json (installed before smoke tests). */
const PACKAGE_DIRS = [
  "src/01-networking/01_rest-api",
  "src/01-networking/02_graphql",
  "src/01-networking/03_grpc",
  "src/02-communication/01_short-polling",
  "src/02-communication/02_long-polling",
  "src/02-communication/03_websocket",
  "src/02-communication/04_sse",
  "src/02-communication/05_webhook",
  "src/03-security/01_xss",
  "src/03-security/02_iframe-protection",
  "src/03-security/03_security-headers",
  "src/03-security/04_permissions-policy",
  "src/03-security/06_cors",
  "test",
];

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @param {number} port
 * @returns {number[]}
 */
function getListenerPids(port) {
  if (process.platform === "win32") {
    try {
      const out = execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          `$c = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue; if ($null -ne $c) { $c.OwningProcess | Sort-Object -Unique }`,
        ],
        { encoding: "utf8", windowsHide: true },
      );
      return out
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => Number.isFinite(n));
    } catch {
      return [];
    }
  }
  try {
    const out = execFileSync("lsof", ["-t", `-iTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
    });
    return out
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

/**
 * Stop any process listening on `port` so the next test can bind (handles EADDRINUSE / stray servers).
 *
 * @param {number} port
 * @returns {Promise<void>}
 */
async function freePort(port) {
  const signalPids = (signal) => {
    for (const pid of getListenerPids(port)) {
      if (pid === process.pid) {
        continue;
      }
      try {
        process.kill(pid, signal);
      } catch {
        // ESRCH or permission — ignore
      }
    }
  };
  if (getListenerPids(port).length === 0) {
    return;
  }
  signalPids("SIGTERM");
  await delay(60);
  signalPids("SIGKILL");
  await delay(60);
}

/**
 * @param {readonly number[]} ports
 * @returns {Promise<void>}
 */
function freePorts(ports) {
  return Promise.all(ports.map((port) => freePort(port)));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

/**
 * @param {string} host
 * @param {number} port
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
function waitForPort(host, port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      if (Date.now() > deadline) {
        reject(new Error(`Timeout waiting for ${host}:${port}`));
        return;
      }
      const socket = createConnection({ host, port }, () => {
        socket.end();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        setTimeout(attempt, 15);
      });
    };
    attempt();
  });
}

/**
 * @param {string} relativeDir path from repo root
 */
function installPackage(relativeDir) {
  execFileSync(npmCmd, ["install"], {
    cwd: path.join(root, relativeDir),
    stdio: "pipe",
  });
}

/**
 * @param {string} name
 * @param {string} relativeDir path from repo root (folder with package.json)
 * @returns {Promise<void>}
 */
function runNpmScript(name, relativeDir) {
  return new Promise((resolve, reject) => {
    const child = spawn(npmCmd, ["run", name], {
      cwd: path.join(root, relativeDir),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `npm run ${name} in ${relativeDir} exited with code ${code}\n--- stderr ---\n${err}\n--- stdout ---\n${out}`,
          ),
        );
      }
    });
  });
}

/**
 * @param {string} relativeExampleDir path from repo root (folder with package.json)
 * @param {string} relativeEntry path relative to example dir (e.g. `index.js`)
 * @returns {{ child: import('node:child_process').ChildProcess; log: { out: string; err: string } }}
 */
function spawnNode(relativeExampleDir, relativeEntry) {
  const cwd = path.join(root, relativeExampleDir);
  const entry = path.join(cwd, relativeEntry);
  const child = spawn(process.execPath, [entry], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const log = { out: "", err: "" };
  child.stdout.on("data", (chunk) => {
    log.out += chunk;
  });
  child.stderr.on("data", (chunk) => {
    log.err += chunk;
  });
  return { child, log };
}

/**
 * Run an entry once with `node` and resolve when it exits 0.
 *
 * @param {string} relativeExampleDir path from repo root
 * @param {string} relativeEntry path relative to example dir
 * @returns {Promise<void>}
 */
function runNodeOnce(relativeExampleDir, relativeEntry) {
  return new Promise((resolve, reject) => {
    const cwd = path.join(root, relativeExampleDir);
    const entry = path.join(cwd, relativeEntry);
    const child = spawn(process.execPath, [entry], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `node ${relativeEntry} in ${relativeExampleDir} exited with code ${code}\n--- stderr ---\n${err}\n--- stdout ---\n${out}`,
        ),
      );
    });
  });
}

/**
 * @param {import('node:child_process').ChildProcess} child
 * @returns {Promise<void>}
 */
async function killChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }
  child.kill("SIGTERM");
  const killTimer = setTimeout(() => {
    try {
      child.kill("SIGKILL");
    } catch {
      // ignore
    }
  }, 5000);
  try {
    await once(child, "close");
  } catch {
    // ignore
  }
  clearTimeout(killTimer);
}

describe("example packages", { concurrency: false }, () => {
  before(async () => {
    for (const dir of PACKAGE_DIRS) {
      installPackage(dir);
    }
    await freePorts(EXAMPLE_PORTS);
  });

  afterEach(async () => {
    await freePorts(EXAMPLE_PORTS);
  });

  test("lint + format", async () => {
    await Promise.all([
      runNpmScript("lint", "test"),
      runNpmScript("format", "test"),
    ]);
  });

  test("short-polling", async () => {
    const { child, log } = spawnNode(
      "src/02-communication/01_short-polling",
      "index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/getData");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("websocket", async () => {
    const { child, log } = spawnNode(
      "src/02-communication/03_websocket",
      "index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("sse", async () => {
    const { child, log } = spawnNode("src/02-communication/04_sse", "index.js");
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("webhook", async () => {
    const cwd = path.join(root, "src/02-communication/05_webhook");
    const entry = path.join(cwd, "index.js");
    const child = spawn(process.execPath, [entry], {
      cwd,
      env: { ...process.env, WEBHOOK_SECRET: "test-secret" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const log = { out: "", err: "" };
    child.stdout.on("data", (chunk) => {
      log.out += chunk;
    });
    child.stderr.on("data", (chunk) => {
      log.err += chunk;
    });
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/webhook", {
        body: JSON.stringify({ event: "ping" }),
        headers: {
          "Content-Type": "application/json",
          "x-hub-signature": "test-secret",
        },
        method: "POST",
      });
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("rest-api", async () => {
    const { child, log } = spawnNode(
      "src/01-networking/01_rest-api",
      "index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/todos");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("graphql server + fetch client", async () => {
    const { child, log } = spawnNode(
      "src/01-networking/02_graphql",
      "server/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 4000, 20_000);
      await runNodeOnce(
        "src/01-networking/02_graphql",
        "client/fetch/index.js",
      );
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("server-side-mitigation", async () => {
    const { child, log } = spawnNode(
      "src/03-security/01_xss",
      "server-side-mitigation/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/");
      assert.equal(res.ok, true);
      const csp = res.headers.get("content-security-policy");
      assert.ok(
        csp?.includes("script-src"),
        "expected Content-Security-Policy with script-src",
      );
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("iframe-protection server1", async () => {
    const { child, log } = spawnNode(
      "src/03-security/02_iframe-protection",
      "server1/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/example1");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("iframe-protection server2", async () => {
    const { child, log } = spawnNode(
      "src/03-security/02_iframe-protection",
      "server2/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3001, 15_000);
      const res = await fetch("http://127.0.0.1:3001/iframe-website1");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("security-headers", async () => {
    const { child, log } = spawnNode(
      "src/03-security/03_security-headers",
      "index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/list", {
        headers: { "X-Forwarded-Proto": "https" },
      });
      assert.equal(res.ok, true);
      assert.equal(res.headers.get("referrer-policy"), "no-referrer");
      assert.equal(res.headers.get("x-content-type-options"), "nosniff");
      const hsts = res.headers.get("strict-transport-security");
      assert.ok(
        hsts?.includes("max-age="),
        "expected Strict-Transport-Security with max-age",
      );
      assert.equal(res.headers.get("x-powered-by"), null);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("permissions-policy", async () => {
    const { child, log } = spawnNode(
      "src/03-security/04_permissions-policy",
      "index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/page");
      assert.equal(res.ok, true);
      const policy = res.headers.get("permissions-policy");
      assert.ok(
        policy?.includes("geolocation=()"),
        "expected Permissions-Policy to disable geolocation",
      );
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("cors", async () => {
    const { child, log } = spawnNode(
      "src/03-security/06_cors",
      "server/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/list", {
        headers: { Origin: "http://127.0.0.1:5500" },
      });
      assert.equal(res.ok, true);
      assert.equal(
        res.headers.get("access-control-allow-origin"),
        "http://127.0.0.1:5500",
      );
      const data = await res.json();
      assert.equal(Array.isArray(data), true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("grpc server + client", async () => {
    const server = spawnNode("src/01-networking/03_grpc", "server/index.js");
    try {
      await waitForPort("127.0.0.1", 30043, 15_000);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${server.log.err}\n--- stdout ---\n${server.log.out}`;
      await killChild(server.child);
      throw new Error(detail);
    }

    const client = spawnNode("src/01-networking/03_grpc", "client/index.js");
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/");
      assert.equal(res.ok, true);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- server stderr ---\n${server.log.err}\n--- client stderr ---\n${client.log.err}`;
      throw new Error(detail);
    } finally {
      await killChild(client.child);
      await killChild(server.child);
    }
  });
});
