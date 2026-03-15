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
    <div className="space-y-4">

      {/* INPUT CARD */}

      <Card>
        <CardContent className="pt-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                {/* TEXTAREA */}

                {inp.type === "textarea" && (
                  <Textarea
                    id={inp.name}
                    value={values[inp.name] || ""}
                    onChange={(e) =>
                      handleChange(inp.name, e.target.value)
                    }
                    placeholder={inp.placeholder}
                    className="min-h-[120px]"
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

                {/* SELECT */}

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

                {/* INPUT */}
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

                {/* HELPER TEXT */}

                {inp.helperText && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {inp.helperText}
                  </p>
                )}
              </div>
            ))}

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex gap-3 pt-2">

            <Button
              onClick={handleCalculate}
              className="flex-1 h-12 text-base font-semibold gap-2"
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

          </div>

        </CardContent>
      </Card>

      {/* ERROR */}

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* RESULT */}

      {result && (
        <Card className="border-primary/30 bg-primary/5">

          <CardContent className="min-w-0 overflow-hidden pt-6 space-y-4">

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

                  <pre className="text-lg font-semibold whitespace-pre-wrap break-all font-sans">
                    {formatResultValue(result[r.key])}
                  </pre>

                </div>
              ))
            )}

            <Button
              onClick={handleCopy}
              variant="outline"
              size="icon"
              className="mt-2"
            >
              <Copy className="h-4 w-4" />
            </Button>

          </CardContent>

        </Card>
      )}

      {/* MOBILE BUTTON */}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">

        <Button
          onClick={handleCalculate}
          className="w-full h-12 text-base font-semibold gap-2"
        >
          <Calculator className="h-5 w-5" />
          Calculate
        </Button>

      </div>

      <div className="h-20 md:hidden" />

    </div>
  );
}

