import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

let activeContext = null;

function ensureHelmetContext(context) {
  if (!context) return;

  if (!context.__helmetData) {
    context.__helmetData = {
      title: [],
      meta: [],
      link: [],
      script: [],
    };
  }

  if (!context.helmet) {
    context.helmet = {
      title: { toString: () => context.__helmetData.title.join("") },
      meta: { toString: () => context.__helmetData.meta.join("") },
      link: { toString: () => context.__helmetData.link.join("") },
      script: { toString: () => context.__helmetData.script.join("") },
    };
  }
}

export function HelmetProvider({ children, context }) {
  ensureHelmetContext(context);
  activeContext = context ?? null;

  const content = React.createElement(React.Fragment, null, children);
  activeContext = null;
  return content;
}

export function Helmet({ children }) {
  if (!activeContext || !children) return null;

  const elements = React.Children.toArray(children).filter(Boolean);
  const buckets = activeContext.__helmetData;

  elements.forEach((element) => {
    if (!React.isValidElement(element)) return;
    const type = element.type;
    if (type === "title") {
      buckets.title.push(renderToStaticMarkup(element));
      return;
    }
    if (type === "meta") {
      buckets.meta.push(renderToStaticMarkup(element));
      return;
    }
    if (type === "link") {
      buckets.link.push(renderToStaticMarkup(element));
      return;
    }
    if (type === "script") {
      buckets.script.push(renderToStaticMarkup(element));
    }
  });

  return null;
}
