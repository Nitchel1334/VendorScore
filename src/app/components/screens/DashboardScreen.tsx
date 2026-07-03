import { TrendingUp, TrendingDown, Mic, PlusCircle, BarChart2, Star, ChevronRight, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";

interface Props {
  navigate: (screen: string) => void;
}

const stats = [
  { label: "Today's Sales", value: "₹4,230", change: "+18%", up: true, color: "bg-green-50 border-green-100", valueColor: "text-green-700" },
  { label: "Monthly Sales", value: "₹85,400", change: "+12%", up: true, color: "bg-blue-50 border-blue-100", valueColor: "text-blue-700" },
  { label: "Expenses", value: "₹12,800", change: "+3%", up: false, color: "bg-red-50 border-red-100", valueColor: "text-red-700" },
  { label: "Est. Profit", value: "₹72,600", change: "+15%", up: true, color: "bg-purple-50 border-purple-100", valueColor: "text-purple-700" },
];

const quickActions = [
  { id: "manual-transaction", label: "Add Transaction", icon: PlusCircle, color: "bg-primary", fg: "text-primary-foreground" },
  { id: "voice-transaction", label: "Voice Entry", icon: Mic, color: "bg-accent", fg: "text-white" },
  { id: "reports", label: "Reports", icon: BarChart2, color: "bg-purple-500", fg: "text-white" },
  { id: "credit-score", label: "Credit Score", icon: Star, color: "bg-green-500", fg: "text-white" },
];

const recentTxns = [
  { type: "sale", name: "Priya Sharma", amount: "₹1,200", mode: "UPI", time: "2h ago", up: true },
  { type: "expense", name: "Vegetable Supplier", amount: "₹450", mode: "Cash", time: "4h ago", up: false },
  { type: "sale", name: "Mohan Reddy", amount: "₹2,800", mode: "Card", time: "Yesterday", up: true },
  { type: "sale", name: "Anita Krishnan", amount: "₹780", mode: "UPI", time: "Yesterday", up: true },
];

export function DashboardScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pt-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70" style={{ fontSize: "0.8rem" }}>
              Good morning 👋
            </p>
            <h2 className="text-primary-foreground" style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              Ravi Kumar
            </h2>
            <p className="text-primary-foreground/60" style={{ fontSize: "0.72rem" }}>
              Ravi Kirana Store · Bangalore
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative"
              onClick={() => {}}
            >
              <span className="text-primary-foreground">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </div>

        {/* Credit Score + Loan badge */}
        <div
          className="bg-white/15 rounded-2xl p-3 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("credit-score")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Star size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-primary-foreground/70" style={{ fontSize: "0.7rem" }}>Credit Score</p>
              <p className="text-primary-foreground" style={{ fontSize: "1.2rem", fontWeight: 800 }}>742</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-primary-foreground/70" style={{ fontSize: "0.7rem" }}>Loan Eligibility</p>
              <p className="text-green-300" style={{ fontSize: "0.9rem", fontWeight: 700 }}>✓ Eligible</p>
            </div>
            <ChevronRight size={16} className="text-primary-foreground/60" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} border rounded-2xl p-3`}>
              <p className="text-muted-foreground" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                {s.label}
              </p>
              <p className={`${s.valueColor} mt-1`} style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {s.value}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {s.up ? (
                  <TrendingUp size={11} className="text-green-600" />
                ) : (
                  <TrendingDown size={11} className="text-red-500" />
                )}
                <span className={s.up ? "text-green-600" : "text-red-500"} style={{ fontSize: "0.68rem", fontWeight: 700 }}>
                  {s.change} this month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Quick Actions</p>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(a.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-2xl ${a.color} flex items-center justify-center shadow-md`}>
                    <Icon size={20} className={a.fg} />
                  </div>
                  <span className="text-muted-foreground text-center leading-tight" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Insight Strip */}
        <div
          className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("insights")}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-indigo-800" style={{ fontSize: "0.75rem", fontWeight: 700 }}>AI Insight</p>
            <p className="text-indigo-600 truncate" style={{ fontSize: "0.7rem" }}>
              Your sales on Saturdays are 40% higher. Consider stocking up on Fridays.
            </p>
          </div>
          <ChevronRight size={14} className="text-indigo-400 shrink-0" />
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>Recent Transactions</p>
            <button onClick={() => navigate("transaction-history")} className="text-primary" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              View All →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentTxns.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.up ? "bg-green-50" : "bg-red-50"}`}>
                  {t.up ? (
                    <ArrowUpRight size={16} className="text-green-600" />
                  ) : (
                    <ArrowDownLeft size={16} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {t.name}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>
                    {t.mode} · {t.time}
                  </p>
                </div>
                <span
                  className={t.up ? "text-green-600" : "text-red-500"}
                  style={{ fontSize: "0.9rem", fontWeight: 700 }}
                >
                  {t.up ? "+" : "-"}{t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Annotation */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-700" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            📋 ANNOTATION: Dashboard fetches live data from Frappe backend. Credit score
            recalculated daily via AI model. Loan eligibility updated weekly.
            Pull-to-refresh supported.
          </p>
        </div>
      </div>
    </div>
  );
}
