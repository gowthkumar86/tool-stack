import { existsSync } from "fs";
import { resolve as pathResolve, dirname, extname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const loaderDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = pathResolve(loaderDir, "..");
const srcRoot = pathResolve(projectRoot, "src");
const extensions = [".ts", ".tsx", ".js", ".jsx"];
const helmetShim = pathResolve(loaderDir, "helmet-shim.mjs");

function resolveWithExtensions(basePath) {
  for (const ext of extensions) {
    const filePath = `${basePath}${ext}`;
    if (existsSync(filePath)) {
      return filePath;
    }
  }

  for (const ext of extensions) {
    const indexPath = pathResolve(basePath, `index${ext}`);
    if (existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "react-helmet-async") {
    const url = pathToFileURL(helmetShim).href;
    return nextResolve(url, context);
  }
  if (specifier.startsWith("@/")) {
    const relativePath = specifier.slice(2);
    const absoluteBase = pathResolve(srcRoot, relativePath);
    const resolvedFile = resolveWithExtensions(absoluteBase);

    if (resolvedFile) {
      const url = pathToFileURL(resolvedFile).href;
      return nextResolve(url, context);
    }
  }

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentUrl = context.parentURL ? fileURLToPath(context.parentURL) : projectRoot;
    const absoluteBase = pathResolve(dirname(parentUrl), specifier);

    if (!extname(absoluteBase)) {
      const resolvedFile = resolveWithExtensions(absoluteBase);
      if (resolvedFile) {
        const url = pathToFileURL(resolvedFile).href;
        return nextResolve(url, context);
      }
    }
  }

  return nextResolve(specifier, context);
}
