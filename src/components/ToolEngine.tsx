import { useEffect, useMemo, useState } from "react";
import type { ToolConfig } from "@/data/types";
import { runToolLogic } from "@/utils/toolLogic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import { Copy, RotateCcw, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  tool: ToolConfig;
}

function executeTool(tool: ToolConfig, values: Record<string, string>) {
  return tool.run
    ? tool.run(values)
    : runToolLogic(tool.logic, values);
}

function getCopyText(tool: ToolConfig, result: Record<string, unknown>) {
  if (tool.getCopyText) {
    return tool.getCopyText(result);
  }

  return Object.entries(result)
    .map(([k, v]) => `${k}: ${formatResultValue(v)}`)
    .join("\n");
}

function formatResultValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

export default function ToolEngine({ tool }: Props) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const initialValues: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(tool.inputs.map((inp) => [inp.name, inp.defaultValue ?? ""])),
    [tool.inputs]
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [fileInputKey, setFileInputKey] = useState(0);

  const [result, setResult] =
    useState<Record<string, unknown> | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues);
    setResult(null);
    setError(null);
    setFileNames({});
    setFileInputKey((prev) => prev + 1);
  }, [initialValues, tool.slug]);

  if (tool.renderTool) {
    return <>{tool.renderTool()}</>;
  }

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (
    inputName: string,
    targetName: string,
    file: File | null
  ) => {
    if (!file) {
      setFileNames((prev) => {
        const next = { ...prev };
        delete next[inputName];
        return next;
      });
      handleChange(targetName, "");
      return;
    }

    try {
      const text = await file.text();
      handleChange(targetName, text);
      setFileNames((prev) => ({ ...prev, [inputName]: file.name }));
    } catch {
      setError(`Unable to read "${file.name}". Please try another file.`);
    }
  };

  const handleCalculate = () => {
    setError(null);

    try {
      for (const inp of tool.inputs) {
        if (inp.required && !values[inp.name]) {
          setError(`Please enter "${inp.label}"`);
          return;
        }
      }

      const res = executeTool(tool, values);

      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setResult(null);
    setError(null);
    setFileNames({});
    setFileInputKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!result) return;

    const text = getCopyText(tool, result);

    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Result copied to clipboard."
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Clipboard access is not available right now.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="space-y-4 pb-24 md:pb-0">

      <Card className="overflow-hidden rounded-2xl border-border/80">
        <CardContent className="space-y-4 p-4 md:pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {tool.inputs.map((inp) => (
              <div
                key={inp.name}
                className={inp.type === "textarea" ? "md:col-span-2" : ""}
              >

                <Label
                  htmlFor={inp.name}
                  className="mb-1.5 block text-sm font-medium"
                >
                  {inp.label}
                </Label>

                {inp.type === "textarea" && (
                  <Textarea
                    id={inp.name}
                    value={values[inp.name] || ""}
                    onChange={(e) =>
                      handleChange(inp.name, e.target.value)
                    }
                    placeholder={inp.placeholder}
                    className="min-h-[140px] resize-y md:min-h-[120px]"
                  />
                )}

                {inp.type === "file" && (
                  <div className="space-y-2">
                    <Input
                      key={`${tool.slug}-${inp.name}-${fileInputKey}`}
                      id={inp.name}
                      type="file"
                      accept={inp.accept}
                      onChange={(e) =>
                        void handleFileChange(
                          inp.name,
                          inp.loadsInto ?? inp.name,
                          e.target.files?.[0] ?? null
                        )
                      }
                      className="h-12 pt-2"
                    />

                    {fileNames[inp.name] && (
                      <p className="text-xs text-muted-foreground">
                        Loaded file: {fileNames[inp.name]}
                      </p>
                    )}
                  </div>
                )}

                {inp.type === "select" && (
                  <Select
                    value={values[inp.name]}
                    onValueChange={(val) =>
                      handleChange(inp.name, val)
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={inp.placeholder} />
                    </SelectTrigger>

                    <SelectContent>
                      {inp.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {inp.type !== "textarea" && inp.type !== "select" && inp.type !== "file" && (
                  <div className="relative">

                    <Input
                      id={inp.name}
                      type={inp.type}
                      value={values[inp.name] || ""}
                      onChange={(e) =>
                        handleChange(inp.name, e.target.value)
                      }
                      placeholder={inp.placeholder}
                      min={inp.min}
                      max={inp.max}
                      step={inp.step}
                      className="h-12 pr-10"
                    />

                    {inp.unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {inp.unit}
                      </span>
                    )}

                  </div>
                )}

                {inp.helperText && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {inp.helperText}
                  </p>
                )}
              </div>
            ))}

          </div>
          {!isMobile && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCalculate}
                className="h-12 flex-1 gap-2 text-base font-semibold"
              >
                <Calculator className="h-5 w-5" />
                Calculate
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 px-4"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="h-12 px-4"
                disabled={!result}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {error && (
        <Card className="rounded-2xl border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="min-w-0 space-y-4 overflow-hidden p-4 md:pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Result</h3>
                <p className="text-sm text-muted-foreground">Updated instantly after each run.</p>
              </div>
              {!isMobile && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            {tool.renderResult ? (
              tool.renderResult(result)
            ) : (
              tool.results
                .filter((r) => result[r.key] !== undefined && result[r.key] !== null && result[r.key] !== "")
                .map((r) => (
                <div key={r.key}>

                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {r.label}
                  </p>

                  <pre className="overflow-x-auto rounded-lg bg-background/70 p-3 font-sans text-lg font-semibold whitespace-pre-wrap break-all">
                    {formatResultValue(result[r.key])}
                  </pre>

                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-3 backdrop-blur">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2">
            <Button
              onClick={handleCalculate}
              className="h-12 gap-2 text-sm font-semibold"
            >
              <Calculator className="h-4 w-4" />
              Run
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="h-12 gap-2 text-sm"
              disabled={!result}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 gap-2 text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

