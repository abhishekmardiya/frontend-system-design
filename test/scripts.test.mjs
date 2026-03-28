import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createConnection } from "node:net";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";

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
        setTimeout(attempt, 80);
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
  test("lint", async () => {
    await runNpmScript("lint");
  });

  test("format", async () => {
    await runNpmScript("format");
  });

  test("start:short-polling", async () => {
    await runNpmScript("start:short-polling");
  });

  test("start:rest-api — server listens and responds", async () => {
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
      await runNpmScript("start:graphql-fetch");
    } catch (err) {
      const detail = `${err instanceof Error ? err.message : err}\n--- stderr ---\n${log.err}\n--- stdout ---\n${log.out}`;
      throw new Error(detail);
    } finally {
      await killChild(child);
    }
  });

  test("start:grpc-server + start:grpc-client — HTTP responds", async () => {
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
