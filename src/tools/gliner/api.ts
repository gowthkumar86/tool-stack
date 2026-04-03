import type {
  ConfiguredExtractionResponse,
  CustomExtractionResponse,
  ExtractedEntity,
  GroupedEntities,
  UseCaseDefinition,
} from "./types";
import type { ExecutionProvider, Gliner as GlinerEngine, IEntityResult } from "gliner";

const GLINER_TOKENIZER_REPO =
  (import.meta.env.VITE_GLINER_TOKENIZER_REPO as string | undefined)?.trim()
  || "onnx-community/gliner_small-v2.1";
const GLINER_ONNX_MODEL_URL =
  (import.meta.env.VITE_GLINER_ONNX_MODEL_URL as string | undefined)?.trim()
  || "https://huggingface.co/onnx-community/gliner_small-v2.1/resolve/main/onnx/model_int8.onnx";
const ONNX_WASM_PATH =
  (import.meta.env.VITE_GLINER_ONNX_WASM_PATH as string | undefined)?.trim()
  || "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/";
const rawThreshold = Number.parseFloat((import.meta.env.VITE_GLINER_THRESHOLD as string | undefined) ?? "");
const EXTRACTION_THRESHOLD = Number.isFinite(rawThreshold) ? rawThreshold : 0.35;
const LONG_TEXT_WORD_THRESHOLD =
  Number.parseInt((import.meta.env.VITE_GLINER_LONG_TEXT_WORD_THRESHOLD as string | undefined) ?? "", 10) || 280;

type NormalizerRule = "lower" | "upper";

interface LocalUseCaseDefinition extends UseCaseDefinition {
  processing?: {
    value_normalizers?: Record<string, NormalizerRule>;
  };
}

const LOCAL_USE_CASES: LocalUseCaseDefinition[] = [
  {
    key: "resume",
    name: "Resume Parsing",
    description: "Extract common candidate details from resumes and CV text.",
    labels: [
      "name",
      "email",
      "phone",
      "location",
      "skills",
      "education",
      "experience",
      "organization",
      "designation",
    ],
    processing: {
      value_normalizers: {
        email: "lower",
      },
    },
  },
  {
    key: "invoice",
    name: "Invoice and GST Extraction",
    description: "Extract invoice fields including GST and total/tax details.",
    labels: [
      "invoice_number",
      "invoice_date",
      "due_date",
      "vendor_name",
      "buyer_name",
      "gst_number",
      "tax_amount",
      "total_amount",
      "currency",
    ],
  },
  {
    key: "seo",
    name: "SEO and Content Entities",
    description: "Extract entities useful for SEO/content analysis from text.",
    labels: [
      "keyword",
      "topic",
      "brand",
      "product",
      "organization",
      "person",
      "location",
      "url",
    ],
    processing: {
      value_normalizers: {
        url: "lower",
      },
    },
  },
  {
    key: "ecommerce",
    name: "Product and E-commerce Data",
    description: "Extract product attributes from catalogs, listings, and descriptions.",
    labels: [
      "product_name",
      "brand",
      "category",
      "price",
      "currency",
      "sku",
      "color",
      "size",
      "material",
      "availability",
    ],
  },
  {
    key: "developer",
    name: "Developer Logs and API Data",
    description: "Extract technical entities from logs, API docs, and diagnostic text.",
    labels: [
      "service_name",
      "api_endpoint",
      "http_method",
      "status_code",
      "error_code",
      "environment",
      "version",
      "timestamp",
    ],
    processing: {
      value_normalizers: {
        api_endpoint: "lower",
        http_method: "upper",
      },
    },
  },
];

let glinerModelPromise: Promise<GlinerEngine> | null = null;

async function supportsWebGpu(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return false;
  }

  const webGpuNavigator = navigator as Navigator & {
    gpu?: { requestAdapter: () => Promise<unknown> };
  };

  try {
    const adapter = await webGpuNavigator.gpu?.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}

function normalizeLabels(labels: string[]): string[] {
  return labels
    .map((label) => label.trim())
    .filter(Boolean);
}

function toPromptLabel(label: string): string {
  return label.replace(/[_-]+/g, " ").trim();
}

async function createModel(executionProvider: ExecutionProvider): Promise<GlinerEngine> {
  const { Gliner } = await import("gliner");

  const model = new Gliner({
    tokenizerPath: GLINER_TOKENIZER_REPO,
    onnxSettings: {
      modelPath: GLINER_ONNX_MODEL_URL,
      executionProvider,
      wasmPaths: ONNX_WASM_PATH,
      multiThread: executionProvider === "wasm",
    },
    transformersSettings: {
      allowLocalModels: false,
      useBrowserCache: true,
    },
    maxWidth: 12,
  });

  await model.initialize();
  return model;
}

