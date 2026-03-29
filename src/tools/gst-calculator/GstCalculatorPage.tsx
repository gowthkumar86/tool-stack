import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentSection from "../../components/ContentSection";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { setSEO } from "../../utils/seo";
import { generateInsights } from "./gstInsights";
import { calculateGST, type GstCalculationResult } from "./gstUtils";

function insightClass(type: "tip" | "warning" | "info"): string {
  if (type === "tip") return "border-green-500/40 bg-green-500/10 text-green-300";
  if (type === "warning") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-200";
  return "border-blue-500/40 bg-blue-500/10 text-blue-200";
}

const gstRates = [5, 12, 18, 28];

function GstCalculatorPage() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);
  const [result, setResult] = useState<GstCalculationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setSEO({
      title: "GST Calculator India - Understand Your Real Tax Impact",
      description:
        "Calculate GST in India with inclusive and exclusive modes, practical insights, and real tax impact visibility.",
    });
  }, []);

  useEffect(() => {
    setIsCalculating(true);

    const timer = window.setTimeout(() => {
      const numericAmount = Number(amount);

      if (!amount.trim()) {
        setResult(null);
        setErrorMessage("Enter an amount to start auto-calculation.");
        setIsCalculating(false);
        return;
      }

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setResult(null);
        setErrorMessage("Please enter a valid amount greater than 0.");
        setIsCalculating(false);
        return;
      }

      try {
        setResult(calculateGST(numericAmount, rate, isInclusive));
        setErrorMessage("");
      } catch (error) {
        setResult(null);
        setErrorMessage(error instanceof Error ? error.message : "Could not calculate GST.");
      } finally {
        setIsCalculating(false);
      }
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [amount, rate, isInclusive]);

  const insights = useMemo(() => {
    if (!result) {
      return [{ type: "info" as const, text: "Results appear instantly while you type your amount." }];
    }

    return generateInsights(result, {
      amount: Number(amount),
      rate,
      isInclusive,
    });
  }, [amount, isInclusive, rate, result]);

  async function copyResult() {
    if (!result) {
      return;
    }

    const text = [
      `Amount Input: \u20B9${Number(amount).toFixed(2)}`,
      `GST Rate: ${rate}%`,
      `Mode: ${isInclusive ? "Inclusive" : "Exclusive"}`,
      `Base Amount: \u20B9${result.baseAmount.toFixed(2)}`,
      `GST Amount: \u20B9${result.gstAmount.toFixed(2)}`,
      `Total Amount: \u20B9${result.totalAmount.toFixed(2)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Clipboard access failed. Please copy manually.");
    }
  }

  return (
    <article className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold text-gray-100">GST Smart Tool</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Most GST mistakes happen before invoicing, not during filing. This tool helps you understand the real tax
          share in your quote and avoid accidental underpricing.
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="GST tool layout">
        <Card hoverable className="relative">
          <h2 className="text-lg font-semibold text-gray-100">Input</h2>
          <p className="mt-2 text-sm text-slate-300">Auto-calculates on every change.</p>

          <label htmlFor="amount" className="mt-4 block text-sm font-medium text-slate-300">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setCopyMessage("");
            }}
            className="input-field mono-output mt-2 p-2 text-sm"
          />

          <label htmlFor="rate" className="mt-4 block text-sm font-medium text-slate-300">
            GST Rate
          </label>
          <select
            id="rate"
            value={rate}
            onChange={(event) => {
              setRate(Number(event.target.value));
              setCopyMessage("");
            }}
            className="input-field mt-2 p-2 text-sm"
          >
            {gstRates.map((gstRate) => (
              <option key={gstRate} value={gstRate}>
                {gstRate}%
              </option>
            ))}
          </select>

          <section className="mt-4">
            <h3 className="text-sm font-medium text-slate-300">Price Type</h3>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                onClick={() => setIsInclusive(false)}
                variant={!isInclusive ? "primary" : "secondary"}
              >
                Exclusive
              </Button>
              <Button
                type="button"
                onClick={() => setIsInclusive(true)}
                variant={isInclusive ? "primary" : "secondary"}
              >
                Inclusive
              </Button>
            </div>
          </section>
        </Card>

        <Card hoverable className="relative">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-100">Results & Insights</h2>
            <Button type="button" onClick={copyResult} disabled={!result} className="text-xs">
              {copyMessage || "Copy Result"}
            </Button>
          </header>

          {isCalculating ? (
            <section className="mt-4 grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </section>
          ) : errorMessage ? (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{errorMessage}</p>
          ) : result ? (
            <section className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
                <h3 className="text-xs uppercase tracking-wide text-slate-400">Base Amount</h3>
                <p className="mono-output mt-1 text-lg font-semibold text-gray-100">{`\u20B9${result.baseAmount.toFixed(2)}`}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
                <h3 className="text-xs uppercase tracking-wide text-slate-400">GST Amount</h3>
                <p className="mono-output mt-1 text-lg font-semibold text-gray-100">{`\u20B9${result.gstAmount.toFixed(2)}`}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900 p-3">
                <h3 className="text-xs uppercase tracking-wide text-slate-400">Total Amount</h3>
                <p className="mono-output mt-1 text-lg font-semibold text-gray-100">{`\u20B9${result.totalAmount.toFixed(2)}`}</p>
              </div>
            </section>
          ) : (
            <div className="mt-4">
              <EmptyState title="No calculation yet" description="Enter an amount and choose rate to view GST split." />
            </div>
          )}

          <section className="mt-4 space-y-2" aria-label="Insights">
            <h3 className="text-sm font-semibold text-gray-100">Insights</h3>
            {insights.map((insight, index) => (
              <p key={`${insight.type}-${index}`} className={`rounded-md border p-3 text-sm ${insightClass(insight.type)}`}>
                {insight.text}
              </p>
            ))}
          </section>
        </Card>
      </section>

      <ContentSection title="Real-World Problem This Solves">
        <p>
          Freelancers and product teams often quote a final number without being clear whether GST is included.
          That causes margin surprises and awkward renegotiation later.
        </p>
      </ContentSection>

      <ContentSection title="Common Pricing Mistakes">
        <ul className="list-disc space-y-2 pl-5">
          <li>Mixing inclusive and exclusive numbers in the same estimate.</li>
          <li>Assuming 18% always means 18% of final billed amount.</li>
          <li>Skipping tax breakdown in client communication.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Practical Example">
        <p>
          If a client says they can pay {`\u20B910,000`} all-inclusive at 18% GST, your real base amount is lower than
          {` \u20B910,000`}. This tool makes that visible instantly.
        </p>
      </ContentSection>

      <ContentSection title="Edge Cases And FAQs">
        <h3 className="text-base font-semibold text-gray-100">Should I use this for official filing?</h3>
        <p>Use this for planning and communication. Confirm final filing numbers with your accountant.</p>
        <h3 className="text-base font-semibold text-gray-100">Where do JSON and HAR tools fit here?</h3>
        <p>
          If billing API responses look wrong, inspect timing in <Link to="/har-analyzer" className="text-emerald-300">HAR Analyzer</Link>
          and validate payloads in <Link to="/json-formatter" className="text-emerald-300">JSON Formatter</Link>.
        </p>
      </ContentSection>
    </article>
  );
}

export default GstCalculatorPage;
