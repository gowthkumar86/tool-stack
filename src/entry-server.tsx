import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import type { HelmetServerState } from "react-helmet-async";
import AppProvidersServer from "@/AppProvidersServer";
import ServerRoutes from "@/ServerRoutes";

interface RenderResult {
  html: string;
  head: string;
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <AppProvidersServer helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <ServerRoutes />
      </StaticRouter>
    </AppProvidersServer>
  );

  const helmet = helmetContext.helmet;
  const head = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
  ].join("");

  return { html, head };
}