async function getModel(): Promise<GlinerEngine> {
  if (!glinerModelPromise) {
    glinerModelPromise = (async () => {
      const useWebGpu = await supportsWebGpu();
      if (useWebGpu) {
        try {
          return await createModel("webgpu");
        } catch {
          return await createModel("wasm");
        }
      }
      return await createModel("wasm");
    })().catch((error) => {
      glinerModelPromise = null;
      throw error;
    });
  }

  return glinerModelPromise;
}

export async function preloadGlinerModel(): Promise<void> {
  await getModel();
}

function mapEntities(
  rawEntities: IEntityResult[],
  promptToOriginalLabel: Map<string, string>,
): ExtractedEntity[] {
  return rawEntities
    .map((item) => {
      const matchingLabel = promptToOriginalLabel.get(item.label.toLowerCase()) ?? item.label;
      return {
        text: item.spanText,
        label: matchingLabel,
        score: item.score,
        start: item.start,
        end: item.end,
      };
    })
    .sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
}

function buildGroupedEntities(labels: string[], entities: ExtractedEntity[]): GroupedEntities {
  const grouped = Object.fromEntries(labels.map((label) => [label, [] as string[]])) as Record<string, string[]>;

  for (const entity of entities) {
    if (!grouped[entity.label]) {
      grouped[entity.label] = [];
    }

    if (!grouped[entity.label].includes(entity.text)) {
      grouped[entity.label].push(entity.text);
    }
  }

  return grouped;
}

function applyNormalizer(value: string, normalizer: NormalizerRule): string {
  if (normalizer === "lower") {
    return value.toLowerCase();
  }
  return value.toUpperCase();
}

function applyProcessingRules(
  entities: ExtractedEntity[],
  processing: LocalUseCaseDefinition["processing"],
): ExtractedEntity[] {
  const normalizers = processing?.value_normalizers;
  if (!normalizers) {
    return entities;
  }

  return entities.map((entity) => {
    const rule = normalizers[entity.label];
    if (!rule) {
      return entity;
    }

    return {
      ...entity,
      text: applyNormalizer(entity.text, rule),
    };
  });
}

async function runClientSideExtraction(input: {
  text: string;
  labels: string[];
}): Promise<ExtractedEntity[]> {
  const labels = normalizeLabels(input.labels);
  if (!input.text.trim()) {
    return [];
  }

  if (labels.length === 0) {
    throw new Error("Provide at least one label for extraction.");
  }

  const promptLabels = labels.map((label) => {
    const promptLabel = toPromptLabel(label);
    return promptLabel || label;
  });

  const promptToOriginalLabel = new Map(
    promptLabels.map((promptLabel, index) => [promptLabel.toLowerCase(), labels[index]]),
  );

  const wordCount = input.text.trim().split(/\s+/).length;
  const useChunking = wordCount > LONG_TEXT_WORD_THRESHOLD;
  const model = await getModel();
  const inferenceResult = useChunking
    ? await model.inference_with_chunking({
      texts: [input.text],
      entities: promptLabels,
      flatNer: false,
      threshold: EXTRACTION_THRESHOLD,
    })
    : await model.inference({
      texts: [input.text],
      entities: promptLabels,
      flatNer: false,
      threshold: EXTRACTION_THRESHOLD,
    });

  const [result] = inferenceResult;
  return mapEntities(result ?? [], promptToOriginalLabel);
}

export async function extractWithCustomLabels(input: {
  text: string;
  labels: string[];
}): Promise<CustomExtractionResponse> {
  const entities = await runClientSideExtraction(input);
  return { entities };
}

export async function fetchUseCases(): Promise<UseCaseDefinition[]> {
  return LOCAL_USE_CASES;
}

export async function extractWithUseCase(input: {
  text: string;
  use_case: string;
}): Promise<ConfiguredExtractionResponse> {
  const useCase = LOCAL_USE_CASES.find((item) => item.key === input.use_case);
  if (!useCase) {
    throw new Error("Selected use case is not available.");
  }

  const rawEntities = await runClientSideExtraction({
    text: input.text,
    labels: useCase.labels,
  });

  const entities = applyProcessingRules(rawEntities, useCase.processing);
  const groupedEntities = buildGroupedEntities(useCase.labels, entities);

  return {
    use_case: useCase.key,
    entities,
    grouped_entities: groupedEntities,
  };
}
