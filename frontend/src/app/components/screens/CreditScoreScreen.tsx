/* eslint-disable */
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Shield, Activity, BarChart2, AlertTriangle, ChevronRight } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getCreditScore, getCurrentVendor } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

const scoreHistory = [
  { month: "Jan", score: 620 },
  { month: "Feb", score: 645 },
  { month: "Mar", score: 660 },
  { month: "Apr", score: 695 },
  { month: "May", score: 718 },
  { month: "Jun", score: 742 },
];

// We will dynamically populate the score and breakdown instead of static values

function ScoreGauge({ score }: { score: number }) {
  const maxScore = 900;
  const pct = score / maxScore;
  const r = 70;
  const cx = 100;
  const cy = 90;
  const totalArc = Math.PI * r;
  const filled = totalArc * pct;

  const getColor = (s: number) =>
    s < 500 ? "#DC2626" : s < 650 ? "#F59E0B" : s < 750 ? "#2563EB" : "#16A34A";

  const category = score < 500 ? "Poor" : score < 650 ? "Fair" : score < 750 ? "Good" : "Excellent";

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="110" viewBox="0 0 200 110">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${totalArc}`}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="32" fontWeight="800" fill={getColor(score)}>
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#64748B">
          out of 900
        </text>
      </svg>
      <div className="flex items-center gap-2 -mt-1">
        <span
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor: getColor(score) + "20",
            color: getColor(score),
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          {category}
        </span>
        <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
          Top 28% of vendors
        </span>
      </div>
    </div>
  );
}

export function CreditScoreScreen({ navigate }: Props) {
  const [scoreData, setScoreData] = useState<any>(null);
  const [vendorName, setVendorName] = useState("VENDOR");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("authToken");
    if (!token) return;

    getCurrentVendor(token).then(res => {
      if (res.data) setVendorName(res.data.business_name || res.data.vendor_name);
    });

    getCreditScore(token).then(res => {
      if (res.data) setScoreData(res.data);
      setLoading(false);
    });
  }, []);

  const breakdownData = scoreData ? [
    { label: "Revenue Stability", score: scoreData.stability_score, max: 100, icon: Activity, color: "#16A34A", desc: "Consistency of revenue" },
    { label: "Transaction Frequency", score: scoreData.frequency_score, max: 100, icon: BarChart2, color: "#2563EB", desc: "Daily transaction volume" },
    { label: "Monthly Revenue", score: scoreData.growth_score, max: 100, icon: TrendingUp, color: "#9333EA", desc: "Overall volume relative to peers" },
    { label: "Business Consistency", score: 100 - scoreData.risk_score, max: 100, icon: Shield, color: "#F59E0B", desc: "Active trading days" },
  ] : [];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Credit Score"
        subtitle="AI-powered assessment"
        onBack={() => navigate("dashboard")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Score Gauge Card */}
        <div className="bg-card border border-border rounded-3xl p-5 flex flex-col items-center gap-2">
          <p className="text-muted-foreground uppercase" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            AS OF {mounted ? new Date().toLocaleDateString() : ""} · {vendorName}
          </p>
          {loading ? (
            <div className="h-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScoreGauge score={scoreData?.score || 300} />
          )}
          <div className="flex gap-2 mt-1">
            <span className="flex items-center gap-1 text-green-600" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              <TrendingUp size={12} />
              +24 points since last month
            </span>
          </div>
        </div>

        {/* Score Range Legend */}
        <div className="bg-card border border-border rounded-2xl p-3">
          <p className="text-muted-foreground mb-2" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
            SCORE RANGE GUIDE
          </p>
          <div className="flex gap-1">
            {[
              { range: "300–499", label: "Poor", color: "#DC2626" },
              { range: "500–649", label: "Fair", color: "#F59E0B" },
              { range: "650–749", label: "Good", color: "#2563EB" },
              { range: "750–900", label: "Excellent", color: "#16A34A" },
            ].map((r) => (
              <div key={r.label} className="flex-1 text-center p-1.5 rounded-lg" style={{ backgroundColor: r.color + "15" }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: r.color }} />
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: r.color }}>{r.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.58rem" }}>{r.range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score History Chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Score History</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis domain={[580, 780]} tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ fill: "#2563EB", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Breakdown */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Score Breakdown</p>
          <div className="flex flex-col gap-3">
            {breakdownData.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + "15" }}>
                        <Icon size={15} style={{ color: item.color }} />
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: item.color }}>
                      {item.score}
                      <span className="text-muted-foreground" style={{ fontSize: "0.7rem", fontWeight: 400 }}>/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("loan-eligibility")}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          style={{ fontWeight: 700, fontSize: "1rem" }}
        >
          Check Loan Eligibility
          <ChevronRight size={18} />
        </button>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-yellow-800" style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                Improve Your Score
              </p>
              <ul className="text-yellow-700 flex flex-col gap-1" style={{ fontSize: "0.7rem" }}>
                <li>• Record all transactions daily for better consistency score</li>
                <li>• Add your Aadhaar/PAN to unlock higher loan limits</li>
                <li>• Reduce cash transactions — digital payments boost score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
