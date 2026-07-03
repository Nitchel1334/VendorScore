import { CheckCircle2, XCircle, AlertCircle, ChevronRight, TrendingUp, Star, Calendar, CreditCard } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const approvalData = [{ value: 78 }, { value: 22 }];
const COLORS = ["#16A34A", "#E2E8F0"];

const factors = [
  { label: "Credit Score", value: "742 / 900", status: "good", icon: Star, desc: "Above average — qualifies for standard loans" },
  { label: "Revenue Stability", value: "5 months", status: "good", icon: TrendingUp, desc: "Consistent income stream detected" },
  { label: "Transaction History", value: "340 records", status: "good", icon: Calendar, desc: "Strong transaction frequency over 6 months" },
  { label: "Existing Loans", value: "None", status: "good", icon: CreditCard, desc: "No outstanding loans — full capacity available" },
  { label: "KYC Completion", value: "60%", status: "warn", icon: AlertCircle, desc: "Add Aadhaar/PAN to increase limit by ₹1,00,000" },
];

const loanProducts = [
  { name: "Micro Business Loan", amount: "₹50,000", rate: "12% p.a.", tenure: "12 months", tag: "Recommended", color: "bg-green-50 border-green-200" },
  { name: "Working Capital", amount: "₹1,50,000", rate: "14% p.a.", tenure: "18 months", tag: "", color: "bg-blue-50 border-blue-200" },
  { name: "Growth Loan", amount: "₹2,50,000", rate: "16% p.a.", tenure: "24 months", tag: "Max Eligible", color: "bg-purple-50 border-purple-200" },
];

export function LoanEligibilityScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader
        title="Loan Eligibility"
        subtitle="AI-estimated assessment"
        onBack={() => navigate("credit-score")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Main Eligibility Card */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-5 text-primary-foreground">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/70" style={{ fontSize: "0.75rem" }}>ESTIMATED ELIGIBLE AMOUNT</p>
              <p style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>₹2,50,000</p>
              <p className="text-primary-foreground/70 mt-1" style={{ fontSize: "0.75rem" }}>Recommended: ₹50,000 – ₹1,50,000</p>
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
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "white" }}>78%</span>
                </div>
              </div>
              <p className="text-primary-foreground/70 text-center" style={{ fontSize: "0.65rem", marginTop: "-0.25rem" }}>
                Approval
                <br />Probability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
            <CheckCircle2 size={14} className="text-green-300" />
            <p className="text-primary-foreground" style={{ fontSize: "0.8rem" }}>
              You are <strong>eligible</strong> for unsecured business loans
            </p>
          </div>
        </div>

        {/* Loan Products */}
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
                    <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>
                      💰 Up to {p.amount}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>
                      📊 {p.rate}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>
                      📅 {p.tenure}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Factors */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Key Factors Affecting Eligibility</p>
          <div className="flex flex-col gap-2">
            {factors.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      f.status === "good" ? "bg-green-50" : f.status === "warn" ? "bg-yellow-50" : "bg-red-50"
                    }`}
                  >
                    <Icon size={16} className={f.status === "good" ? "text-green-600" : f.status === "warn" ? "text-yellow-600" : "text-red-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{f.label}</p>
                      <span
                        className={`${f.status === "good" ? "text-green-600" : f.status === "warn" ? "text-yellow-600" : "text-red-500"}`}
                        style={{ fontSize: "0.8rem", fontWeight: 700 }}
                      >
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

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Eligibility calculated by AI model using credit score + transaction data.
            Integrated with NBFC/Bank loan APIs (future). Loan officer view available in Admin.
            Frappe doctype: Loan Eligibility Assessment.
          </p>
        </div>
      </div>
    </div>
  );
}
