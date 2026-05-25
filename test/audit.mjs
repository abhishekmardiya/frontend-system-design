import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const installFirst = process.argv.includes("--install");

/**
 * @param {string} relativeDir
 * @returns {string[]}
 */
function collectPackageDirs(relativeDir) {
  const absDir = path.join(root, relativeDir);
  if (!fs.existsSync(absDir)) {
    return [];
  }

  /** @type {string[]} */
  const dirs = [];

  if (fs.existsSync(path.join(absDir, "package.json"))) {
    dirs.push(relativeDir);
  }

  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "node_modules") {
      continue;
    }
    dirs.push(...collectPackageDirs(path.join(relativeDir, entry.name)));
  }

  return dirs;
}

/**
 * @param {string} relativeDir
 */
function installPackage(relativeDir) {
  execFileSync(npmCmd, ["install"], {
    cwd: path.join(root, relativeDir),
    stdio: "pipe",
  });
}

/**
 * @param {string} relativeDir
 * @returns {{ metadata: { vulnerabilities: Record<string, number> } }}
 */
function auditPackage(relativeDir) {
  const cwd = path.join(root, relativeDir);

  try {
    const out = execFileSync(npmCmd, ["audit", "--json"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(out);
  } catch (err) {
    const error = /** @type {NodeJS.ErrnoException & { stdout?: string; stderr?: string }} */ (
      err
    );
    if (error.stdout) {
      return JSON.parse(error.stdout);
    }
    throw new Error(
      `npm audit failed in ${relativeDir}\n--- stderr ---\n${error.stderr ?? ""}`,
    );
  }
}

/**
 * @param {string} label
 * @param {number} width
 */
function padEnd(label, width) {
  return label.length >= width ? label : label.padEnd(width);
}

/**
 * @param {number} value
 * @param {number} width
 */
function padStart(value, width) {
  return String(value).padStart(width);
}

const packageDirs = [...collectPackageDirs("src"), ...collectPackageDirs("test")].sort();

if (packageDirs.length === 0) {
  console.error("No package.json folders found under src/ or test/.");
  process.exit(1);
}

/** @type {Record<string, Record<string, number>>} */
const results = {};
const totals = {
  critical: 0,
  high: 0,
  moderate: 0,
  low: 0,
  info: 0,
  total: 0,
};

console.log(`Checking ${packageDirs.length} package folders...\n`);

for (const relativeDir of packageDirs) {
  const absDir = path.join(root, relativeDir);
  const hasLockfile = fs.existsSync(path.join(absDir, "package-lock.json"));
  const hasModules = fs.existsSync(path.join(absDir, "node_modules"));

  if (installFirst || (!hasLockfile && !hasModules)) {
    if (!hasLockfile && !hasModules && !installFirst) {
      console.log(`${relativeDir}: installing (no lockfile yet)...`);
    }
    installPackage(relativeDir);
  }

  const report = auditPackage(relativeDir);
  const counts = report.metadata.vulnerabilities;
  results[relativeDir] = counts;

  for (const key of Object.keys(totals)) {
    totals[key] += counts[key] ?? 0;
  }
}

const folderWidth = Math.max(
  "folder".length,
  ...packageDirs.map((relativeDir) => relativeDir.length),
);
const header = `${padEnd("folder", folderWidth)}  critical  high  moderate  low  total`;

console.log(header);
console.log("-".repeat(header.length));

for (const relativeDir of packageDirs) {
  const counts = results[relativeDir];
  console.log(
    `${padEnd(relativeDir, folderWidth)}  ${padStart(counts.critical, 8)}  ${padStart(counts.high, 4)}  ${padStart(counts.moderate, 8)}  ${padStart(counts.low, 3)}  ${padStart(counts.total, 5)}`,
  );
}

console.log("-".repeat(header.length));
console.log(
  `${padEnd("TOTAL", folderWidth)}  ${padStart(totals.critical, 8)}  ${padStart(totals.high, 4)}  ${padStart(totals.moderate, 8)}  ${padStart(totals.low, 3)}  ${padStart(totals.total, 5)}`,
);

if (totals.total > 0) {
  console.error(`\nFound ${totals.total} vulnerabilities across ${packageDirs.length} folders.`);
  process.exit(1);
}

console.log(`\nNo vulnerabilities found in ${packageDirs.length} folders.`);
