/* eslint-disable */
import { useState, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { Zap, TrendingUp, TrendingDown, Package, Sun, Loader2 } from "lucide-react";
import { ScreenHeader } from "../shared/ScreenHeader";
import { getTransactions, getInsights } from "../../lib/api";

interface Props {
  navigate: (screen: string) => void;
}

const insightColors: Record<string, { color: string; badgeColor: string; badge: string; icon: string }> = {
  opportunity: { color: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800", badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300", badge: "Opportunity", icon: "📈" },
  tip:         { color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",    badge: "Score Tip",   icon: "💡" },
  alert:       { color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800", badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300", badge: "Alert", icon: "⚠️" },
  insight:     { color: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300", badge: "Insight", icon: "🎯" },
};

export function VendorInsightsScreen({ navigate }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    Promise.all([
      getTransactions(token),
      getInsights(token),
    ]).then(([txRes, insRes]) => {
      if (txRes.data) setTransactions(txRes.data as any[]);
      if (insRes.data) setInsights(insRes.data as any[]);
      setLoading(false);
    });
  }, []);

  // Compute monthly sales vs expenses from real transaction data
  const monthlySales = (() => {
    const map: Record<string, { month: string; sales: number; expenses: number }> = {};
    transactions.forEach((t) => {
      if (!t.transaction_date) return;
      const d = new Date(t.transaction_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString(undefined, { month: "short" });
      if (!map[key]) map[key] = { month: label, sales: 0, expenses: 0 };
      if (t.type === "Sale") map[key].sales += Number(t.amount);
      else map[key].expenses += Number(t.amount);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([, v]) => v);
  })();

  // Sales by weekday
  const weekdayData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map: Record<string, number> = {};
    days.forEach((d) => (map[d] = 0));
    transactions.forEach((t) => {
      if (t.type !== "Sale" || !t.transaction_date) return;
      const day = days[new Date(t.transaction_date).getDay()];
      map[day] += Number(t.amount);
    });
    return days.map((d) => ({ day: d, sales: map[d] }));
  })();

  const bestDay = weekdayData.reduce((a, b) => (a.sales >= b.sales ? a : b), { day: "—", sales: 0 });

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  transactions.filter((t) => t.type === "Sale").forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });
  const totalSales = Object.values(categoryMap).reduce((a, b) => a + b, 0);
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // Month-on-month growth
  const growthPct = monthlySales.length >= 2
    ? (((monthlySales.at(-1)!.sales - monthlySales.at(-2)!.sales) / (monthlySales.at(-2)!.sales || 1)) * 100).toFixed(1)
    : "0.0";
  const growthPositive = parseFloat(growthPct) >= 0;

  return (
    <div className="flex flex-col min-h-full bg-background">
      <ScreenHeader title="Vendor Insights" subtitle="AI-powered analytics" onBack={() => navigate("dashboard")} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
            <p className="text-muted-foreground text-sm">Analysing your transactions...</p>
          </div>
        ) : (
          <>
            {/* Growth Summary Pills */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`${growthPositive ? "bg-green-50 border-green-100 dark:bg-green-950/30 dark:border-green-800" : "bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-800"} border rounded-2xl p-3 text-center`}>
                {growthPositive ? <TrendingUp size={16} className="text-green-600 mx-auto mb-1" /> : <TrendingDown size={16} className="text-red-500 mx-auto mb-1" />}
                <p className={growthPositive ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-400"} style={{ fontSize: "1rem", fontWeight: 800 }}>{growthPositive ? "+" : ""}{growthPct}%</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>MoM Sales</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-800 rounded-2xl p-3 text-center">
                <Package size={16} className="text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-blue-700 dark:text-blue-300" style={{ fontSize: "1rem", fontWeight: 800 }}>{transactions.length}</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>Transactions</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 dark:bg-purple-950/30 dark:border-purple-800 rounded-2xl p-3 text-center">
                <Sun size={16} className="text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-purple-700 dark:text-purple-300" style={{ fontSize: "1rem", fontWeight: 800 }}>{bestDay.day}</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.65rem" }}>Peak Day</p>
              </div>
            </div>

            {/* Monthly Trends Chart */}
            {monthlySales.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl p-4">
                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Monthly Sales vs Expenses</p>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={monthlySales} barSize={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} formatter={(v) => `₹${Number(v ?? 0).toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="sales" fill="#2563EB" radius={[3, 3, 0, 0]} name="Sales" />
                    <Bar dataKey="expenses" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-muted-foreground text-sm">No transaction data yet. Add sales to see trends.</p>
              </div>
            )}

            {/* Sales Growth Trend */}
            {monthlySales.length > 1 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>Sales Growth Trend</p>
                  <span className={`flex items-center gap-1 ${growthPositive ? "text-green-600" : "text-red-500"}`} style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                    {growthPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {growthPct}% MoM
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={monthlySales}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => `₹${Number(v ?? 0).toLocaleString()}`} />
                    <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2.5} fill="url(#salesGrad)" dot={{ fill: "#2563EB", r: 2.5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Peak Day Analysis */}
            {weekdayData.some((d) => d.sales > 0) && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Sales by Day of Week</p>
                <ResponsiveContainer width="100%" height={90}>
                  <BarChart data={weekdayData} barSize={16}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v) => `₹${Number(v ?? 0).toLocaleString()}`} />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                      {weekdayData.map((entry, i) => (
                        <Cell key={i} fill={entry.day === bestDay.day ? "#2563EB" : "#C7D2FE"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {bestDay.day !== "—" && (
                  <p className="text-center text-muted-foreground mt-1" style={{ fontSize: "0.7rem" }}>
                    {bestDay.day} is your best day — ₹{bestDay.sales.toLocaleString()} in sales
                  </p>
                )}
              </div>
            )}

            {/* Category Breakdown */}
            {categoryBreakdown.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>Revenue by Category</p>
                <div className="flex flex-col gap-2">
                  {categoryBreakdown.map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-muted-foreground" style={{ fontSize: "0.8rem", minWidth: 80 }}>{c.name}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.value}%`, opacity: 0.7 + (c.value / 100) * 0.3 }} />
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, minWidth: 30 }}>{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights from backend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={15} className="text-primary" />
                <p style={{ fontSize: "0.8rem", fontWeight: 700 }}>AI Recommendations</p>
              </div>
              {insights.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <p className="text-muted-foreground text-sm">Add more transactions to unlock AI-powered insights.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {insights.map((r, i) => {
                    const style = insightColors[r.type] || insightColors.insight;
                    return (
                      <div key={i} className={`${style.color} border rounded-2xl p-3.5`}>
                        <div className="flex items-start gap-3">
                          <span style={{ fontSize: "1.2rem" }}>{style.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>{r.title}</p>
                              <span className={`px-2 py-0.5 rounded-full ${style.badgeColor}`} style={{ fontSize: "0.6rem", fontWeight: 700 }}>{style.badge}</span>
                            </div>
                            <p className="text-muted-foreground" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>{r.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
