import type {
  ConfiguredExtractionResponse,
  CustomExtractionResponse,
  ExtractedEntity,
  GroupedEntities,
  UseCaseDefinition,
} from "./types";

const API_BASE_URL = (import.meta.env.VITE_GLINER_API_BASE_URL as string | undefined)?.replace(/\/$/, "")
  ?? "http://127.0.0.1:8000";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function readFirstString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function formatLabel(value: string): string {
  if (!value.trim()) {
    return "Unknown";
  }

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeUseCase(item: unknown, index: number, keyHint?: string): UseCaseDefinition | null {
  if (typeof item === "string") {
    const key = item.trim();
    if (!key) {
      return null;
    }

    return {
      key,
      name: formatLabel(key),
      description: "No description provided by API.",
      labels: [],
    };
  }

  if (!isRecord(item)) {
    return null;
  }

  const key =
    readFirstString(item, ["use_case", "useCase", "key", "id", "name", "title"])
    ?? keyHint
    ?? `use-case-${index + 1}`;

  const name =
    readFirstString(item, ["title", "name", "use_case", "useCase"])
    ?? formatLabel(key);

  const description =
    readFirstString(item, ["description", "desc", "summary"])
    ?? "No description provided by API.";

  const primaryLabels = toStringArray(item.labels);
  const labels = primaryLabels.length > 0
    ? primaryLabels
    : (() => {
      const secondaryLabels = toStringArray(item.entity_labels);
      if (secondaryLabels.length > 0) {
        return secondaryLabels;
      }
      return toStringArray(item.allowed_labels);
    })();

  return {
    key,
    name,
    description,
    labels,
  };
}

function normalizeEntity(item: unknown): ExtractedEntity | null {
  if (!isRecord(item)) {
    return null;
  }

  const text = readFirstString(item, ["text", "value", "entity"]);
  const label = readFirstString(item, ["label", "type", "entity_type", "category"]);
  if (!text || !label) {
    return null;
  }

  const score = typeof item.score === "number" ? item.score : undefined;
  const start = typeof item.start === "number" ? item.start : undefined;
  const end = typeof item.end === "number" ? item.end : undefined;

  return { text, label, score, start, end };
}

function normalizeEntities(value: unknown): ExtractedEntity[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeEntity(item))
    .filter((entity): entity is ExtractedEntity => entity !== null);
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  let parsedBody: unknown = null;
  try {
    parsedBody = await response.json();
  } catch {
    parsedBody = null;
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}.`;

    if (isRecord(parsedBody) && typeof parsedBody.detail === "string") {
      detail = parsedBody.detail;
    } else if (isRecord(parsedBody) && typeof parsedBody.message === "string") {
      detail = parsedBody.message;
    }

    throw new Error(detail);
  }

  return parsedBody as T;
}

function extractUseCaseItems(payload: unknown): Array<{ keyHint?: string; value: unknown }> {
  if (Array.isArray(payload)) {
    return payload.map((value) => ({ value }));
  }

  if (!isRecord(payload)) {
    return [];
  }

  const directList = payload.use_cases ?? payload.useCases ?? payload.items ?? payload.data;
  if (Array.isArray(directList)) {
    return directList.map((value) => ({ value }));
  }

  if (isRecord(directList)) {
    return Object.entries(directList).map(([key, value]) => ({ keyHint: key, value }));
  }

  return Object.entries(payload).map(([key, value]) => ({ keyHint: key, value }));
}

export async function fetchUseCases(): Promise<UseCaseDefinition[]> {
  const payload = await apiRequest<unknown>("/extract/gliner/use-cases", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const normalized = extractUseCaseItems(payload)
    .map((item, index) => normalizeUseCase(item.value, index, item.keyHint))
    .filter((item): item is UseCaseDefinition => item !== null);

  return normalized;
}

export async function extractWithCustomLabels(input: {
  text: string;
  labels: string[];
}): Promise<CustomExtractionResponse> {
  const payload = await apiRequest<unknown>("/extract/gliner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const entities = isRecord(payload) ? normalizeEntities(payload.entities) : [];
  return { entities };
}

export async function extractWithUseCase(input: {
  text: string;
  use_case: string;
}): Promise<ConfiguredExtractionResponse> {
  const payload = await apiRequest<unknown>("/extract/gliner/configured", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const entities = isRecord(payload) ? normalizeEntities(payload.entities) : [];
  const groupedEntities: GroupedEntities | undefined =
    isRecord(payload) && isRecord(payload.grouped_entities)
      ? payload.grouped_entities
      : undefined;
  const useCase = isRecord(payload) && typeof payload.use_case === "string"
    ? payload.use_case
    : undefined;

  return {
    use_case: useCase,
    entities,
    grouped_entities: groupedEntities,
  };
}
