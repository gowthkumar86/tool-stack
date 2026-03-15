import { useState } from "react";
import { ToolConfig } from "@/data/types";
import { runToolLogic } from "@/utils/toolLogic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RotateCcw, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  tool: ToolConfig;
}

export default function ToolEngine({ tool }: Props) {
  const { toast } = useToast();
  const initialValues: Record<string, string> = {};
  tool.inputs.forEach((inp) => {
    initialValues[inp.name] = inp.defaultValue || "";
  });

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    setError(null);
    try {
      // Validate required number fields
      for (const inp of tool.inputs) {
        if (inp.type === "number" && !inp.defaultValue && !values[inp.name]) {
          setError(`Please enter a value for "${inp.label}"`);
          return;
        }
      }
      const res = runToolLogic(tool.logic, values);
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setResult(null);
    setError(null);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({ title: "Copied!", description: "Result copied to clipboard." });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.inputs.map((inp) => (
              <div key={inp.name} className={inp.type === "textarea" ? "md:col-span-2" : ""}>
                <Label htmlFor={inp.name} className="mb-1.5 block text-sm font-medium">
                  {inp.label}
                </Label>
                {inp.type === "textarea" ? (
                  <Textarea
                    id={inp.name}
                    value={values[inp.name] || ""}
                    onChange={(e) => handleChange(inp.name, e.target.value)}
                    placeholder={inp.placeholder}
                    className="min-h-[120px] text-base"
                  />
                ) : (
                  <Input
                    id={inp.name}
                    type={inp.type}
                    value={values[inp.name] || ""}
                    onChange={(e) => handleChange(inp.name, e.target.value)}
                    placeholder={inp.placeholder}
                    className="h-12 text-base"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleCalculate} className="flex-1 h-12 text-base font-semibold gap-2">
              <Calculator className="h-5 w-5" />
              Calculate
            </Button>
            <Button onClick={handleReset} variant="outline" className="h-12 px-4">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {result !== null && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">{tool.resultLabel}</p>
                <pre className="text-lg font-semibold text-foreground whitespace-pre-wrap break-all font-sans">
                  {result}
                </pre>
              </div>
              <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sticky mobile calculate button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">
        <Button onClick={handleCalculate} className="w-full h-12 text-base font-semibold gap-2">
          <Calculator className="h-5 w-5" />
          Calculate
        </Button>
      </div>
      <div className="h-20 md:hidden" /> {/* Spacer for sticky button */}
    </div>
  );
}
