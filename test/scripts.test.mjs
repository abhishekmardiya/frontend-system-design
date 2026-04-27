import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { createConnection } from "node:net";
import path from "node:path";
import { afterEach, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

/** Ports used by runnable examples in this repo (avoid clashes between tests). */
const EXAMPLE_PORTS = [3000, 3001, 4000, 30043];

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
 * @param {string} name
 * @returns {Promise<void>}
 */
function runNpmScript(name) {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, ["run", name], {
      cwd: root,
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
            `npm run ${name} exited with code ${code}\n--- stderr ---\n${err}\n--- stdout ---\n${out}`,
          ),
        );
      }
    });
  });
}

/**
 * @param {string} relativeEntry path from repo root (e.g. `src/.../index.js`)
 * @returns {{ child: import('node:child_process').ChildProcess; log: { out: string; err: string } }}
 */
function spawnNode(relativeEntry) {
  const entry = path.join(root, relativeEntry);
  const child = spawn(process.execPath, [entry], {
    cwd: root,
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
 * Run an entry once with `node` and resolve when it exits 0. Used where `npm run start:…`
 * uses nodemon (which stays alive) but the underlying script is one-shot.
 *
 * @param {string} relativeEntry path from repo root
 * @returns {Promise<void>}
 */
function runNodeOnce(relativeEntry) {
  return new Promise((resolve, reject) => {
    const entry = path.join(root, relativeEntry);
    const child = spawn(process.execPath, [entry], {
      cwd: root,
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
          `node ${relativeEntry} exited with code ${code}\n--- stderr ---\n${err}\n--- stdout ---\n${out}`,
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

describe("npm scripts", { concurrency: false }, () => {
  before(async () => {
    await freePorts(EXAMPLE_PORTS);
  });

  afterEach(async () => {
    await freePorts(EXAMPLE_PORTS);
  });

  test("lint + format", async () => {
    await Promise.all([runNpmScript("lint"), runNpmScript("format")]);
  });

  test("start:short-polling", async () => {
    const { child, log } = spawnNode(
      "src/02-communication/01_short-polling/index.js",
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

  test("start:websocket", async () => {
    const { child, log } = spawnNode(
      "src/02-communication/03_websocket/index.js",
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

  test("start:sse", async () => {
    const { child, log } = spawnNode("src/02-communication/04_sse/index.js");
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

  test("start:webhook", async () => {
    const entry = path.join(root, "src/02-communication/05_webhook/index.js");
    const child = spawn(process.execPath, [entry], {
      cwd: root,
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

  test("start:rest-api", async () => {
    const { child, log } = spawnNode("src/01-networking/01_rest-api/index.js");
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

  test("start:graphql + start:graphql-fetch", async () => {
    const { child, log } = spawnNode(
      "src/01-networking/02_graphql/server/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 4000, 20_000);
      await runNodeOnce("src/01-networking/02_graphql/client/fetch/index.js");
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("start:server-side-mitigation", async () => {
    const { child, log } = spawnNode(
      "src/03-security/01_xss/server-side-mitigation/index.js",
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

  test("start:iframe-protection-server1", async () => {
    const { child, log } = spawnNode(
      "src/03-security/02_iframe-protection/server1/index.js",
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

  test("start:iframe-protection-server2", async () => {
    const { child, log } = spawnNode(
      "src/03-security/02_iframe-protection/server2/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3001, 15_000);
      const res = await fetch("http://127.0.0.1:3001/iframe-website1");
      assert.equal(res.ok, true);
      // CSP frame-ancestors is commented in server2 so :3000 can iframe these pages for the demos;
      // see server2/index.js and chapter README.
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("start:security-headers", async () => {
    const { child, log } = spawnNode(
      "src/03-security/03_security-headers/index.js",
    );
    try {
      await waitForPort("127.0.0.1", 3000, 15_000);
      const res = await fetch("http://127.0.0.1:3000/list");
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

  test("start:permissions-policy", async () => {
    const { child, log } = spawnNode(
      "src/03-security/04_permissions-policy/index.js",
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

  test("start:grpc-server + start:grpc-client", async () => {
    const server = spawnNode("src/01-networking/03_grpc/server/index.js");
    try {
      await waitForPort("127.0.0.1", 30043, 15_000);
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${server.log.err}\n--- stdout ---\n${server.log.out}`;
      await killChild(server.child);
      throw new Error(detail);
    }

    const client = spawnNode("src/01-networking/03_grpc/client/index.js");
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
