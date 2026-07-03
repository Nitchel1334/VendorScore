/* eslint-disable */
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, ChevronRight, TrendingUp, Star, Calendar, CreditCard, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getLoanEligibility, getCreditScore, getTransactions } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

export function LoanEligibilityScreen({ navigate }: Props) {
  const [loanData, setLoanData] = useState<any>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [txCount, setTxCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    Promise.all([
      getLoanEligibility(token),
      getCreditScore(token),
      getTransactions(token),
    ]).then(([loanRes, scoreRes, txRes]) => {
      if (loanRes.data) setLoanData(loanRes.data);
      if (scoreRes.data) setScoreData(scoreRes.data);
      if (txRes.data) setTxCount((txRes.data as any[]).length);
      setLoading(false);
    });
  }, []);

  const prob = loanData?.approval_probability ?? 0;
  const maxAmount = loanData?.max_eligible_amount ?? 0;
  const kycPct = loanData?.kyc_completion_pct ?? 50;
  const approvalData = [{ value: prob }, { value: 100 - prob }];
  const COLORS = ["#16A34A", "#E2E8F0"];

  const factors = scoreData ? [
    {
      label: "Credit Score",
      value: `${scoreData.score} / 850`,
      status: scoreData.score >= 650 ? "good" : scoreData.score >= 450 ? "warn" : "bad",
      icon: Star,
      desc: scoreData.score >= 650 ? "Above average — qualifies for standard loans" : "Build your score by recording transactions daily",
    },
    {
      label: "Revenue Stability",
      value: `${scoreData.stability_score}/100`,
      status: scoreData.stability_score >= 60 ? "good" : "warn",
      icon: TrendingUp,
      desc: "Based on expense-to-revenue ratio",
    },
    {
      label: "Transaction History",
      value: `${txCount} records`,
      status: txCount >= 10 ? "good" : "warn",
      icon: Calendar,
      desc: txCount >= 10 ? "Good transaction volume" : "Add more transactions to improve eligibility",
    },
    {
      label: "KYC Completion",
      value: `${kycPct}%`,
      status: kycPct >= 100 ? "good" : "warn",
      icon: AlertCircle,
      desc: kycPct < 100 ? "Add Aadhaar/PAN to increase limit" : "KYC fully completed",
    },
  ] : [];

  // Generate 3 loan tiers based on max amount
  const loanProducts = maxAmount > 0 ? [
    {
      name: "Micro Business Loan",
      amount: `₹${Math.round(maxAmount * 0.2).toLocaleString()}`,
      rate: "12% p.a.",
      tenure: "12 months",
      tag: "Recommended",
      color: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
    },
    {
      name: "Working Capital",
      amount: `₹${Math.round(maxAmount * 0.6).toLocaleString()}`,
      rate: "14% p.a.",
      tenure: "18 months",
      tag: "",
      color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
    },
    {
      name: "Growth Loan",
      amount: `₹${Math.round(maxAmount).toLocaleString()}`,
      rate: "16% p.a.",
      tenure: "24 months",
      tag: "Max Eligible",
      color: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
    },
  ] : [];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Loan Eligibility"
        subtitle="AI-estimated assessment"
        onBack={() => navigate("credit-score")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
            <p className="text-muted-foreground text-sm">Calculating your eligibility...</p>
          </div>
        ) : (
          <>
            {/* Main Eligibility Card */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-5 text-primary-foreground">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary-foreground/70" style={{ fontSize: "0.75rem" }}>ESTIMATED ELIGIBLE AMOUNT</p>
                  <p style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>
                    {maxAmount > 0 ? `₹${Math.round(maxAmount).toLocaleString()}` : "Not Eligible"}
                  </p>
                  {maxAmount > 0 && (
                    <p className="text-primary-foreground/70 mt-1" style={{ fontSize: "0.75rem" }}>
                      Recommended: ₹{Math.round(maxAmount * 0.2).toLocaleString()} – ₹{Math.round(maxAmount * 0.6).toLocaleString()}
                    </p>
                  )}
                </div>
                {/* Approval Probability Gauge */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={approvalData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={36}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          {approvalData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} strokeWidth={0} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "white" }}>{prob}%</span>
                    </div>
                  </div>
                  <p className="text-primary-foreground/70 text-center" style={{ fontSize: "0.65rem", marginTop: "-0.25rem" }}>
                    Approval<br />Probability
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
                {maxAmount > 0 ? (
                  <CheckCircle2 size={14} className="text-green-300" />
                ) : (
                  <AlertCircle size={14} className="text-yellow-300" />
                )}
                <p className="text-primary-foreground" style={{ fontSize: "0.8rem" }}>
                  {maxAmount > 0
                    ? "You are <strong>eligible</strong> for unsecured business loans"
                    : "Record more transactions to improve eligibility"}
                </p>
              </div>
            </div>

            {/* Loan Products */}
            {loanProducts.length > 0 && (
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Recommended Loan Range</p>
                <div className="flex flex-col gap-2">
                  {loanProducts.map((p) => (
                    <div key={p.name} className={`${p.color} border rounded-2xl p-3.5 flex items-center gap-3`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>{p.name}</p>
                          {p.tag && (
                            <span className={`px-2 py-0.5 rounded-full ${p.tag === "Recommended" ? "bg-green-500 text-white" : "bg-purple-500 text-white"}`} style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                              {p.tag}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>💰 Up to {p.amount}</span>
                          <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>📊 {p.rate}</span>
                          <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>📅 {p.tenure}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Factors */}
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Key Factors Affecting Eligibility</p>
              <div className="flex flex-col gap-2">
                {factors.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${f.status === "good" ? "bg-green-50 dark:bg-green-900/30" : f.status === "warn" ? "bg-yellow-50 dark:bg-yellow-900/30" : "bg-red-50 dark:bg-red-900/30"}`}>
                        <Icon size={16} className={f.status === "good" ? "text-green-600" : f.status === "warn" ? "text-yellow-600" : "text-red-500"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{f.label}</p>
                          <span className={`${f.status === "good" ? "text-green-600" : f.status === "warn" ? "text-yellow-600" : "text-red-500"}`} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                            {f.value}
                          </span>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: "0.68rem" }}>{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {maxAmount > 0 && (
              <div className="flex flex-col gap-2">
                <button
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  style={{ fontWeight: 700, fontSize: "1rem" }}
                >
                  Apply for Loan Now
                </button>
                <button
                  onClick={() => navigate("reports")}
                  className="w-full py-3.5 rounded-2xl border border-border text-foreground"
                  style={{ fontWeight: 600, fontSize: "0.9rem" }}
                >
                  Download Loan Assessment Report
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
