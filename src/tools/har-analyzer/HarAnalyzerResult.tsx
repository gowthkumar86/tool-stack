import type React from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpToLine,
  FileDiff,
  Gauge,
  Globe,
  Network,
  ShieldAlert
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import type {
  ComparisonSummaryRow,
  DomainAnalysisRow,
  HarComparisonAnalysis,
  HarTableRow,
  SingleHarAnalysis,
  TimingDifferenceRow
} from "./analysis";
import { formatBytes, formatDuration } from "./analysis";
import type { ToolLogicResult } from "@/utils/toolLogic/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface HarAnalyzerResultProps {
  result: ToolLogicResult;
}

const chartConfig = {
  count: { label: "Count", color: "hsl(var(--primary))" },
  size: { label: "Size", color: "#0f766e" },
  time: { label: "Time", color: "#ea580c" }
};

const pieColors = ["#2563eb", "#0f766e", "#ea580c", "#dc2626", "#9333ea"];

export default function HarAnalyzerResult({ result }: HarAnalyzerResultProps) {
  const report = result.report as SingleHarAnalysis | HarComparisonAnalysis | undefined;

  if (!report) {
    return null;
  }

  return report.mode === "single" ? (
    <SingleHarView report={report} />
  ) : (
    <ComparisonHarView report={report} />
  );
}

