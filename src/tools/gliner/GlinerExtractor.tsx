import { useEffect, useMemo, useState } from "react";
import ContentSection from "../../components/ContentSection";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/skeleton";
import { setSEO } from "../../utils/seo";
import {
  extractWithCustomLabels,
  extractWithUseCase,
  fetchUseCases,
  preloadGlinerModel,
} from "./api";
import ExtractButton from "./components/ExtractButton";
import LabelsInput from "./components/LabelsInput";
import ResultsDisplay from "./components/ResultsDisplay";
import TextInputArea from "./components/TextInputArea";
import UseCaseSelector from "./components/UseCaseSelector";
import type {
  ConfiguredExtractionResponse,
  CustomExtractionResponse,
  UseCaseDefinition,
} from "./types";

type Mode = "use-case" | "custom";
const MODEL_CONSENT_STORAGE_KEY = "gliner_model_download_consent_v1";

function parseLabels(input: string): string[] {
  return input
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

function tabClass(isActive: boolean): string {
  return [
    "rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
    isActive
      ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : "border border-slate-700 text-slate-300 hover:border-emerald-400/30 hover:text-emerald-200",
  ].join(" ");
}

function modeLabel(mode: Mode): string {
  if (mode === "use-case") {
    return "Use Case Mode";
  }
  return "Custom Mode";
}

function downloadJsonFile(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function GlinerExtractorPage() {
  const [mode, setMode] = useState<Mode>("use-case");
  const [useCases, setUseCases] = useState<UseCaseDefinition[]>([]);
  const [selectedUseCase, setSelectedUseCase] = useState("");
  const [useCaseInputText, setUseCaseInputText] = useState("");
  const [customInputText, setCustomInputText] = useState("");
  const [labelsInput, setLabelsInput] = useState("person, organization, role, date");
  const [isLoadingUseCases, setIsLoadingUseCases] = useState(true);
  const [isPreparingModel, setIsPreparingModel] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [hasModelConsent, setHasModelConsent] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(MODEL_CONSENT_STORAGE_KEY) === "true";
  });
  const [showModelConsentModal, setShowModelConsentModal] = useState(false);
  const [pendingExtractAfterModelLoad, setPendingExtractAfterModelLoad] = useState(false);
  const [modelLoadError, setModelLoadError] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [configuredResult, setConfiguredResult] = useState<ConfiguredExtractionResponse | null>(null);
  const [customResult, setCustomResult] = useState<CustomExtractionResponse | null>(null);

  const parsedLabels = useMemo(() => parseLabels(labelsInput), [labelsInput]);

  const activeUseCase = useMemo(
    () => useCases.find((useCase) => useCase.key === selectedUseCase) ?? null,
    [selectedUseCase, useCases],
  );

  const downloadableResult = useMemo(() => {
    if (mode === "use-case") {
      if (!configuredResult) {
        return null;
      }

      return {
        mode: "use-case",
        use_case: configuredResult.use_case,
        grouped_entities: configuredResult.grouped_entities ?? {},
        entities: configuredResult.entities,
        exported_at: new Date().toISOString(),
      };
    }

    if (!customResult) {
      return null;
    }

    return {
      mode: "custom",
      entities: customResult.entities,
      exported_at: new Date().toISOString(),
    };
  }, [configuredResult, customResult, mode]);

  const canExtract = useMemo(() => {
    if (isExtracting || isPreparingModel) {
      return false;
    }

    if (mode === "use-case") {
      return Boolean(useCaseInputText.trim()) && Boolean(selectedUseCase);
    }

    return Boolean(customInputText.trim()) && parsedLabels.length > 0;
  }, [customInputText, isExtracting, isPreparingModel, mode, modelLoadError, parsedLabels.length, selectedUseCase, useCaseInputText]);

  useEffect(() => {
    setSEO({
      title: "GLiNER Entity Extractor - Use Cases and Custom Labels",
      description:
        "Extract entities from text using predefined business use cases or custom labels with GLiNER.",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadUseCases() {
      setIsLoadingUseCases(true);
      setErrorMessage("");

      try {
        const data = await fetchUseCases();
        if (cancelled) {
          return;
        }

        setUseCases(data);
        if (data.length > 0) {
          setSelectedUseCase((previousValue) => previousValue || data[0].key);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "Could not load use cases.");
      } finally {
        if (!cancelled) {
          setIsLoadingUseCases(false);
        }
      }
    }

    void loadUseCases();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadModelInBrowserSession() {
    setIsPreparingModel(true);
    setModelLoadError("");

    try {
      await preloadGlinerModel();
      setIsModelReady(true);
      setShowModelConsentModal(false);
    } catch (error) {
      setModelLoadError(error instanceof Error ? error.message : "Could not load GLiNER model in browser.");
    } finally {
      setIsPreparingModel(false);
    }
  }

  async function runExtraction() {
    if (!canExtract || !isModelReady) {
      return;
    }

    setIsExtracting(true);
    setErrorMessage("");

    try {
      if (mode === "use-case") {
        const response = await extractWithUseCase({
          text: useCaseInputText.trim(),
          use_case: selectedUseCase,
        });
        setConfiguredResult(response);
      } else {
        const response = await extractWithCustomLabels({
          text: customInputText.trim(),
          labels: parsedLabels,
        });
        setCustomResult(response);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Extraction failed. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  useEffect(() => {
    if (!pendingExtractAfterModelLoad || !isModelReady || isPreparingModel) {
      return;
    }

    setPendingExtractAfterModelLoad(false);
    void runExtraction();
  }, [isModelReady, isPreparingModel, pendingExtractAfterModelLoad]);

  function handleExtract() {
    if (!canExtract) {
      return;
    }

    if (!isModelReady) {
      if (hasModelConsent) {
        setPendingExtractAfterModelLoad(true);
        void loadModelInBrowserSession();
        return;
      }

      setPendingExtractAfterModelLoad(true);
      setShowModelConsentModal(true);
      return;
    }

    void runExtraction();
  }

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-100">GLiNER Entity Extraction Tool</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
          Run extraction in two ways: choose a predefined use case for structured business output, or switch to custom labels for ad-hoc analysis.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          First extraction asks permission to download the GLiNER model once and persist it in browser storage.
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="GLiNER extractor layout">
        <Card hoverable className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold text-slate-100">Input</h2>
            <p className="mt-1 text-sm text-slate-300">
              Current mode: <span className="font-semibold text-emerald-200">{modeLabel(mode)}</span>
            </p>
          </header>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={tabClass(mode === "use-case")}
              onClick={() => {
                setMode("use-case");
                setErrorMessage("");
              }}
            >
              Use Case Mode
            </button>
            <button
              type="button"
              className={tabClass(mode === "custom")}
              onClick={() => {
                setMode("custom");
                setErrorMessage("");
              }}
            >
              Custom Mode
            </button>
          </div>

          {mode === "use-case" ? (
            <section className="space-y-4">
              {isLoadingUseCases ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  <UseCaseSelector
                    useCases={useCases}
                    selectedUseCase={selectedUseCase}
                    onSelectUseCase={setSelectedUseCase}
                    disabled={isExtracting}
                  />

                  {activeUseCase && (
                    <div className="space-y-3 rounded-md border border-slate-700 bg-slate-900 p-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100">Description</h3>
                        <p className="mt-1 text-sm text-slate-300">{activeUseCase.description}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-100">Labels Preview</h3>
                        {activeUseCase.labels.length === 0 ? (
                          <p className="mt-1 text-sm text-slate-400">No labels provided for this use case.</p>
                        ) : (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {activeUseCase.labels.map((label) => (
                              <span
                                key={label}
                                className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <TextInputArea
                id="gliner-usecase-text"
                label="Input Text"
                value={useCaseInputText}
                onChange={setUseCaseInputText}
                placeholder="Paste resume, invoice, email, or any business text for extraction."
              />
            </section>
          ) : (
            <section className="space-y-4">
              <TextInputArea
                id="gliner-custom-text"
                label="Input Text"
                value={customInputText}
                onChange={setCustomInputText}
                placeholder="Paste any text and extract entities using your own labels."
              />
              <LabelsInput value={labelsInput} onChange={setLabelsInput} />
              {parsedLabels.length === 0 && (
                <p className="text-sm text-yellow-300">
                  Add at least one label to run extraction in custom mode.
                </p>
              )}
            </section>
          )}

          <div className="flex items-center gap-3">
            <ExtractButton
              onClick={() => {
                handleExtract();
              }}
              disabled={!canExtract}
              loading={isExtracting}
            />
            {!canExtract && (
              <p className="text-xs text-slate-400">
                {isPreparingModel
                  ? "GLiNER model is loading in your browser."
                  : mode === "use-case"
                    ? "Enter input text and choose a use case to extract."
                    : "Enter input text and labels to extract."}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}
        </Card>

        <Card hoverable className="space-y-4">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Extraction Results</h2>
              <p className="mt-1 text-sm text-slate-300">
                {mode === "use-case"
                  ? "Grouped entities are shown first for business use, followed by raw entities for debugging."
                  : "Custom extraction entities are shown below."}
              </p>
            </div>
            <button
              type="button"
              disabled={!downloadableResult || isExtracting}
              onClick={() => {
                if (!downloadableResult) {
                  return;
                }
                const filePrefix = mode === "use-case" ? "gliner-use-case" : "gliner-custom";
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                downloadJsonFile(`${filePrefix}-${timestamp}.json`, downloadableResult);
              }}
              className="rounded border border-emerald-300/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800 disabled:text-slate-400"
            >
              Download JSON
            </button>
          </header>

          {isExtracting ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : mode === "use-case" ? (
            configuredResult ? (
              <ResultsDisplay
                mode="use-case"
                groupedEntities={configuredResult.grouped_entities}
                entities={configuredResult.entities}
              />
            ) : (
              <EmptyState
                title="No extraction yet"
                description="Choose a use case, add input text, and click Extract to view grouped entities."
              />
            )
          ) : customResult ? (
            <ResultsDisplay mode="custom" entities={customResult.entities} />
          ) : (
            <EmptyState
              title="No extraction yet"
              description="Provide text and labels in custom mode, then click Extract."
            />
          )}
        </Card>
      </section>

      <ContentSection title="Real-World Problem This Solves">
        <p>
          Teams often receive unstructured text such as resumes, invoices, support emails, and onboarding forms.
          Manually finding names, dates, amounts, and IDs inside that text takes time and creates inconsistencies.
        </p>
        <p>
          This tool converts that raw text into structured entities quickly, so product, ops, and support teams can
          review or automate the next step.
        </p>
      </ContentSection>

      <ContentSection title="Common Mistakes We See">
        <ul className="list-disc space-y-2 pl-5">
          <li>Using custom mode when a predefined use case already exists for the document type.</li>
          <li>Adding too many broad labels in custom mode, which creates noisy extraction output.</li>
          <li>Pasting partial text snippets instead of full context, which reduces extraction accuracy.</li>
          <li>Reviewing only grouped output and skipping raw entities during debugging.</li>
        </ul>
      </ContentSection>

      <ContentSection title="How This Tool Helps In Practice">
        <p>Use this quick workflow for reliable results:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Start with Use Case Mode and select the closest predefined scenario.</li>
          <li>Paste the full source text, then click Extract.</li>
          <li>Read grouped entities first for business summary.</li>
          <li>Validate raw entities below for exact spans, labels, and confidence.</li>
          <li>Switch to Custom Mode only when you need labels outside predefined templates.</li>
        </ol>
      </ContentSection>

      <ContentSection title="Example Scenario">
        <p>
          Suppose you receive a vendor invoice as plain text. Select an invoice use case, paste the full document, and
          run extraction.
        </p>
        <p>
          You can immediately read grouped fields such as vendor name, invoice number, due date, and total amount.
          Then verify raw entities before sending the structured output to your billing or ERP workflow.
        </p>
      </ContentSection>

      <ContentSection title="FAQs">
        <h3 className="text-base font-semibold text-gray-100">When should I use Use Case Mode vs Custom Mode?</h3>
        <p>Use case mode is best for standard document types. Custom mode is best for one-off extraction needs.</p>
        <h3 className="text-base font-semibold text-gray-100">Why are some expected entities missing?</h3>
        <p>
          Missing values usually happen when the input text is incomplete or labels are too generic. Paste full text
          and refine labels for better recall.
        </p>
        <h3 className="text-base font-semibold text-gray-100">Should I trust grouped output without checking raw entities?</h3>
        <p>
          For production workflows, always verify the raw entity list during QA. It helps catch label mismatches and
          context errors early.
        </p>
      </ContentSection>

      <ContentSection title="Browser Model Usage Guide">
        <ul className="list-disc space-y-2 pl-5">
          <li>The model is not downloaded when this page opens. Download starts only after you click Extract and approve.</li>
          <li>The download happens inside your browser session (client-side), not on your backend server.</li>
          <li>Once approved, this browser remembers your consent and will not ask again on every refresh.</li>
          <li>First-time load can take 1-3 minutes depending on network and device speed.</li>
          <li>The ONNX model file is saved in persistent browser storage (IndexedDB) for reuse across refreshes.</li>
          <li>After loading once, extraction calls reuse the same in-memory model instance during this session.</li>
          <li>Re-download happens only if you clear site data/cache (or if the browser evicts storage).</li>
          <li>If you choose Cancel in the popup, extraction will not run until you approve download.</li>
          <li>For best results, provide complete text context and specific labels instead of overly broad labels.</li>
        </ul>
      </ContentSection>

      {(showModelConsentModal || isPreparingModel || Boolean(modelLoadError)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-label="Loading GLiNER model">
          <div className="w-full max-w-md rounded-xl border border-sky-500/40 bg-slate-900 p-5 shadow-2xl">
            {isPreparingModel ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-transparent" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-sky-100">Loading GLiNER medium model...</h3>
                </div>
                <p className="mt-3 text-sm text-slate-200">
                  Downloading and preparing model files inside your browser.
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  First run can take around 1-3 minutes depending on network and device performance.
                </p>
              </>
            ) : modelLoadError ? (
              <>
                <h3 className="text-base font-semibold text-amber-100">Model Download Failed</h3>
                <p className="mt-3 text-sm text-amber-200">{modelLoadError}</p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModelConsentModal(false);
                      setPendingExtractAfterModelLoad(false);
                      setModelLoadError("");
                    }}
                    className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void loadModelInBrowserSession();
                    }}
                    className="rounded border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-100 hover:bg-amber-400/20"
                  >
                    Retry Download
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-sky-100">Download GLiNER Model in Browser?</h3>
                <p className="mt-3 text-sm text-slate-200">
                  To run extraction fully client-side, this page must load the GLiNER ONNX model in your browser session.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  <li>No backend extraction call is made.</li>
                  <li>Initial download may take 1-3 minutes.</li>
                  <li>Model file is stored persistently in browser storage for future refreshes.</li>
                  <li>Your consent is remembered in this browser.</li>
                  <li>You can continue only after the model is loaded.</li>
                </ul>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModelConsentModal(false);
                      setPendingExtractAfterModelLoad(false);
                      setModelLoadError("");
                    }}
                    className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem(MODEL_CONSENT_STORAGE_KEY, "true");
                      }
                      setHasModelConsent(true);
                      void loadModelInBrowserSession();
                    }}
                    className="rounded border border-sky-300/40 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-100 hover:bg-sky-400/20"
                  >
                    Proceed and Download
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
