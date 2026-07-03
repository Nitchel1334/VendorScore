/* eslint-disable */
import { useState, useEffect } from "react";
import { Download, FileText, Table, TrendingUp, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getTransactions } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

const dateRanges = ["This Week", "This Month", "Last 3 Months", "Last 6 Months", "Custom"];

export function ReportsScreen({ navigate }: Props) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("This Month");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    getTransactions(token).then((res) => {
      if (res.data) setTransactions(res.data as any[]);
    });
  }, []);

  const totalIn = transactions.filter(t => t.type === "Sale").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type !== "Sale").reduce((s, t) => s + t.amount, 0);
  const net = totalIn - totalOut;

  const reportTypes = [
    {
      id: "cashflow",
      label: "Cash Flow Report",
      desc: "Daily/weekly/monthly inflows & outflows",
      icon: TrendingUp,
      color: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      highlights: [`Total Inflow: ₹${totalIn.toLocaleString()}`, `Total Outflow: ₹${totalOut.toLocaleString()}`, `Net Cash Flow: ₹${net.toLocaleString()}`],
    },
    {
      id: "income",
      label: "Income Statement",
      desc: "Revenue, expenses, and net profit summary",
      icon: FileText,
      color: "bg-green-50 border-green-100",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      highlights: [`Revenue: ₹${totalIn.toLocaleString()}`, `Expenses: ₹${totalOut.toLocaleString()}`, `Net Profit: ₹${net.toLocaleString()}`],
    },
    {
      id: "ledger",
      label: "Transaction Ledger",
      desc: "Complete record of all transactions",
      icon: Table,
      color: "bg-purple-50 border-purple-100",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      highlights: [`${transactions.length} transactions`, "All categories included"],
    },
    {
      id: "loan",
      label: "Loan Assessment Report",
      desc: "Credit score, eligibility & supporting data",
      icon: CreditCard,
      color: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      highlights: ["Credit Score: 742", "Eligible: ₹2,50,000", "Approval Probability: 78%"],
    },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const selected = reportTypes.find((r) => r.id === selectedReport);

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Reports"
        subtitle="Generate financial documents"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Date Range Selector */}
        <div>
          <p className="text-muted-foreground mb-2" style={{ fontSize: "0.75rem", fontWeight: 700 }}>DATE RANGE</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`shrink-0 px-3 py-2 rounded-xl border transition-colors ${
                  dateRange === r
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground"
                }`}
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Report Type Selection */}
        <div>
          <p className="text-muted-foreground mb-2" style={{ fontSize: "0.75rem", fontWeight: 700 }}>SELECT REPORT TYPE</p>
          <div className="flex flex-col gap-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => { setSelectedReport(report.id); setGenerated(false); }}
                  className={`${report.color} border rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className={`w-10 h-10 ${report.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={report.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>{report.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{report.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-border"}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Preview */}
        {selectedReport && selected && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Report Preview</p>
            <div className="bg-muted/50 rounded-xl p-3 mb-3">
              <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {selected.label}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: "0.72rem", marginBottom: "0.5rem" }}>
                Period: {dateRange} · Ravi Kirana Store
              </p>
              <div className="flex flex-col gap-1.5">
                {selected.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                    <span style={{ fontSize: "0.75rem" }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {!generated ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full py-3.5 rounded-xl transition-all ${
                  generating ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                }`}
                style={{ fontWeight: 700, fontSize: "0.9rem" }}
              >
                {generating ? "⚙️ Generating..." : "Generate Report"}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-1">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <p className="text-green-700" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Report generated successfully!</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center gap-2">
                    <Download size={15} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>PDF</span>
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-center gap-2">
                    <Download size={15} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Excel</span>
                  </button>
                </div>
                <button className="w-full py-3 rounded-xl border border-border text-muted-foreground flex items-center justify-center gap-2">
                  <span>📤</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Share via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Downloads */}
        <div>
          <p className="text-muted-foreground mb-2" style={{ fontSize: "0.75rem", fontWeight: 700 }}>QUICK EXPORTS</p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("transaction-history")}
              className="flex-1 py-3 bg-card border border-border rounded-xl flex items-center justify-center gap-1.5"
            >
              <Table size={14} className="text-primary" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Transaction CSV</span>
            </button>
            <button
              className="flex-1 py-3 bg-card border border-border rounded-xl flex items-center justify-center gap-1.5"
            >
              <CreditCard size={14} className="text-primary" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Credit Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