function SingleHarView({ report }: { report: SingleHarAnalysis }) {
  const statusChartData = report.statusBreakdown.map((item) => ({
    name: item.status,
    count: item.count
  }));
  const domainChartData = report.domainAnalysis.slice(0, 8).map((item) => ({
    name: truncate(item.domain, 18),
    time: Math.round(item.totalTime)
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge className="bg-white/15 text-white hover:bg-white/15">
              {report.requestFilter === "api" ? "API requests only" : "All requests"}
            </Badge>
            <h3 className="text-2xl font-semibold tracking-tight">
              HAR performance analysis for {report.fileLabel}
            </h3>
            <p className="max-w-2xl text-sm text-sky-50/90">
              Review performance hotspots, repeated requests, third-party dependencies,
              and network phases without leaving the browser.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-full md:max-w-[320px]">
            <HeroStat label="Requests" value={String(report.summary.totalRequests)} />
            <HeroStat label="Load time" value={formatDuration(report.summary.totalLoadTime)} />
            <HeroStat label="Transferred" value={formatBytes(report.summary.totalDataTransferred)} />
            <HeroStat label="Failures" value={String(report.summary.failedRequests)} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 overflow-x-auto rounded-2xl p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Request Analysis</TabsTrigger>
          <TabsTrigger value="network">Network Bottlenecks</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SummaryGrid
            items={[
              {
                label: "Total Requests",
                value: String(report.summary.totalRequests),
                icon: Gauge
              },
              {
                label: "Total Data Transferred",
                value: formatBytes(report.summary.totalDataTransferred),
                icon: ArrowDownToLine
              },
              {
                label: "Total Load Time",
                value: formatDuration(report.summary.totalLoadTime),
                helper: `Cumulative request time: ${formatDuration(report.summary.cumulativeRequestTime)}`,
                icon: Network
              },
              {
                label: "Failed Requests",
                value: String(report.summary.failedRequests),
                helper: `${report.summary.redirectCount} redirects`,
                icon: ShieldAlert
              }
            ]}
          />

          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <ChartCard title="Domain Time Distribution">
              <ChartContainer config={chartConfig} className="h-[280px] w-full min-w-0">
                <BarChart data={domainChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="time" fill="var(--color-time)" radius={8} />
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard title="Status Code Breakdown">
              <ChartContainer config={chartConfig} className="h-[280px] w-full min-w-0">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={48}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </ChartCard>
          </div>

          <SectionCard title="Domain Analysis" icon={Globe}>
            <DomainTable rows={report.domainAnalysis.slice(0, 12)} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <SectionCard title="Slow Requests" icon={AlertTriangle}>
            <RequestTable rows={report.slowRequests} emphasis="time" />
          </SectionCard>

          <SectionCard title="Large Payloads" icon={ArrowDownToLine}>
            <RequestTable rows={report.largePayloads} emphasis="size" />
          </SectionCard>

          <SectionCard title="Duplicate Requests" icon={FileDiff}>
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <MiniStat
                label="Duplicate Count"
                value={String(report.duplicates.duplicateRequestCount)}
              />
              <MiniStat
                label="Wasted Bandwidth"
                value={formatBytes(report.duplicates.wastedBandwidth)}
              />
              <MiniStat
                label="Wasted Time"
                value={formatDuration(report.duplicates.wastedTime)}
              />
            </div>
            <DuplicateTable rows={report.duplicates.rows} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <SectionCard title="Network Bottleneck Report" icon={Network}>
            <div className="space-y-3">
              {report.bottlenecks.summary.length > 0 ? (
                report.bottlenecks.summary.map((item) => (
                  <div
                    key={item.type}
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                  >
                    {item.message}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No dominant bottleneck pattern crossed the alert thresholds.
                </p>
              )}
            </div>

            <div className="mt-5">
              <HotspotTable rows={report.bottlenecks.hotspots} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <SectionCard title="Third-Party Dependencies" icon={Globe}>
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <MiniStat label="Primary Domain" value={report.thirdParty.primaryDomain} />
              <MiniStat
                label="Third-Party Requests"
                value={String(report.thirdParty.totalThirdPartyRequests)}
              />
              <MiniStat
                label="Third-Party Network Time"
                value={`${report.thirdParty.percentageOfTotalTime.toFixed(1)}%`}
              />
            </div>
            <ThirdPartyTable rows={report.thirdParty.rows} />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComparisonHarView({ report }: { report: HarComparisonAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-zinc-950 via-slate-900 to-blue-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge className="bg-white/15 text-white hover:bg-white/15">
              Comparison mode
            </Badge>
            <h3 className="text-2xl font-semibold tracking-tight">
              Compare {report.harA.fileLabel} vs {report.harB.fileLabel}
            </h3>
            <p className="max-w-3xl text-sm text-slate-100/90">
              Identify performance regressions, status mismatches, missing requests, and
              network phase changes across networks or IP addresses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-full md:max-w-[340px]">
            <HeroStat label={report.harA.fileLabel} value={formatDuration(report.harA.summary.totalLoadTime)} />
            <HeroStat label={report.harB.fileLabel} value={formatDuration(report.harB.summary.totalLoadTime)} />
            <HeroStat label="Regression threshold" value={formatDuration(report.thresholdMs)} />
            <HeroStat label="Matched samples" value={String(report.matchedRequests.length)} />
          </div>
        </div>
      </div>

      <SectionCard title="Bottleneck Summary" icon={AlertTriangle}>
        <div className="space-y-3">
          {report.bottleneckSummary.map((item) => (
            <div key={item} className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 overflow-x-auto rounded-2xl p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Request Comparison</TabsTrigger>
          <TabsTrigger value="timings">Timing Breakdown</TabsTrigger>
          <TabsTrigger value="missing">Missing Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SectionCard title="Request Summary Comparison" icon={Gauge}>
            <ComparisonSummaryTable rows={report.summary} aLabel={report.harA.fileLabel} bLabel={report.harB.fileLabel} />
          </SectionCard>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <SectionCard title={`${report.harA.fileLabel} Snapshot`} icon={ArrowUpToLine}>
              <SummaryGrid
                items={[
                  { label: "Primary Domain", value: report.harA.primaryDomain, icon: Globe },
                  { label: "Requests", value: String(report.harA.summary.totalRequests), icon: Gauge },
                  { label: "Failures", value: String(report.harA.summary.failedRequests), icon: ShieldAlert }
                ]}
              />
            </SectionCard>
            <SectionCard title={`${report.harB.fileLabel} Snapshot`} icon={ArrowDownToLine}>
              <SummaryGrid
                items={[
                  { label: "Primary Domain", value: report.harB.primaryDomain, icon: Globe },
                  { label: "Requests", value: String(report.harB.summary.totalRequests), icon: Gauge },
                  { label: "Failures", value: String(report.harB.summary.failedRequests), icon: ShieldAlert }
                ]}
              />
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <SectionCard title="Performance Regressions" icon={AlertTriangle}>
            <MatchedRequestTable rows={report.regressions} />
          </SectionCard>

          <SectionCard title="Status Code Differences" icon={ShieldAlert}>
            <MatchedRequestTable rows={report.statusDifferences} />
          </SectionCard>

          <SectionCard title="Content Size Comparison" icon={ArrowDownToLine}>
            <MatchedRequestTable rows={report.sizeDifferences} showSize />
          </SectionCard>
        </TabsContent>

        <TabsContent value="timings" className="space-y-6">
          <SectionCard title="Timing Breakdown Comparison" icon={Network}>
            <TimingDifferenceTable rows={report.timingDifferences} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="missing" className="space-y-6">
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <SectionCard title={`Only in ${report.harA.fileLabel}`} icon={ArrowUpToLine}>
              <RequestTable rows={report.missingInB} emphasis="time" />
            </SectionCard>
            <SectionCard title={`Only in ${report.harB.fileLabel}`} icon={ArrowDownToLine}>
              <RequestTable rows={report.missingInA} emphasis="time" />
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-white/70">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function SummaryGrid({
  items,
  columns = "compact"
}: {
  items: Array<{ label: string; value: string; helper?: string; icon: React.ComponentType<{ className?: string }> }>;
  columns?: "overview" | "compact";
}) {
  const gridClassName =
    columns === "compact"
      ? "grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={gridClassName}>
      {items.map((item) => (
        <Card key={item.label} className="min-w-0 overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
            {item.helper ? (
              <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="min-w-0 overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden pt-6">{children}</CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="min-w-0 overflow-hidden border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function RequestTable({
  rows,
  emphasis
}: {
  rows: HarTableRow[];
  emphasis: "time" | "size";
}) {
  if (rows.length === 0) {
    return <EmptyState label="No requests available for this view." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>{emphasis === "time" ? "Time" : "Size"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="max-w-[320px] break-words font-medium">{row.label}</TableCell>
            <TableCell>{row.status ?? "-"}</TableCell>
            <TableCell>{row.domain}</TableCell>
            <TableCell>{emphasis === "time" ? formatDuration(row.time ?? 0) : formatBytes(row.size ?? 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DomainTable({ rows }: { rows: DomainAnalysisRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Requests</TableHead>
          <TableHead>Total Time</TableHead>
          <TableHead>Total Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.domain}>
            <TableCell className="max-w-[240px] break-words font-medium">{row.domain}</TableCell>
            <TableCell>{row.requests}</TableCell>
            <TableCell>{formatDuration(row.totalTime)}</TableCell>
            <TableCell>{formatBytes(row.totalSize)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DuplicateTable({
  rows
}: {
  rows: Array<{ key: string; label: string; count: number; wastedBandwidth: number; wastedTime: number }>;
}) {
  if (rows.length === 0) {
    return <EmptyState label="No duplicate requests were detected." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Calls</TableHead>
          <TableHead>Wasted Bandwidth</TableHead>
          <TableHead>Wasted Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="max-w-[320px] break-words font-medium">{row.label}</TableCell>
            <TableCell>{row.count}</TableCell>
            <TableCell>{formatBytes(row.wastedBandwidth)}</TableCell>
            <TableCell>{formatDuration(row.wastedTime)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ThirdPartyTable({
  rows
}: {
  rows: Array<{ domain: string; requests: number; totalTime: number; totalSize: number; percentageOfTime: number }>;
}) {
  if (rows.length === 0) {
    return <EmptyState label="No third-party requests were detected." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Requests</TableHead>
          <TableHead>Total Time</TableHead>
          <TableHead>Total Size</TableHead>
          <TableHead>% of Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.domain}>
            <TableCell className="max-w-[240px] break-words font-medium">{row.domain}</TableCell>
            <TableCell>{row.requests}</TableCell>
            <TableCell>{formatDuration(row.totalTime)}</TableCell>
            <TableCell>{formatBytes(row.totalSize)}</TableCell>
            <TableCell>{row.percentageOfTime.toFixed(1)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function HotspotTable({
  rows
}: {
  rows: Array<{ key: string; label: string; domain: string; time: number; dominantPhase: string; dominantRatio: number }>;
}) {
  if (rows.length === 0) {
    return <EmptyState label="No request hotspots were detected." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Total Time</TableHead>
          <TableHead>Dominant Phase</TableHead>
          <TableHead>Ratio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="max-w-[320px] break-words font-medium">{row.label}</TableCell>
            <TableCell>{row.domain}</TableCell>
            <TableCell>{formatDuration(row.time)}</TableCell>
            <TableCell className="uppercase">{row.dominantPhase}</TableCell>
            <TableCell>{(row.dominantRatio * 100).toFixed(1)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ComparisonSummaryTable({
  rows,
  aLabel,
  bLabel
}: {
  rows: ComparisonSummaryRow[];
  aLabel: string;
  bLabel: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>{aLabel}</TableHead>
          <TableHead>{bLabel}</TableHead>
          <TableHead>Difference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.metric}>
            <TableCell className="font-medium">{row.metric}</TableCell>
            <TableCell>{formatSummaryValue(row.metric, row.a)}</TableCell>
            <TableCell>{formatSummaryValue(row.metric, row.b)}</TableCell>
            <TableCell>{formatDifference(row.metric, row.b - row.a)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MatchedRequestTable({
  rows,
  showSize = false
}: {
  rows: Array<{
    key: string;
    label: string;
    domain: string;
    statusA: number;
    statusB: number;
    timeA: number;
    timeB: number;
    sizeA: number;
    sizeB: number;
    timeDiff: number;
    sizeDiff: number;
  }>;
  showSize?: boolean;
}) {
  if (rows.length === 0) {
    return <EmptyState label="No differences were detected in this section." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>HAR A</TableHead>
          <TableHead>HAR B</TableHead>
          <TableHead>Difference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="max-w-[320px] break-words font-medium">{row.label}</TableCell>
            <TableCell>{row.domain}</TableCell>
            <TableCell>
              {row.statusA} / {row.statusB}
            </TableCell>
            <TableCell>
              {showSize ? formatBytes(row.sizeA) : formatDuration(row.timeA)}
            </TableCell>
            <TableCell>
              {showSize ? formatBytes(row.sizeB) : formatDuration(row.timeB)}
            </TableCell>
            <TableCell className={row.timeDiff > 0 || row.sizeDiff > 0 ? "text-amber-700" : "text-emerald-700"}>
              {showSize ? formatSignedBytes(row.sizeDiff) : formatSignedDuration(row.timeDiff)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TimingDifferenceTable({ rows }: { rows: TimingDifferenceRow[] }) {
  if (rows.length === 0) {
    return <EmptyState label="No large timing component differences were detected." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Component</TableHead>
          <TableHead>HAR A</TableHead>
          <TableHead>HAR B</TableHead>
          <TableHead>Difference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.key}-${row.component}`}>
            <TableCell className="max-w-[320px] break-words font-medium">{row.label}</TableCell>
            <TableCell>{row.domain}</TableCell>
            <TableCell className="uppercase">{row.component}</TableCell>
            <TableCell>{formatDuration(row.a)}</TableCell>
            <TableCell>{formatDuration(row.b)}</TableCell>
            <TableCell className={row.diff > 0 ? "text-amber-700" : "text-emerald-700"}>
              {formatSignedDuration(row.diff)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="text-sm text-muted-foreground">{label}</p>;
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}...` : value;
}

function formatSignedDuration(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${formatDuration(Math.abs(value))}`;
}

function formatSignedBytes(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${formatBytes(Math.abs(value))}`;
}

function formatSummaryValue(metric: string, value: number) {
  if (metric.includes("Time")) {
    return formatDuration(value);
  }

  if (metric.includes("Data")) {
    return formatBytes(value);
  }

  return String(value);
}

function formatDifference(metric: string, value: number) {
  if (metric.includes("Time")) {
    return formatSignedDuration(value);
  }

  if (metric.includes("Data")) {
    return formatSignedBytes(value);
  }

  return `${value > 0 ? "+" : ""}${value}`;
}






