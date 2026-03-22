import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";

process.env.TS_NODE_PROJECT = "tsconfig.prerender.json";
process.env.TS_NODE_TRANSPILE_ONLY = "true";

register("ts-node/esm", pathToFileURL("./"));
register("./scripts/alias-loader.mjs", pathToFileURL("./"));

function logError(error, label) {
  const header = label ? `${label}:` : "Error:";
  // eslint-disable-next-line no-console
  console.error(header, inspect(error, { depth: 6 }));
  if (error?.stack) {
    // eslint-disable-next-line no-console
    console.error(error.stack);
  }
}

process.on("uncaughtException", (error) => {
  logError(error, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logError(error, "Unhandled rejection");
  process.exit(1);
});

try {
  await import("./prerender.ts");
} catch (error) {
  logError(error, "Failed to load prerender script");
  process.exit(1);
}
