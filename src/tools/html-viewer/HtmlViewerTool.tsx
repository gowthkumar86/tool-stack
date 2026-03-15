import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  Eraser,
  Eye,
  FileCode2,
  Play,
  Smartphone,
  TabletSmartphone,
  Upload
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { formatHtml } from "./formatHtml.ts";

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 2rem;
      background: linear-gradient(135deg, #fff8f1, #ffe1bf);
      color: #1f2937;
    }

    .card {
      max-width: 32rem;
      padding: 1.5rem;
      border-radius: 1rem;
      background: white;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World</h1>
    <p>This is a test page rendered inside the HTML Viewer Tool.</p>
  </div>
</body>
</html>`;

type DevicePreset = "desktop" | "tablet" | "mobile";

export default function HtmlViewerTool() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);
  const [renderedHtml, setRenderedHtml] = useState(SAMPLE_HTML);
  const [autoRender, setAutoRender] = useState(true);
  const [allowScripts, setAllowScripts] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview");
  const [devicePreset, setDevicePreset] = useState<DevicePreset>("desktop");
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (autoRender) {
      setRenderedHtml(htmlInput);
      setPreviewError(null);
    }
  }, [autoRender, htmlInput]);

  const sandboxPolicy = allowScripts
    ? "allow-scripts allow-same-origin"
    : "allow-same-origin";

  const previewWidthClass = useMemo(() => {
    switch (devicePreset) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[820px]";
      default:
        return "max-w-full";
    }
  }, [devicePreset]);

  const handleRender = () => {
    try {
      setRenderedHtml(htmlInput);
      setPreviewError(null);
    } catch {
      setPreviewError("Unable to render HTML preview.");
    }
  };

  const handleClear = () => {
    setHtmlInput("");
    setRenderedHtml("");
    setFileName(null);
    setPreviewError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlInput);
      toast({
        title: "HTML copied",
        description: "The current HTML has been copied to the clipboard."
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard access is not available right now.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlInput], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName ?? "preview.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    try {
      const formatted = formatHtml(htmlInput);
      setHtmlInput(formatted);

      toast({
        title: "HTML formatted",
        description: "The editor content has been beautified."
      });
    } catch {
      toast({
        title: "Format failed",
        description: "Unable to format this HTML. The original content was kept.",
        variant: "destructive"
      });
    }
  };

  const handleOpenInTab = () => {
    try {
      const blob = new Blob([renderedHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      toast({
        title: "Open failed",
        description: "Unable to open the preview in a new tab.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      setHtmlInput(text);
      setFileName(file.name);
      setPreviewError(null);
    } catch {
      toast({
        title: "Upload failed",
        description: `Unable to read "${file.name}". Try another HTML file.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-white via-white to-sky-50/70">
        <CardHeader className="border-b bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Badge className="w-fit bg-sky-600 text-white hover:bg-sky-600">
                Developer Preview
              </Badge>
              <CardTitle className="text-2xl">HTML Viewer Workspace</CardTitle>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Paste raw HTML or upload a file, then render it inside a sandboxed
                iframe without leaving the app.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRender} className="gap-2">
                <Play className="h-4 w-4" />
                Render HTML
              </Button>
              <Button onClick={handleFormat} variant="outline" className="gap-2">
                <Code2 className="h-4 w-4" />
                Beautify
              </Button>
              <Button onClick={handleCopy} variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy HTML
              </Button>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleClear} variant="outline" className="gap-2">
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-background/90 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <Label
                htmlFor="html-file-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                Upload HTML File
              </Label>
              <Input
                id="html-file-upload"
                ref={fileInputRef}
                type="file"
                accept=".html,text/html"
                className="hidden"
                onChange={(event) =>
                  void handleFileChange(event.target.files?.[0] ?? null)
                }
              />

              {fileName && (
                <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
                  <FileCode2 className="h-3.5 w-3.5" />
                  {fileName}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <Switch
                  id="html-auto-render"
                  checked={autoRender}
                  onCheckedChange={setAutoRender}
                />
                <Label htmlFor="html-auto-render">Auto preview</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="html-allow-scripts"
                  checked={allowScripts}
                  onCheckedChange={setAllowScripts}
                />
                <Label htmlFor="html-allow-scripts">Allow scripts</Label>
              </div>

              <Badge variant="outline" className="rounded-full">
                sandbox="{sandboxPolicy}"
              </Badge>

              {!allowScripts && (
                <p className="text-xs text-muted-foreground">
                  Scripts are blocked by default to keep the main app isolated.
                </p>
              )}
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border bg-background/70",
              isPreviewFullscreen && "fixed inset-4 z-50 bg-background shadow-2xl"
            )}
          >
            <ResizablePanelGroup
              direction="horizontal"
              className={cn(
                "min-h-[680px]",
                isPreviewFullscreen && "min-h-full"
              )}
            >
              <ResizablePanel defaultSize={48} minSize={30}>
                <section className="flex h-full flex-col">
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-semibold">HTML Editor</h2>
                        <p className="text-sm text-muted-foreground">
                          Paste markup, tweak it, and render when you are ready.
                        </p>
                      </div>
                      {autoRender && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <Textarea
                      value={htmlInput}
                      onChange={(event) => setHtmlInput(event.target.value)}
                      spellCheck={false}
                      placeholder="<!DOCTYPE html><html>...</html>"
                      className="h-full min-h-[560px] resize-none rounded-2xl border-0 bg-slate-950 p-4 font-mono text-sm text-slate-50 shadow-inner"
                    />
                  </div>
                </section>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={52} minSize={30}>
                <section className="flex h-full flex-col">
                  <div className="border-b p-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <h2 className="font-semibold">Rendered Preview</h2>
                        <p className="text-sm text-muted-foreground">
                          Rendered in a sandboxed iframe with optional source view.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={devicePreset === "desktop" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDevicePreset("desktop")}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Desktop
                        </Button>
                        <Button
                          type="button"
                          variant={devicePreset === "tablet" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDevicePreset("tablet")}
                        >
                          <TabletSmartphone className="mr-2 h-4 w-4" />
                          Tablet
                        </Button>
                        <Button
                          type="button"
                          variant={devicePreset === "mobile" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDevicePreset("mobile")}
                        >
                          <Smartphone className="mr-2 h-4 w-4" />
                          Mobile
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPreviewFullscreen((prev) => !prev)}
                        >
                          {isPreviewFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleOpenInTab}
                        >
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Tabs
                    value={viewMode}
                    onValueChange={(value) => setViewMode(value as "preview" | "source")}
                    className="flex h-full flex-1 flex-col"
                  >
                    <div className="border-b px-4 py-3">
                      <TabsList className="grid w-full max-w-[260px] grid-cols-2">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="source">View Source</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="preview" className="m-0 flex-1 p-4">
                      {previewError ? (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
                          {previewError}
                        </div>
                      ) : renderedHtml.trim() ? (
                        <div className="flex h-full items-start justify-center overflow-auto rounded-2xl border bg-[linear-gradient(135deg,rgba(2,132,199,0.08),rgba(15,23,42,0.03))] p-4">
                          <div className={cn("w-full transition-all duration-300", previewWidthClass)}>
                            <iframe
                              title="HTML preview"
                              sandbox={sandboxPolicy}
                              srcDoc={renderedHtml}
                              className="h-[560px] w-full rounded-2xl border bg-white shadow-xl"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                          Paste HTML or upload a file to render a preview.
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="source" className="m-0 flex-1 p-4">
                      <ScrollArea className="h-[560px] rounded-2xl border bg-slate-950">
                        <pre className="min-h-full whitespace-pre-wrap break-all p-4 font-mono text-sm text-slate-50">
                          {renderedHtml || "Rendered HTML source will appear here."}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </section>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

