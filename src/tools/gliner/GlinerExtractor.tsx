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

export default function GlinerExtractorPage() {
  const [mode, setMode] = useState<Mode>("use-case");
  const [useCases, setUseCases] = useState<UseCaseDefinition[]>([]);
  const [selectedUseCase, setSelectedUseCase] = useState("");
  const [useCaseInputText, setUseCaseInputText] = useState("");
  const [customInputText, setCustomInputText] = useState("");
  const [labelsInput, setLabelsInput] = useState("person, organization, role, date");
  const [isLoadingUseCases, setIsLoadingUseCases] = useState(true);
  const [isPreparingModel, setIsPreparingModel] = useState(true);
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

  const canExtract = useMemo(() => {
    if (isExtracting || isPreparingModel || Boolean(modelLoadError)) {
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

  useEffect(() => {
    let cancelled = false;

    async function warmupModel() {
      setIsPreparingModel(true);
      setModelLoadError("");

      try {
        await preloadGlinerModel();
      } catch (error) {
        if (cancelled) {
          return;
        }

        setModelLoadError(error instanceof Error ? error.message : "Could not load GLiNER model in browser.");
      } finally {
        if (!cancelled) {
          setIsPreparingModel(false);
        }
      }
    }

    void warmupModel();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRetryModelLoad() {
    setIsPreparingModel(true);
    setModelLoadError("");

    try {
      await preloadGlinerModel();
    } catch (error) {
      setModelLoadError(error instanceof Error ? error.message : "Could not load GLiNER model in browser.");
    } finally {
      setIsPreparingModel(false);
    }
  }

  async function handleExtract() {
    if (!canExtract) {
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

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-100">GLiNER Entity Extraction Tool</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
          Run extraction in two ways: choose a predefined use case for structured business output, or switch to custom labels for ad-hoc analysis.
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
                void handleExtract();
              }}
              disabled={!canExtract}
              loading={isExtracting}
            />
            {!canExtract && (
              <p className="text-xs text-slate-400">
                {isPreparingModel
                  ? "GLiNER model is loading in your browser."
                  : modelLoadError
                    ? "Retry model load to continue."
                    : mode === "use-case"
                      ? "Enter input text and choose a use case to extract."
                      : "Enter input text and labels to extract."}
              </p>
            )}
          </div>

          {isPreparingModel && (
            <div className="rounded-md border border-sky-500/40 bg-sky-500/10 p-3 text-sm text-sky-200">
              <p className="font-medium">Loading GLiNER model in browser...</p>
              <p className="mt-1 text-xs text-sky-100/90">
                First run downloads model files. This can take 20-60 seconds based on network/device speed.
              </p>
            </div>
          )}

          {modelLoadError && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
              <p>{modelLoadError}</p>
              <button
                type="button"
                onClick={() => {
                  void handleRetryModelLoad();
                }}
                className="mt-2 rounded border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-100 hover:bg-amber-400/20"
              >
                Retry model load
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}
        </Card>

        <Card hoverable className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold text-slate-100">Extraction Results</h2>
            <p className="mt-1 text-sm text-slate-300">
              {mode === "use-case"
                ? "Grouped entities are shown first for business use, followed by raw entities for debugging."
                : "Custom extraction entities are shown below."}
            </p>
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
    </article>
  );
}
