const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

export function formatHtml(source: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(source, "text/html");
  const lines: string[] = [];

  if (documentNode.doctype) {
    lines.push(serializeDoctype(documentNode.doctype));
  }

  lines.push(...serializeNode(documentNode.documentElement, 0));

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function serializeDoctype(doctype: DocumentType) {
  const publicId = doctype.publicId ? ` PUBLIC "${doctype.publicId}"` : "";
  const systemId = doctype.systemId ? ` "${doctype.systemId}"` : "";

  return `<!DOCTYPE ${doctype.name}${publicId}${systemId}>`;
}

function serializeNode(node: Node, depth: number): string[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? [`${indent(depth)}${text}`] : [];
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return [`${indent(depth)}<!--${node.textContent ?? ""}-->`];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();
  const attributes = Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${attribute.value}"`)
    .join("");
  const openingTag = `${indent(depth)}<${tagName}${attributes}>`;

  if (VOID_TAGS.has(tagName)) {
    return [openingTag];
  }

  const childNodes = Array.from(element.childNodes);
  const renderedChildren = childNodes.flatMap((child) => serializeNode(child, depth + 1));

  if (renderedChildren.length === 0) {
    return [`${openingTag}</${tagName}>`];
  }

  if (
    childNodes.length === 1 &&
    childNodes[0]?.nodeType === Node.TEXT_NODE &&
    childNodes[0].textContent?.trim()
  ) {
    return [
      `${indent(depth)}<${tagName}${attributes}>${childNodes[0].textContent.trim()}</${tagName}>`
    ];
  }

  return [openingTag, ...renderedChildren, `${indent(depth)}</${tagName}>`];
}

function indent(depth: number) {
  return "  ".repeat(depth);
}
